import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { firebaseConfig } from '../../firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const alterarSenha = async (senhaAtual, novaSenha) => {

  try {

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado.');

    // Reautenticar o usuário antes de atualizar a senha
    const credential = EmailAuthProvider.credential(user.email, senhaAtual);
    console.log("C=UpdatePassword email="+user.email+", senha: "+senhaAtual+", credencial="+credential)
    await reauthenticateWithCredential(user, credential);

    // Atualizar a senha
    updatePassword(user, novaSenha).then(() => {
      // Update successful.
      console.log('Senha alterada com sucesso! Nova senha='+novaSenha);
      return ('Senha alterada com sucesso.')
  
    }).catch((error) => {
      // An error ocurred
      // ...
      console.error('Erro ao alterar senha:', error);
      throw new Error(error.message);
    });

  } catch (error) {
    console.error('Erro ao alterar senha:', error.message);
  }
};