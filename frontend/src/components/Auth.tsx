import { useState } from 'react';
import type { User } from '../types';

export default function Auth({ onLogin }: { onLogin: (u: User) => void }) {
  const [isReg, setIsReg] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isReg ? 'register' : 'login';
    const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) onLogin(data); else alert(data.error);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-black mb-6 text-center text-slate-900">{isReg ? 'Create Account' : 'Log In'}</h2>
        <form onSubmit={handleAuth} className="space-y-4">
          {isReg && <input placeholder="Full Name" className="w-full p-3 border rounded-xl bg-slate-50 text-slate-900" onChange={e => setName(e.target.value)} required />}
          <input placeholder="Email Address" type="email" className="w-full p-3 border rounded-xl bg-slate-50 text-slate-900" onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded-xl bg-slate-50 text-slate-900" onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">Continue</button>
        </form>
        <button onClick={() => setIsReg(!isReg)} className="w-full mt-4 text-sm font-bold text-slate-500 hover:text-blue-600">
          {isReg ? 'Already have an account? Log in' : 'Need an account? Sign up'}
        </button>
      </div>
    </div>
  );
}