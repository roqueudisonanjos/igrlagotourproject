// Abaixo as bibliotecas necessárias para criação da tela
// Bibliotecas do firebase responsável por autenticação e captura de informações
import app from '@/app/firebaseConfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// criação da tela de login, pegando as informações necessárias para login (email e senha)
const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // Inicializando a comunicação com o firebase
    const DB=getFirestore(app, "(default)");
    // Inicializando a autenticação do firebase e obtendo uma autenticação
    const auth = getAuth(app);
    //const providerGoogle = new GoogleAuthProvider();
    useEffect(()=>{
        const verificaAT = async()=>{
            const usuarioOnStorage = await AsyncStorage.getItem('user');
            if(usuarioOnStorage!==null){
                navigation.navigate("MainComponent");
            }
        }
        verificaAT();
    },[])
    const onFooterLinkPress = () => {
        // Link para tela de criação de conta
        navigation.navigate('Registration')
    }

    // Botão de login
    const onLoginPress = () => {
            // Função de login da biblioteca auth do firebase
            signInWithEmailAndPassword(auth, email, password)
            .then(async (response) => {
                // Autenticação de usuário
                const user = response.user
                // Buscando informação no banco de dados
                const docRef = doc(DB, "users", user.uid);
                try {
                    // Recupera informações de login do usuário do banco de dados
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        // Atribui o conteúdo do documento à variável
                        const usuario = docSnap.data();
                        // Salva informações na memória local do dispositivo
                        await AsyncStorage.setItem("user",JSON.stringify(usuario));
                        navigation.navigate("MainComponent")
                    } else {
                        console.log("Nenhum documento encontrado!");
                    }
                } catch (error) {
                    console.error("Erro ao recuperar documento:", error);
                }

            })
            .catch(error => {
                console.error(error)
                alert('Falha no login')
            })
    }

    /* Implementação do login via Google que ainda precisa ser desenvolvida

    const signInWithGoogle =  () => {
        signInWithPopup(auth, providerGoogle)
          .then( async (result) => {
            // O usuário foi autenticado com sucesso
            const additionalUserInfo = getAdditionalUserInfo(result);
            const isNewUser = additionalUserInfo.isNewUser;
            const user = result.user;
    
            console.log("isNewUser: "+isNewUser);
    
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            
            console.log("loginGoogle accessToken="+accessToken)
    
            await AsyncStorage.setItem('user', user.uid);
    
            if(isNewUser){
                navigation.navigate('RegistrationScreen', {uid: uid});
            }
            navigation.navigate('MainComponent');

            // Faça algo com as informações do usuário
          })
          .catch((error) => {
            console.log(error);
          });
    }
    **/

    return (
        <View style={styles.container}>
        <KeyboardAwareScrollView
            style={{ flex: 1, width: '100%' }}
            keyboardShouldPersistTaps="always">
            <Image
                style={styles.logo}
                source={require('../../../assets/logoLogin.jpg')}
            />
            <TextInput
                style={styles.input}
                placeholder='E-mail'
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setEmail(text)}
                value={email}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholderTextColor="#aaaaaa"
                secureTextEntry
                placeholder='Senha'
                onChangeText={(text) => setPassword(text)}
                value={password}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => onLoginPress()}>
                <Text style={styles.buttonTitle}>Fazer Login </Text>
            </TouchableOpacity>

            {/** 
            <TouchableOpacity style={styles.socialButton} onPress={()=>signInWithGoogle()}>
                <Image source={require("../../../assets/icone_google.png")} style={{width: 24, height:24}}/>
                <Text style={styles.socialButtonText}>Continuar com Google</Text>
            </TouchableOpacity>
            */}
            
            <View style={styles.footerView}>
                <Text style={styles.footerText}>Não possui uma conta? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Criar uma conta.</Text></Text>
            </View>
        </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    socialButton: {
        backgroundColor: "rgb(220,220,220)",
        height: 50,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 15,
    },
    socialButtonText: {
        color: "#000",
        fontSize: 16,
        marginLeft: 10,
    },
    logo: {
        flex: 1,
        height: 150,
        width: 180,
        alignSelf: "center",
        margin: 30
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: "bold"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16
    }
})

export default LoginScreen;