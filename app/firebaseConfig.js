// Importe da biblioteca Firebase para inicializar e gerenciar o banco de dados
import { getApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  // Chave de acesso do firebase
  apiKey: "AIzaSyBl22spyfkbeHUzOhwSeOtVCDAIYJhxHwE",
  // Dominio para permissões do app
  authDomain: "igr-lago-tour.firebaseapp.com",
  // Identificação do projeto no firebase
  projectId: "igr-lago-tour",
  // Local de armazenamento de arquivos na nuvem
  storageBucket: "igr-lago-tour.appspot.com",
  // ID de notificações
  messagingSenderId: "1049430657076",
  // ID do aplicativo
  appId: "1:1049430657076:web:ab7ecf9f5a9bf3a6992261",
  // ID para serviços de análise do aplicativo
  measurementId: "G-3GTTXD5F8R"
};
// Função para iniciar apenas se já não estiver inicializado
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export default app;