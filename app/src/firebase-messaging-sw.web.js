// Importações no topo — sempre obrigatórias no nível superior
import { getMessaging, getToken } from "firebase/messaging";
import './firebase-messaging-sw.web';

// Declara a variável no escopo global
let messaging = null;

// Só executa se estiver no ambiente web
if (typeof window !== 'undefined') {
  try {
    // Inicializa o Firebase Messaging
    messaging = getMessaging();

    // Obtém o token de registro (usado para notificações push)
    getToken(messaging, { vapidKey: 'U3Sxz__-UIaN9eaywnt9DDRmqmssMQd7vMjxy2abCG4' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('✅ Token de registro obtido:', currentToken);
          // Aqui você pode enviar o token para o servidor, se quiser
        } else {
          console.warn('⚠️ Nenhum token disponível. Solicite permissão para gerar um.');
        }
      })
      .catch((err) => {
        console.error('❌ Erro ao recuperar o token:', err);
      });

  } catch (error) {
    console.error('🔥 Erro ao inicializar o Firebase Messaging no ambiente web:', error);
  }
} else {
  console.log('💡 Firebase Messaging desativado fora do ambiente web.');
}

// Exporta o objeto messaging (pode ser null fora do ambiente web)
export default messaging;
