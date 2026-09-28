/**
 * EcoRetorna - Simulador Técnico de Reciclagem (Demonstração Acadêmica)
 *
 * Simula tecnicamente um evento de coleta externa recebido por equipamento
 * ou sistema externo fictício.
 *
 * Utiliza o Firebase Admin SDK com serviceAccountKey.json ou GOOGLE_APPLICATION_CREDENTIALS.
 * Cria EXCLUSIVAMENTE um novo registro em 'recyclingRecords'.
 *
 * NÃO altera users, pointsBalance, ranking, badges ou histórico diretamente.
 */

import { initializeApp, cert, getApps, deleteApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface ParsedArgs {
  email?: string;
  material?: string;
  quantity?: number;
  collectionPoint?: string;
  dryRun?: boolean;
  help?: boolean;
}

function parseCommandLineArgs(argv: string[]): ParsedArgs {
  const result: ParsedArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      result.help = true;
      continue;
    }
    if (arg === '--dry-run' || arg === '--dryRun') {
      result.dryRun = true;
      continue;
    }
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      let key: string;
      let val: string;
      if (eqIdx !== -1) {
        key = arg.slice(2, eqIdx);
        val = arg.slice(eqIdx + 1);
      } else {
        key = arg.slice(2);
        val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      }

      const normalizedKey = key.toLowerCase().replace(/[-_]/g, '');
      if (normalizedKey === 'email') result.email = val;
      else if (normalizedKey === 'material' || normalizedKey === 'materialid') result.material = val;
      else if (normalizedKey === 'quantity' || normalizedKey === 'qtd') result.quantity = Number(val);
      else if (normalizedKey === 'collectionpoint' || normalizedKey === 'ecoponto' || normalizedKey === 'point') result.collectionPoint = val;
    }
  }
  return result;
}

