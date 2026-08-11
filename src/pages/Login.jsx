import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { loginWithMagicLink, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const { error: signInError } = await loginWithMagicLink(email);

    if (signInError) {
      setError(signInError.message);
    } else {
      setMessage('Check your email for the magic link!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">FieldReq</h1>
        <p className="text-gray-500 mb-8">Sign in via Magic Link</p>

        {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
        {message && <div className="text-green-600 mb-4 text-sm font-medium">{message}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6">
          We'll email you a one-time login link.
        </p>

        <Link to="/" className="block mt-6 text-sm text-gray-500 hover:text-gray-700">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}