// import { registerRootComponent } from 'expo';

// import App from './App';

// // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// // It also ensures that whether you load the app in Expo Go or in a native build,
// // the environment is set up appropriately
// registerRootComponent(App);
export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}

export interface Campaign {
  _id: string;
  nome: string;
  descricao?: string;
  status: 'ativa' | 'inativa' | 'finalizada';
  dataInicio: string;
  dataFim?: string;
  totalLeads?: number;
  createdAt: string;
  updatedAt: string;
}