import app from "@/app/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signOut } from "firebase/auth";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Componente Menu recebendo metodo para abrir perfil e Logout
const Menu = ({abrirPerfilMethod, goToLogin}) =>{
    // Obtém autenticação
    const auth = getAuth(app);
    const abrePerfil = ()=>{
        abrirPerfilMethod();
    }
    // Chama função para Logout
    const signOutPress = () =>{
        signOut(auth).then( async () => {
            // Logout com sucesso
            await AsyncStorage.clear();
            goToLogin();
        }).catch((error) => {
        });    
    }
    return(
        // Renderização de tela
        <View>
            <TouchableOpacity 
                onPress={() => abrePerfil()}>
                <Text style={styles.textTitle}>Abrir perfil</Text>
            </TouchableOpacity>
            {/* ao tocar, dispara o logout */}
            <TouchableOpacity onPress={() => signOutPress()}>
                <Text style={styles.textTitle}>Sair do aplicativo</Text>
            </TouchableOpacity>
        </View>
    )
}
// Estilização de tela
const styles = StyleSheet.create({
    textTitle:{
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        borderLeftColor: 'black',
        borderRightColor: 'black',
        paddingHorizontal: 10
    },
})

export default Menu;