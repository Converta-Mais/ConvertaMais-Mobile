# Converta Mais Mobile 📱

Versão mobile do app **Converta Mais** desenvolvida em React Native com Expo.

## 📋 Funcionalidades

- ✅ Autenticação com Firebase Authentication
- ⏳ Listagem de campanhas (em desenvolvimento)
- ✅ Design responsivo

## 🛠️ Tecnologias Utilizadas

- React Native com Expo
- TypeScript para tipagem segura
- Expo Router (para navegação)
- AsyncStorage para armazenamento local
- react-native-svg para ícones SVG
- Firebase para autenticação e backend

## 🚀 Como Rodar

### Pré-requisitos

- Node.js instalado
- Expo CLI: `npm install -g expo-cli`
- Expo Go instalado no seu celular (opcional)

### Instalação

#### Clone o repositório:

git clone https://github.com/seu-usuario/converta-mais-mobile.git

#### Entre na pasta:

cd converta-mais-mobile

#### Instale as dependências:

npm install

#### Inicie o Expo:

npx expo start

---

## 🔧 Configuração Firebase

- Edite o arquivo `src/services/firebase.ts` para incluir suas credenciais Firebase.

---

## 📌 Observações

- O app usa Firebase Authentication para login e registro, com persistência via AsyncStorage.
- Para salvar dados adicionais como nome e telefone, é necessário usar o Firestore (não implementado para simplificar).
- A navegação entre telas usa o React Navigation Native Stack com controle baseado no estado de autenticação do usuário no contexto.

---

Para mais detalhes sobre as funções e configurações, consulte os comentários nos arquivos fonte do projeto.
  
Obrigado por usar o **Converta Mais Mobile**!    
