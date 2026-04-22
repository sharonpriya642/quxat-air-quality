import { useState } from 'react';
import { supabase } from '../supabaseClient';

function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      if (isForgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'http://localhost:5173',
        });
        if (error) throw error;
        setMessage('Password reset email sent! Please check your inbox.');
      } else if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin(data.user);
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Registration successful! Please check your email to verify your account.');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const aqiLevels = [
    { label: 'Good',      value: 25,  color: '#00e400' },
    { label: 'Moderate',  value: 75,  color: '#ffff00' },
    { label: 'Poor',      value: 125, color: '#ff7e00' },
    { label: 'Unhealthy', value: 175, color: '#ff0000' },
    { label: 'Severe',    value: 250, color: '#8f3f97' },
    { label: 'Hazardous', value: 350, color: '#7e0023' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      overflow: 'hidden',
    }}>
      {/* Smoggy city background */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(180deg, #4a5568 0%, #718096 25%, #a0aec0 55%, #cbd5e0 80%, #e2e8f0 100%)',
        zIndex: 0,
      }} />

      {/* Smog haze layer */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(180,160,120,0.4) 0%, rgba(100,100,80,0.2) 60%, transparent 100%)',
        zIndex: 1,
      }} />

      {/* City silhouette */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: '35%',
        zIndex: 1,
        background: `
          radial-gradient(ellipse 120% 60% at 50% 100%, #2d3748 0%, transparent 70%)
        `,
      }} />

      {/* Buildings silhouette using CSS */}
      <svg style={{
        position: 'fixed',
        bottom: 0, left: 0,
        width: '100%',
        height: '45%',
        zIndex: 2,
        opacity: 0.85,
      }} viewBox="0 0 1440 300" preserveAspectRatio="none">
        {/* Background buildings */}
        <rect x="0"   y="180" width="60"  height="120" fill="#2d3748" />
        <rect x="10"  y="140" width="40"  height="160" fill="#2d3748" />
        <rect x="55"  y="160" width="50"  height="140" fill="#2d3748" />
        <rect x="100" y="120" width="35"  height="180" fill="#2d3748" />
        <rect x="130" y="150" width="55"  height="150" fill="#2d3748" />
        <rect x="180" y="100" width="45"  height="200" fill="#1a202c" />
        <rect x="220" y="130" width="60"  height="170" fill="#2d3748" />
        <rect x="275" y="110" width="40"  height="190" fill="#2d3748" />
        <rect x="310" y="140" width="70"  height="160" fill="#1a202c" />
        <rect x="375" y="90"  width="50"  height="210" fill="#2d3748" />
        <rect x="420" y="120" width="45"  height="180" fill="#2d3748" />
        <rect x="460" y="100" width="60"  height="200" fill="#1a202c" />
        <rect x="515" y="130" width="40"  height="170" fill="#2d3748" />
        <rect x="550" y="80"  width="55"  height="220" fill="#1a202c" />
        <rect x="600" y="110" width="50"  height="190" fill="#2d3748" />
        <rect x="645" y="140" width="65"  height="160" fill="#2d3748" />
        <rect x="705" y="90"  width="45"  height="210" fill="#1a202c" />
        <rect x="745" y="120" width="60"  height="180" fill="#2d3748" />
        <rect x="800" y="100" width="40"  height="200" fill="#2d3748" />
        <rect x="835" y="130" width="55"  height="170" fill="#1a202c" />
        <rect x="885" y="110" width="50"  height="190" fill="#2d3748" />
        <rect x="930" y="80"  width="45"  height="220" fill="#1a202c" />
        <rect x="970" y="120" width="60"  height="180" fill="#2d3748" />
        <rect x="1025" y="100" width="50" height="200" fill="#2d3748" />
        <rect x="1070" y="140" width="40" height="160" fill="#1a202c" />
        <rect x="1105" y="110" width="65" height="190" fill="#2d3748" />
        <rect x="1165" y="90"  width="50" height="210" fill="#1a202c" />
        <rect x="1210" y="130" width="55" height="170" fill="#2d3748" />
        <rect x="1260" y="100" width="45" height="200" fill="#2d3748" />
        <rect x="1300" y="120" width="60" height="180" fill="#1a202c" />
        <rect x="1355" y="80"  width="50" height="220" fill="#2d3748" />
        <rect x="1400" y="140" width="40" height="160" fill="#1a202c" />

        {/* Flag pole */}
        <rect x="680" y="20" width="4" height="260" fill="#4a5568" />
        {/* Indian flag */}
        <rect x="684" y="20" width="60" height="14" fill="#FF9933" />
        <rect x="684" y="34" width="60" height="14" fill="#fff" />
        <rect x="684" y="48" width="60" height="14" fill="#138808" />
        <circle cx="714" cy="41" r="6" fill="#000080" opacity="0.7" />

        {/* Smog at top of buildings */}
        <rect x="0" y="160" width="1440" height="40" fill="rgba(160,140,100,0.25)" />
        <rect x="0" y="140" width="1440" height="30" fill="rgba(160,140,100,0.15)" />

        {/* Ground */}
        <rect x="0" y="290" width="1440" height="10" fill="#1a202c" />
      </svg>

      {/* Flying bird */}
      <div style={{
        position: 'fixed',
        top: '15%',
        zIndex: 3,
        fontSize: '24px',
        animation: 'flyBird 12s linear infinite',
      }}>
        🦅
      </div>

      {/* Floating smog particles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'fixed',
          top: `${10 + i * 8}%`,
          left: '-100px',
          width: `${60 + i * 20}px`,
          height: `${20 + i * 8}px`,
          borderRadius: '50%',
          background: 'rgba(180,160,120,0.15)',
          zIndex: 1,
          animation: `floatSmog ${15 + i * 5}s linear infinite`,
          animationDelay: `${i * 3}s`,
        }} />
      ))}

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '1000px',
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
        alignItems: 'center',
      }}>

        {/* Left side — AQI info */}
        <div>
          {/* Title */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '8px', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              🌬️ Andhra Pradesh<br />AQI Monitor
            </h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>
              Real-time air quality monitoring across Andhra Pradesh. Stay informed, stay safe.
            </p>
          </div>

          {/* Live AQI meter */}
          <div style={{
            background: 'rgba(0,0,0,0.55)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4444', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: '12px', color: '#ff4444', fontWeight: '600' }}>LIVE</span>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginLeft: '4px' }}>AQI Scale Reference</span>
            </div>

            {/* AQI gradient bar */}
            <div style={{
              height: '16px',
              borderRadius: '8px',
              background: 'linear-gradient(to right, #00e400 0%, #ffff00 20%, #ff7e00 40%, #ff0000 60%, #8f3f97 80%, #7e0023 100%)',
              marginBottom: '8px',
              position: 'relative',
            }}>
              {/* Animated pointer */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                left: '22%',
                animation: 'slidePointer 6s ease-in-out infinite',
              }}>
                <div style={{ fontSize: '20px', textAlign: 'center' }}>😊</div>
                <div style={{ width: '2px', height: '8px', background: '#fff', margin: '0 auto' }} />
              </div>
            </div>

            {/* Scale labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              {['Good', 'Moderate', 'Poor', 'Unhealthy', 'Severe', 'Hazardous'].map(l => (
                <span key={l} style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)' }}>{l}</span>
              ))}
            </div>

            {/* AQI level cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              {aqiLevels.map(level => (
                <div key={level.label} style={{
                  background: `${level.color}22`,
                  border: `1px solid ${level.color}55`,
                  borderRadius: '8px',
                  padding: '8px',
                  textAlign: 'center',
                }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: level.color, margin: '0 auto 4px',
                    border: level.color === '#ffff00' ? '1px solid #b7a800' : 'none',
                  }} />
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#fff', margin: 0 }}>{level.label}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{level.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {[
              { icon: '📍', value: '35', label: 'Cities Monitored' },
              { icon: '⏱️', value: '30min', label: 'Data Refresh' },
              { icon: '🌿', value: '6', label: 'Pollutants Tracked' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: 'rgba(0,0,0,0.45)',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{stat.icon}</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>{stat.value}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side — Login form */}
        <div style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '36px',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          {/* Form header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
              {isForgot ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
              {isForgot ? 'Enter your email to receive a reset link' : isLogin ? 'Sign in to access your AQI dashboard' : 'Join to monitor air quality'}
            </p>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Password — hidden on forgot password screen */}
          {!isForgot && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {/* Forgot password link */}
              {isLogin && (
                <p
                  onClick={() => { setIsForgot(true); setError(''); setMessage(''); }}
                  style={{
                    fontSize: '12px',
                    color: '#90cdf4',
                    cursor: 'pointer',
                    textAlign: 'right',
                    marginTop: '6px',
                  }}>
                  Forgot password?
                </p>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(197,48,48,0.3)',
              border: '1px solid rgba(254,178,178,0.5)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '13px',
              color: '#fed7d7',
              marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div style={{
              background: 'rgba(39,103,73,0.3)',
              border: '1px solid rgba(154,230,180,0.5)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '13px',
              color: '#c6f6d5',
              marginBottom: '16px',
            }}>
              {message}
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: loading ? 'rgba(144,205,244,0.5)' : 'rgba(43,108,176,0.9)',
              color: '#fff',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.3)',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
              backdropFilter: 'blur(8px)',
            }}>
            {loading ? 'Please wait...' : isForgot ? '📧 Send Reset Email' : isLogin ? '🔐 Sign In' : '✨ Create Account'}
          </button>

          {/* Toggle */}
          {isForgot ? (
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
              <span
                onClick={() => { setIsForgot(false); setError(''); setMessage(''); }}
                style={{ color: '#90cdf4', cursor: 'pointer', fontWeight: '600' }}>
                ← Back to Sign In
              </span>
            </p>
          ) : (
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span
                onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
                style={{ color: '#90cdf4', cursor: 'pointer', fontWeight: '600' }}>
                {isLogin ? 'Register here' : 'Sign in here'}
              </span>
            </p>
          )}

          {/* Footer note */}
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '16px' }}>
            🌿 Powered by OpenWeatherMap · MSc Project
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes slidePointer {
          0%   { left: 5%; }
          25%  { left: 35%; }
          50%  { left: 60%; }
          75%  { left: 80%; }
          100% { left: 5%; }
        }
        @keyframes flyBird {
          0%   { left: -50px; transform: scaleX(1); }
          49%  { left: 110vw; transform: scaleX(1); }
          50%  { left: 110vw; transform: scaleX(-1); }
          100% { left: -50px; transform: scaleX(-1); }
        }
        @keyframes floatSmog {
          0%   { transform: translateX(0) scaleX(1); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { transform: translateX(110vw) scaleX(2); opacity: 0; }
        }
        input::placeholder { color: rgba(255,255,255,0.5); }
      `}</style>
    </div>
  );
}

export default Auth;