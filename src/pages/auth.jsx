import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle2,
  Google,
  Github,
  X
} from 'lucide-react';

const Auth = ({ onClose, onLogin, onSignup }) => {
  const [mode, setMode] = useState('login'); // login | signup | reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validateForm = () => {
    setError(null);
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (mode !== 'reset' && !password) {
      setError('Please enter your password');
      return false;
    }

    if (mode === 'signup') {
      if (password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (!name.trim()) {
        setError('Please enter your name');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await onLogin({ email, password });
      } else if (mode === 'signup') {
        await onSignup({ email, password, name });
      } else {
        // Handle password reset
        setSuccess('Password reset email sent successfully');
        setMode('login');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (mode === 'reset') {
      return (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your email to receive a reset link
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {mode === 'login' 
              ? 'Sign in to continue' 
              : 'Get started with your free account'}
          </p>
        </div>

        <div className="space-y-4">
          {mode === 'signup' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {mode === 'signup' && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl"
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
        >
          <X size={24} />
        </button>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderForm()}

        {(error || success) && (
          <div className={`p-4 rounded-lg ${error ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
            <div className="flex items-center space-x-2">
              {error ? (
                <AlertCircle className="text-red-500 dark:text-red-400" size={20} />
              ) : (
                <CheckCircle2 className="text-green-500 dark:text-green-400" size={20} />
              )}
              <span className={`text-sm ${error ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                {error || success}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <>
              {mode === 'login' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Send Reset Link'}
            </>
          )}
        </button>

        {mode !== 'reset' && (
          <div className="flex items-center space-x-4">
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
            <span className="text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <hr className="flex-1 border-gray-200 dark:border-gray-700" />
          </div>
        )}

        {mode !== 'reset' && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center space-x-2 py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Google size={20} />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center space-x-2 py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Github size={20} />
              <span>GitHub</span>
            </button>
          </div>
        )}

        <div className="text-center space-y-3 text-sm">
          {mode === 'login' && (
            <>
              <button
                type="button"
                onClick={() => setMode('reset')}
                className="text-blue-500 hover:underline"
              >
                Forgot password?
              </button>
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-blue-500 hover:underline"
                >
                  Sign up
                </button>
              </p>
            </>
          )}

          {mode === 'signup' && (
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-500 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}

          {mode === 'reset' && (
            <p className="text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-blue-500 hover:underline"
              >
                Back to login
              </button>
            </p>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default Auth;