'use client';

import React, { createContext, useContext } from 'react';
import type { User } from 'firebase/auth';

const AuthContext = createContext<{ user: User | null; role: string | null; loading: boolean }>({
  user: null,
  role: null,
  loading: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={{ user: null, role: null, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
