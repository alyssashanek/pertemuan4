'use client';

import { logoutAction } from '@/app/actions/logout';
import { useState } from 'react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logoutAction();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-xs rounded-full transition disabled:opacity-50 cursor-pointer"
    >
      {loading ? 'Keluar...' : 'Keluar'}
    </button>
  );
}