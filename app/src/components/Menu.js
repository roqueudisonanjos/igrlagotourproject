import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { firebaseConfig } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";

const Menu = ({abrirPerfilMethod, goToLogin}) =>{

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);


    const abrePerfil = ()=>{
        abrirPerfilMethod();
    }

    const signOutPress = () =>{
        signOut(auth).then( async () => {
            // Sign-out successful.
            await AsyncStorage.clear();
            goToLogin();
        }).catch((error) => {
            // An error happened.
        });    
    }
    
    return(
        <View style={styles.modalContainer}>
            <TouchableOpacity 
                onPress={() => abrePerfil()}>
                <Text style={styles.textTitle}>Abrir perfil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => signOutPress()}>
                <Text style={styles.textTitle}>Sair do aplicativo</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    modalContainer:{
        backgroundColor: 'white'
    },
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