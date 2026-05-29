import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff, FiLock, FiMail, FiAlertCircle, FiCheckCircle, FiShield, FiActivity, FiClock } from 'react-icons/fi';

const LoginPage = () => {
  const [email, setEmail] = useState('admin@hospital.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Inline validation
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'email') {
      if (!value.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(value)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'password') {
      if (!value) {
        newErrors.password = 'Password is required';
      } else if (value.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else {
        delete newErrors.password;
      }
    }

    setErrors(newErrors);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      validateField('email', value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      validateField('password', value);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    if (field === 'email') {
      validateField('email', email);
    } else if (field === 'password') {
      validateField('password', password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    validateField('email', email);
    validateField('password', password);
    setTouched({ email: true, password: true });

    // Check if there are any errors
    if (!validateEmail(email) || !password || password.length < 6) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const apiMessage = err?.response?.data?.message;
      const status = err?.response?.status;
      
      // Friendly error message handling
      let friendlyMessage = 'Login failed. Please try again.';
      
      if (status === 401 || status === 403) {
        friendlyMessage = 'Invalid email or password. Please check and try again.';
      } else if (status === 503) {
        friendlyMessage = 'Hospital database is temporarily unavailable. You can still use the demo credentials to sign in.';
      } else if (err?.message === 'Network Error' || !err?.response) {
        friendlyMessage = 'Server is temporarily unavailable. If the database is offline, use the demo credentials shown below.';
      } else if (apiMessage) {
        friendlyMessage = apiMessage;
      }
      
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const hasEmailError = touched.email && errors.email;
  const hasPasswordError = touched.password && errors.password;

  const highlights = [
    {
      title: 'Secure Records',
      value: 'AES-256',
      subtitle: 'Encrypted storage',
      tone: 'from-sky-500/25 to-cyan-400/20',
      border: 'border-sky-200/50',
      icon: FiShield,
      iconTone: 'text-sky-200',
    },
    {
      title: 'Live Operations',
      value: '24/7',
      subtitle: 'Realtime monitoring',
      tone: 'from-teal-500/25 to-emerald-400/20',
      border: 'border-teal-200/50',
      icon: FiActivity,
      iconTone: 'text-teal-200',
    },
    {
      title: 'Access Control',
      value: 'Role-Based',
      subtitle: 'Granular permissions',
      tone: 'from-indigo-500/25 to-sky-400/20',
      border: 'border-indigo-200/50',
      icon: FiClock,
      iconTone: 'text-indigo-200',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_28%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.2),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_22%),linear-gradient(145deg,#050816_0%,#0f172a_52%,#06211f_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:68px_68px]" />
      <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-sky-500/18 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-500/16 blur-3xl animate-pulse" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-8 px-4 py-6 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:py-10">
        <section className="flex min-h-[34rem] flex-col justify-between overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/6 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-8">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
            <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.85)]" />
            MediCare Secure Portal
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="max-w-xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-sky-200/80">Hospital operations reimagined</p>
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl xl:text-6xl">
                A calmer, faster way to manage patient care.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 md:text-lg">
                Sign in to a polished command center for appointments, billing, prescriptions, inventory, and patient records.
              </p>

              <div className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Avg. Sign In</p>
                  <p className="mt-1 font-semibold text-white">under 2s</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Security</p>
                  <p className="mt-1 font-semibold text-white">MFA-ready</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Audit Trail</p>
                  <p className="mt-1 font-semibold text-white">Always on</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/30 ring-1 ring-white/10">
              <div
                className="min-h-[18rem] bg-cover bg-center saturate-110"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 space-y-4 p-5">
                <div className="inline-flex rounded-full border border-amber-200/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
                  Trusted access
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {highlights.map((item) => (
                    <div key={item.title} className={`rounded-2xl border ${item.border} bg-gradient-to-br ${item.tone} p-3 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5`}>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">{item.title}</p>
                        <item.icon className={`h-4 w-4 ${item.iconTone}`} />
                      </div>
                      <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                      <p className="mt-1 text-xs text-white/70">{item.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 pt-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-sky-200/70">Smart workflows</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Reduce admin friction and move from sign-in to action quickly.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-teal-200/70">Real-time insights</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Track operations with an interface designed for busy teams.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Demo ready</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">Use the provided demo account when the backend database is offline.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[2rem] border border-white/10 bg-white/96 p-6 text-slate-900 shadow-[0_28px_100px_rgba(2,6,23,0.52)] backdrop-blur-2xl md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 via-cyan-500 to-teal-500 p-3 shadow-lg shadow-sky-500/20 ring-1 ring-white/30">
                  <FiLock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-wide text-slate-900">Welcome Back</p>
                  <p className="text-xs text-slate-500">Sign in to access your secure hospital dashboard</p>
                </div>
              </div>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700 shadow-sm">
                Protected
              </span>
            </div>

            <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              Secure Access • End-to-End Encrypted
            </div>

            <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm leading-6 text-amber-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              If the hospital database is unavailable, the app automatically supports demo sign-in with the credentials below.
            </div>

            {error && (
              <div className="mb-5 flex items-start rounded-2xl border border-red-200 bg-red-50 p-4">
                <FiAlertCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="text-sm leading-6 text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => handleBlur('email')}
                    placeholder=" "
                    className={`peer w-full rounded-2xl border bg-slate-50 px-4 py-3 pl-10 text-slate-900 placeholder-transparent transition-all shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] focus:outline-none focus:ring-2 ${
                      hasEmailError
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-slate-200 focus:border-sky-400 focus:ring-sky-100'
                    }`}
                  />
                  <FiMail
                    className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors ${
                      hasEmailError ? 'text-red-400' : 'text-slate-400 peer-focus:text-sky-500'
                    }`}
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-10 top-1/2 -translate-y-1/2 transform text-slate-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-sky-600"
                  >
                    Email Address
                  </label>
                </div>
                {hasEmailError && (
                  <p className="mt-2 flex items-center text-xs text-red-600">
                    <FiAlertCircle className="mr-1 h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => handleBlur('password')}
                    placeholder=" "
                    className={`peer w-full rounded-2xl border bg-slate-50 px-4 py-3 pl-10 pr-12 text-slate-900 placeholder-transparent transition-all shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] focus:outline-none focus:ring-2 ${
                      hasPasswordError
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                        : 'border-slate-200 focus:border-sky-400 focus:ring-sky-100'
                    }`}
                  />
                  <FiLock
                    className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors ${
                      hasPasswordError ? 'text-red-400' : 'text-slate-400 peer-focus:text-sky-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                  <label
                    htmlFor="password"
                    className="absolute left-10 top-1/2 -translate-y-1/2 transform text-slate-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-sky-600"
                  >
                    Password
                  </label>
                </div>
                {hasPasswordError && (
                  <p className="mt-2 flex items-center text-xs text-red-600">
                    <FiAlertCircle className="mr-1 h-3 w-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 text-sky-500 focus:ring-sky-300"
                    defaultChecked
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-sky-700 transition-colors hover:text-sky-800">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading || hasEmailError || hasPasswordError}
                className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-500 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-sky-700 hover:via-cyan-600 hover:to-teal-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FiCheckCircle className="mr-2 h-5 w-5" />
                    Login to Dashboard
                  </span>
                )}
                <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl bg-white/15 transition-transform duration-300 group-hover:scale-100" />
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-sky-200 bg-sky-50 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-900">Demo Credentials</p>
              <div className="mt-2 space-y-1 text-sm text-sky-800">
                <p>
                  Email: <span className="font-mono font-medium">admin@hospital.com</span>
                </p>
                <p>
                  Password: <span className="font-mono font-medium">admin123</span>
                </p>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-slate-500">
              Protected by industry-standard encryption
              <br />
              © 2026 MediCare Hospital Management. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