function printUsage(): void {
  console.log(`
Uso do Simulador de Reciclagem:
  npm run demo:recycling -- --email <email> --material <materialId> --quantity <quantidade> --collection-point "<nome do ecoponto>"

Parâmetros:
  --email             E-mail do participante cadastrado no Firebase Auth
  --material          ID do material (ex: pet_2l, lata_aluminio)
  --quantity          Quantidade de unidades recicladas (número inteiro positivo)
  --collection-point  Nome exato do ecoponto cadastrado (ex: "EcoPonto SANEFRAI")
  --dry-run           (Opcional) Executa validações e cálculos sem gravar no Firestore
  --help, -h          (Opcional) Exibe esta mensagem de ajuda

Exemplo:
  npm run demo:recycling -- --email camila.ribeiro@exemplo.ecoretorna.com.br --material pet_2l --quantity 50 --collection-point "EcoPonto SANEFRAI" --dry-run
`);
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatCO2(value: number): string {
  return (
    (value || 0).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' kg'
  );
}

async function main() {
  const args = parseCommandLineArgs(process.argv.slice(2));

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  // 1. Validação dos argumentos de entrada
  const missingArgs: string[] = [];
  if (!args.email) missingArgs.push('--email');
  if (!args.material) missingArgs.push('--material');
  if (args.quantity === undefined || isNaN(args.quantity)) missingArgs.push('--quantity');
  if (!args.collectionPoint) missingArgs.push('--collection-point');

  if (missingArgs.length > 0) {
    console.error(`❌ Parâmetros obrigatórios ausentes ou inválidos: ${missingArgs.join(', ')}`);
    printUsage();
    process.exit(1);
  }

  // Validação estrita de quantidade inteira e positiva (NUNCA usar Math.round)
  if (!Number.isInteger(args.quantity) || args.quantity! <= 0) {
    console.error('❌ A quantidade deve ser um número inteiro positivo.');
    process.exit(1);
  }

  const email = args.email!.trim();
  const materialId = args.material!.trim();
  const quantity = args.quantity!;
  const collectionPointArg = args.collectionPoint!.trim();

  // 2. Localização estrita da credencial de conta de serviço (SOMENTE ambiente ou raiz do participante)
  const candidatePaths = [
    process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim(),
    path.join(projectRoot, 'serviceAccountKey.json'),
  ].filter(Boolean) as string[];

  let serviceAccountPath: string | null = null;
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      serviceAccountPath = p;
      break;
    }
  }

  if (!serviceAccountPath) {
    console.error('❌ Chave de conta de serviço não encontrada!');
    console.error('   O simulador requer as credenciais do Firebase Admin SDK.');
    console.error('   Configuração necessária:');
    console.error('   1. Defina a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS apontando para a chave JSON, OU');
    console.error('   2. Salve o arquivo "serviceAccountKey.json" diretamente na raiz do projeto do participante.');
    process.exit(1);
  }

  let serviceAccount: ServiceAccount;
  try {
    const rawContent = fs.readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(rawContent);
  } catch (err: any) {
    console.error(`❌ Erro ao ler/parsear arquivo de chave em ${serviceAccountPath}:`, err?.message || err);
    process.exit(1);
  }

  // 3. Inicialização do Firebase Admin SDK
  const app = getApps().length > 0
    ? getApps()[0]
    : initializeApp({ credential: cert(serviceAccount) });

  const auth = getAuth(app);
  const db = getFirestore(app);

  try {
    // 4. Validação do Participante
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (err: any) {
      console.error(`❌ Participante não encontrado no Firebase Authentication com o e-mail: "${email}".`);
      console.error('   Nunca crie usuários automaticamente pelo simulador.');
      await deleteApp(app);
      process.exit(1);
    }

    const uid = userRecord.uid;
    const userDocRef = db.collection('users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.error(`❌ Documento users/${uid} não existe no Firestore.`);
      console.error('   O participante precisa possuir um perfil válido no Firestore.');
      await deleteApp(app);
      process.exit(1);
    }

    const userData = userDoc.data() || {};
    if (userData.role !== 'participant') {
      console.error(`❌ O usuário informado não possui role "participant" (role atual: "${userData.role}"). Operação cancelada.`);
      await deleteApp(app);
      process.exit(1);
    }

    if (userData.active !== true) {
      console.error(`❌ O participante informado está inativo (active !== true). Operação cancelada.`);
      await deleteApp(app);
      process.exit(1);
    }

    const participantName = userData.name || userRecord.displayName || email;

    // 5. Validação Estrita do Material (Sem fallbacks)
    const materialDocRef = db.collection('materials').doc(materialId);
    const materialDoc = await materialDocRef.get();

    if (!materialDoc.exists) {
      console.error(`❌ Material "${materialId}" não encontrado na coleção 'materials'. Operação cancelada.`);
      await deleteApp(app);
      process.exit(1);
    }

    const matData = materialDoc.data() || {};

    // 5.1 active === true
    if (matData.active !== true) {
      console.error(`❌ O material "${materialId}" está inativo ou sem active=true no Firestore (active: ${matData.active}). Operação cancelada.`);
      await deleteApp(app);
      process.exit(1);
    }

    // 5.2 Nome válido
    if (!matData.name || typeof matData.name !== 'string' || matData.name.trim() === '') {
      console.error(`❌ O material "${materialId}" não possui um nome válido no Firestore. Operação cancelada.`);
      await deleteApp(app);
      process.exit(1);
    }
    const materialName: string = matData.name.trim();

    // 5.3 Categoria estrita: apenas "pet" ou "aluminio"
    if (matData.category !== 'pet' && matData.category !== 'aluminio') {
      console.error(`❌ O material "${materialId}" possui categoria inválida ("${matData.category}"). O simulador aceita estritamente apenas "pet" ou "aluminio". Operação cancelada.`);
      await deleteApp(app);
      process.exit(1);
    }
    const category: 'pet' | 'aluminio' = matData.category;

    // 5.4 pointsPerUnit numérico > 0
    const rawPointsPerUnit = typeof matData.pointsPerUnit === 'number' ? matData.pointsPerUnit : Number(matData.pointsPerUnit);
    if (matData.pointsPerUnit === undefined || matData.pointsPerUnit === null || isNaN(rawPointsPerUnit) || rawPointsPerUnit <= 0) {
      console.error(`❌ O material "${materialId}" não possui pointsPerUnit numérico válido > 0 no Firestore. Operação cancelada.`);
      await deleteApp(app);
      process.exit(1);
    }
    const pointsPerUnit = rawPointsPerUnit;

    // 5.5 co2eFactor numérico > 0
    const rawCo2e = matData.co2eFactor !== undefined ? matData.co2eFactor : matData.co2eAvoidedKgPerUnit;
    const parsedCo2e = typeof rawCo2e === 'number' ? rawCo2e : Number(rawCo2e);
    if (rawCo2e === undefined || rawCo2e === null || isNaN(parsedCo2e) || parsedCo2e <= 0) {
      console.error(`❌ O material "${materialId}" não possui co2eFactor numérico válido > 0 no Firestore. Operação cancelada.`);
      await deleteApp(app);
      process.exit(1);
    }
    const co2eFactor = parsedCo2e;

    // 6. Configurações Gerais Estritas (Settings - Sem fallback de R$ 0,125)
    let pointValueBRL: number;
    try {
      const settingsDoc = await db.collection('settings').doc('general').get();
      if (!settingsDoc.exists) {
        console.error(`❌ Documento settings/general não encontrado no Firestore. Operação cancelada.`);
        await deleteApp(app);
        process.exit(1);
      }

      const sData = settingsDoc.data() || {};
      const parsedPointValue = typeof sData.pointValueBRL === 'number' ? sData.pointValueBRL : Number(sData.pointValueBRL);
      if (sData.pointValueBRL === undefined || sData.pointValueBRL === null || isNaN(parsedPointValue) || parsedPointValue <= 0) {
        console.error(`❌ O campo pointValueBRL em settings/general é ausente ou inválido (deve ser numérico > 0). Operação cancelada.`);
        await deleteApp(app);
        process.exit(1);
      }
      pointValueBRL = parsedPointValue;
    } catch (err: any) {
      console.error(`❌ Erro ao ler settings/general do Firestore:`, err?.message || err);
      await deleteApp(app);
      process.exit(1);
    }

    // 7. Validação Estrita do Ecoponto (Collection Point - active === true)
    const pointsSnap = await db.collection('collectionPoints').get();
    let matchedPointName: string | null = null;
    const activePointsList: string[] = [];

    pointsSnap.forEach((docSnap) => {
      const p = docSnap.data();
      if (p.active === true) {
        const pName = String(p.name || '').trim();
        if (pName) {
          activePointsList.push(pName);
          if (pName.toLowerCase() === collectionPointArg.toLowerCase()) {
            matchedPointName = pName;
          }
        }
      }
    });

    if (!matchedPointName) {
      console.error(`❌ Ecoponto "${collectionPointArg}" não encontrado ou inativo (active !== true). Operação cancelada.`);
      if (activePointsList.length > 0) {
        console.log('\nEcopontos ativos disponíveis:');
        activePointsList.forEach((pt) => console.log(`  - "${pt}"`));
      }
      await deleteApp(app);
      process.exit(1);
    }

    // 8. Cálculo de Pontuação e Campanhas Concorrentes (active === true)
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const campaignsSnap = await db.collection('campaigns').get();
    interface CampaignItem {
      id: string;
      title: string;
      type: 'multiplier' | 'quantity_bonus';
      materialId: string;
      multiplier?: number;
      minimumQuantity?: number;
      bonusPoints?: number;
      startDate: string;
      endDate: string;
      active: boolean;
    }

    const matchingCampaigns: CampaignItem[] = [];
    campaignsSnap.forEach((docSnap) => {
      const c = docSnap.data();
      const active = c.active === true;
      const startDate = c.startDate || '';
      const endDate = c.endDate || '';
      const isDateValid = startDate && endDate && todayStr >= startDate && todayStr <= endDate;

      if (active && isDateValid && c.materialId === materialId) {
        matchingCampaigns.push({
          id: docSnap.id,
          title: c.title || 'Campanha Promocional',
          type: c.type || 'multiplier',
          materialId: c.materialId,
          multiplier: c.multiplier !== undefined ? Number(c.multiplier) : undefined,
          minimumQuantity: c.minimumQuantity !== undefined ? Number(c.minimumQuantity) : undefined,
          bonusPoints: c.bonusPoints !== undefined ? Number(c.bonusPoints) : undefined,
          startDate,
          endDate,
          active,
        });
      }
    });

    // Se houver mais de uma campanha ativa aplicável, cancelar imediatamente
    if (matchingCampaigns.length > 1) {
      console.error('❌ Existe mais de uma campanha ativa para este material. Resolva a sobreposição no Admin antes de registrar a coleta.');
      await deleteApp(app);
      process.exit(1);
    }

    const basePoints = Math.round(quantity * pointsPerUnit);
    let campaignBonus = 0;
    let appliedCampaign: CampaignItem | null = null;

    if (matchingCampaigns.length === 1) {
      const camp = matchingCampaigns[0];
      if (camp.type === 'multiplier' && camp.multiplier && camp.multiplier > 1) {
        const totalPoints = Math.round(basePoints * camp.multiplier);
        campaignBonus = totalPoints - basePoints;
        appliedCampaign = camp;
      } else if (camp.type === 'quantity_bonus' && camp.minimumQuantity && camp.bonusPoints) {
        if (quantity >= camp.minimumQuantity) {
          const tiers = Math.floor(quantity / camp.minimumQuantity);
          campaignBonus = tiers * camp.bonusPoints;
          appliedCampaign = camp;
        }
      }
    }

    const pointsEarned = basePoints + campaignBonus;
    const reaisEquivalent = Number((pointsEarned * pointValueBRL).toFixed(2));
    const co2eAvoidedKg = Number((quantity * co2eFactor).toFixed(2));

    // 9. Resumo / Preview
    console.log('\n========================================');
    console.log('SIMULAÇÃO DE COLETA ECORETORNA');
    console.log('========================================');
    console.log(`Participante: ${participantName}`);
    console.log(`UID: ${uid}`);
    console.log(`Material: ${materialName}`);
    console.log(`Quantidade: ${quantity}`);
    console.log(`Ecoponto: ${matchedPointName}\n`);
    console.log(`Pontos base: ${basePoints}`);
    if (appliedCampaign) {
      console.log(`Campanha: ${appliedCampaign.title}`);
      console.log(`Bônus: +${campaignBonus}`);
    } else {
      console.log('Campanha: Nenhuma ativa para o material');
      console.log('Bônus: 0');
    }
    console.log(`Total: ${pointsEarned} pontos\n`);
    console.log(`Equivalência: ${formatBRL(reaisEquivalent)}`);
    console.log(`CO₂e evitado: ${formatCO2(co2eAvoidedKg)}`);
    console.log('========================================');

    if (args.dryRun) {
      console.log('\n🔍 [DRY-RUN] Modo de teste ativado. Nenhum dado foi gravado no Firestore.');
      await deleteApp(app);
      process.exit(0);
    }

    // 10. Gravação Atômica em recyclingRecords
    const recordPayload = {
      userId: uid,
      date: todayStr,
      materialId,
      materialName,
      materialCategory: category,
      quantity,
      basePoints,
      campaignBonus,
      pointsEarned,
      reaisEquivalent,
      co2eAvoidedKg,
      collectionPointName: matchedPointName,
      campaignId: appliedCampaign ? appliedCampaign.id : null,
      registeredByAdminUid: 'system:external-demo',
      source: 'external_demo_simulator',
      createdAt: now.toISOString(),
    };

    const docRef = await db.collection('recyclingRecords').add(recordPayload);

    console.log(`\n✅ Coleta registrada com sucesso no Firestore!`);
    console.log(`   Documento: recyclingRecords/${docRef.id}`);
    console.log(`   Origem: system:external-demo`);
    console.log(`   O participante visualizará o impacto, pontos e badges atualizados automaticamente.`);

    await deleteApp(app);
    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ Erro durante o processamento da simulação:', err?.message || err);
    await deleteApp(app);
    process.exit(1);
  }
}

main();
