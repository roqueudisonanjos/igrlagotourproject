// Import das bibliotecas utilizadas na classe
// Import da biblioteca com as validações e configurações do firebase
import app from '@/app/firebaseConfig';
// Funções para criar usuario com email, senha e autenticação do firebase
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
// Funções do firebase para criar e setar doc
import { doc, getFirestore, setDoc } from "firebase/firestore";
// AsyncStorage utilizada para salvar dados na cache do aparelho
import AsyncStorage from "@react-native-async-storage/async-storage";
// useState para gerenciar os campos do formulário
import React, { useState } from 'react';
// Abaixo os imports para estilo, navegação, componentes básicos e imagem padrão de usuário
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { imageNewUserDefault } from '../../constants/imagesFirebase';

// Componente principal da tela de registro
const RegistrationScreen = ({navigation}) => {
    // Variáveis que armazenam os dados digitados pelo usuário
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    // Inicializando firebase
    const db=getFirestore(app, "(default)");
    // Inicializando a autenticação do firebase e obtendo uma autenticação
    const auth = getAuth(app);
    // Função chamada ao clicar no botão de voltar para a tela de login
    const onFooterLinkPress = () => {
        navigation.navigate('Login')
    }
    const criaUserNoBanco = async (uid)=>{
        // try catch para instanciar e confirmar a inserção da nova conta no banco de dados
        try {
            // Setando as informações do usuário
            await setDoc(doc(db, "users", uid), {
                nome: fullName,
                uid: uid,
                imagemPerfil: imageNewUserDefault,
                email: email
            });
            ////console.log("C=RegistrationScreen M=criaUserNoBanco m=Usuário criado!")
        } catch (e) {
            //console.error("Erro ao adicionar: ", e);
        }
    }
    // Função chamada no botão de criar conta e verificação de senhas
    const onRegisterPress = () => {
        if (password !== confirmPassword) {
            alert("Por favor, insira senhas iguais.")
            return
        }
        // Criando usuário com email, senha e autenticando no firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then(async (response) => {
            // Identificador do usuário
            const uid = response.user.uid
            // Chamando a função criaUserNoBanco no id criado anteriormente
            await criaUserNoBanco(uid);
            // Criando objeto com informações do usuário sendo setadas
            const objetoUser = {uid :uid, nome: fullName, email: email, imagemPerfil: imageNewUserDefault};
            ////console.log("C=RegistrationScreen M=onRegisterPress objetoUser="+objetoUser)
            ////console.log(objetoUser);
            // Salva o login do usuário na memória local do aparelho
            await AsyncStorage.setItem("user", JSON.stringify(objetoUser));
            // Redireciona para a tela principal do app
            navigation.navigate('MainComponent')
        })
        .catch((error) => {
            alert(error)
        });  
    }
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
                placeholder='Nome e Sobrenome'
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setFullName(text)}
                value={fullName}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
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
            <TextInput
                style={styles.input}
                placeholderTextColor="#aaaaaa"
                secureTextEntry
                placeholder='Confirme sua senha'
                onChangeText={(text) => setConfirmPassword(text)}
                value={confirmPassword}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => onRegisterPress()}>
                <Text style={styles.buttonTitle}>Criar uma conta</Text>
            </TouchableOpacity>
            <View style={styles.footerView}>
                <Text style={styles.footerText}>Ja possui uma conta? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Fazer Login</Text></Text>
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
    title: {

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

export default RegistrationScreen;