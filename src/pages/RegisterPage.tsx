import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, ChevronLeft, Sparkles } from 'lucide-react';
import { AuthService } from '../services/authService';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Estados de erro por campo
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Estados de submissão
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'name':
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'Informe seu nome completo (não são aceitos apenas espaços).';
        }
        if (value.trim().length < 3) {
          return 'O nome deve conter ao menos 3 caracteres.';
        }
        return '';

      case 'email':
        if (!value || typeof value !== 'string' || value.trim().length === 0) {
          return 'O e-mail é obrigatório.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
          return 'Informe um formato de e-mail válido (ex: nome@email.com).';
        }
        return '';

      case 'password':
        if (!value || value.length === 0) {
          return 'A senha é obrigatória.';
        }
        if (value.length < 6) {
          return 'A senha deve conter no mínimo 6 caracteres.';
        }
        return '';

      case 'confirmPassword':
        if (!value || value.length === 0) {
          return 'Confirme sua senha.';
        }
        if (value !== password) {
          return 'As senhas informadas não coincidem.';
        }
        return '';

      case 'termsAccepted':
        if (!value) {
          return 'É necessário concordar com os termos de uso demonstrativos.';
        }
        return '';

      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let val: any;
    if (field === 'name') val = name;
    else if (field === 'email') val = email;
    else if (field === 'password') val = password;
    else if (field === 'confirmPassword') val = confirmPassword;
    else if (field === 'termsAccepted') val = termsAccepted;

    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos os campos
    const newErrors: Record<string, string> = {
      name: validateField('name', name),
      email: validateField('email', email),
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword),
      termsAccepted: validateField('termsAccepted', termsAccepted),
    };

    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      termsAccepted: true,
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((msg) => msg.length > 0);
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      // Dispara o AuthService desacoplado (sem persistir senha no cliente)
      const result = await AuthService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.success) {
        if (AuthService.isConfigured()) {
          navigate('/app', { replace: true });
        } else {
          setSuccessMessage(
            result.message || 'Cadastro preparado com sucesso. A autenticação será ativada com Firebase.'
          );
        }
      } else {
        setErrors((prev) => ({ ...prev, general: result.message || 'Falha ao processar cadastro.' }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: 'Ocorreu um erro inesperado ao processar o cadastro.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Botão de retorno */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-2">
        <Link
          to="/"
          id="btn-register-back-home"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-lg p-1"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span>Voltar para a página pública</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-700/20">
          <Leaf className="h-8 w-8" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
          Crie sua conta
        </h1>
        <p className="mt-1 text-sm text-slate-500 font-medium">
          Junte-se ao EcoRetorna e acompanhe seu impacto positivo
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Sucesso temporário */}
          {successMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="text-base font-bold text-emerald-950">Cadastro Preparado!</h2>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {successMessage}
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  id="btn-success-go-login"
                  className="w-full inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition focus-visible:outline-2 focus-visible:outline-emerald-800"
                >
                  <span>Ir para tela de Login</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Aviso educacional */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Ambiente acadêmico. Nenhum dado financeiro ou confidencial será solicitado.
                </span>
              </div>

              {errors.general && (
                <div
                  role="alert"
                  className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800 flex items-start gap-2.5"
                >
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* 1. Nome Completo */}
                <div>
                  <label
                    htmlFor="register-name"
                    className="block text-xs font-bold text-slate-700 uppercase mb-1"
                  >
                    Nome completo
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (touched.name) {
                        setErrors((prev) => ({ ...prev, name: validateField('name', e.target.value) }));
                      }
                    }}
                    onBlur={() => handleBlur('name')}
                    placeholder="Seu nome completo"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'error-register-name' : undefined}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none transition ${
                      errors.name && touched.name
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-600'
                        : 'border-slate-300 focus:border-emerald-600'
                    }`}
                    required
                  />
                  {errors.name && touched.name && (
                    <div
                      id="error-register-name"
                      className="mt-1 flex items-center gap-1.5 text-xs font-medium text-rose-700"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                {/* 2. E-mail */}
                <div>
                  <label
                    htmlFor="register-email"
                    className="block text-xs font-bold text-slate-700 uppercase mb-1"
                  >
                    E-mail
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email) {
                        setErrors((prev) => ({ ...prev, email: validateField('email', e.target.value) }));
                      }
                    }}
                    onBlur={() => handleBlur('email')}
                    placeholder="seu.email@exemplo.com"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'error-register-email' : undefined}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none transition ${
                      errors.email && touched.email
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-600'
                        : 'border-slate-300 focus:border-emerald-600'
                    }`}
                    required
                  />
                  {errors.email && touched.email && (
                    <div
                      id="error-register-email"
                      className="mt-1 flex items-center gap-1.5 text-xs font-medium text-rose-700"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                {/* 3. Senha */}
                <div>
                  <label
                    htmlFor="register-password"
                    className="block text-xs font-bold text-slate-700 uppercase mb-1"
                  >
                    Senha (mínimo 6 caracteres)
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password) {
                        setErrors((prev) => ({ ...prev, password: validateField('password', e.target.value) }));
                      }
                      if (touched.confirmPassword && confirmPassword) {
                        setErrors((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value === confirmPassword ? '' : 'As senhas informadas não coincidem.',
                        }));
                      }
                    }}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'error-register-password' : undefined}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none transition ${
                      errors.password && touched.password
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-600'
                        : 'border-slate-300 focus:border-emerald-600'
                    }`}
                    required
                  />
                  {errors.password && touched.password && (
                    <div
                      id="error-register-password"
                      className="mt-1 flex items-center gap-1.5 text-xs font-medium text-rose-700"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                {/* 4. Confirmar Senha */}
                <div>
                  <label
                    htmlFor="register-confirm-password"
                    className="block text-xs font-bold text-slate-700 uppercase mb-1"
                  >
                    Confirmar senha
                  </label>
                  <input
                    id="register-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (touched.confirmPassword) {
                        setErrors((prev) => ({
                          ...prev,
                          confirmPassword: validateField('confirmPassword', e.target.value),
                        }));
                      }
                    }}
                    onBlur={() => handleBlur('confirmPassword')}
                    placeholder="••••••"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? 'error-register-confirm' : undefined}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none transition ${
                      errors.confirmPassword && touched.confirmPassword
                        ? 'border-rose-400 bg-rose-50/30 focus:border-rose-600'
                        : 'border-slate-300 focus:border-emerald-600'
                    }`}
                    required
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div
                      id="error-register-confirm"
                      className="mt-1 flex items-center gap-1.5 text-xs font-medium text-rose-700"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>

                {/* 5. Checkbox de Termos */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      id="register-terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        if (touched.termsAccepted) {
                          setErrors((prev) => ({
                            ...prev,
                            termsAccepted: validateField('termsAccepted', e.target.checked),
                          }));
                        }
                      }}
                      onBlur={() => handleBlur('termsAccepted')}
                      disabled={isSubmitting}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-snug">
                      Li e concordo com os termos de uso demonstrativos do projeto.
                    </span>
                  </label>
                  {errors.termsAccepted && touched.termsAccepted && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-700">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.termsAccepted}</span>
                    </div>
                  )}
                </div>

                {/* Botão de Submissão */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="btn-submit-register"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-emerald-800 disabled:opacity-60 cursor-pointer min-h-[44px]"
                >
                  {isSubmitting ? 'Processando cadastro...' : 'Criar conta'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>

              {/* Link para Login */}
              <div className="text-center text-xs text-slate-600 border-t border-slate-100 pt-4">
                <span>Já possui uma conta? </span>
                <Link
                  to="/login"
                  id="link-go-to-login"
                  className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-sm"
                >
                  Entrar
                </Link>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 border border-slate-100 flex items-start gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Suas informações serão integradas de forma segura ao Firebase Authentication na próxima etapa.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
