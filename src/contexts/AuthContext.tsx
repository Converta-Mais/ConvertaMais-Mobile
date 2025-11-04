// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthContextData {
  user: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signUp: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } else {
          setUser(null);
          await AsyncStorage.removeItem('userData');
        }
      } catch (error) {
        console.error('Erro ao processar estado de autenticação:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      setUser(userCredential.user);
      
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error: any) {
      throw normalizarErroFirebase(error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      setUser(userCredential.user);
      
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error: any) {
      throw normalizarErroFirebase(error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      await AsyncStorage.removeItem('userData');
    } catch (error: any) {
      throw normalizarErroFirebase(error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw normalizarErroFirebase(error);
    }
  };

  const normalizarErroFirebase = (error: any): Error => {
    let mensagem = 'Erro ao processar requisição';

    switch (error.code) {
      case 'auth/email-already-in-use':
        mensagem = 'Este e-mail já está cadastrado';
        break;
      case 'auth/invalid-email':
        mensagem = 'E-mail inválido';
        break;
      case 'auth/weak-password':
        mensagem = 'A senha é muito fraca. Use pelo menos 8 caracteres';
        break;
      case 'auth/user-not-found':
        mensagem = 'Usuário não encontrado';
        break;
      case 'auth/wrong-password':
        mensagem = 'Senha incorreta';
        break;
      case 'auth/too-many-requests':
        mensagem = 'Muitas tentativas. Tente novamente mais tarde';
        break;
      case 'auth/invalid-credential':
        mensagem = 'Credenciais inválidas';
        break;
      default:
        mensagem = error.message || 'Erro desconhecido';
    }

    const erro = new Error(mensagem);
    erro.name = error.code;
    return erro;
  };

  const value: AuthContextData = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
