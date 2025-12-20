import { useState } from 'react';
import { api } from '../lib/api';

export const UpdatePasswordPage = ({ onNavigate }) => {
  const [newPassword, setNewPassword] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    // TODO: Implement password update with new backend
    alert("Password update functionality will be available soon!");
    onNavigate('login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <form onSubmit={handleUpdate} className="card-elevated w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Set New Password</h2>
        <input 
          type="password" 
          className="input mb-4" 
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary w-full">Update Password</button>
      </form>
    </div>
  );
};