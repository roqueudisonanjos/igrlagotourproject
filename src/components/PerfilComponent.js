//classe PerfilComponent
import { View, Text, TouchableOpacity } from "react-native"
import { Avatar, ActivityIndicator, Button, Modal, Portal, TextInput } from "react-native-paper"
import { StyleSheet } from "react-native"
import * as ImagePicker from 'expo-image-picker';
import {useEffect, useState} from 'react';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from "firebase/storage";

import { doc, getFirestore, updateDoc} from "firebase/firestore"; 
import { alterarSenha } from '../utils/UpdatePassword';

const app = initializeApp(firebaseConfig);
const db=getFirestore(app, "(default)");
const containerStyle = {backgroundColor: 'white', padding: 20};

const PerfilComponent=({navigation})=>{

    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');

    const [modalChangePassword, setModalChangePassword] = useState(false);

    const handleChangePassword = async () => {
        try {
            const mensagem = await alterarSenha(senhaAtual, novaSenha);
            hideModal();
            Alert.alert('Sucesso', mensagem);
        } catch (error) {
            //    Alert.alert("Erro ao alterar a senha. Verifique se a senha atual está correta.")
            Alert.alert('Erro: ', error.message);
        }
    };

    const [image, setImage] = useState(null);

    //const user, responsavel por chamar o construtor usuario instanciando as suas informações
    const [user, setUser] = useState({uid: "", nome: "", email: "", imagemPerfil: ""});

    useEffect(()=>{
        const pegaUser = async ()=>{
            try{
                const usuario = await AsyncStorage.getItem("user");
                console.log("C=PerfilComponent m=pegaUser usuario="+usuario);
                if(usuario!==null) {
                    let usuarioJson = JSON.parse(usuario);
                    setUser(usuarioJson);
                    let imagem = usuarioJson.imagemPerfil;
                    setImage(imagem);
                }
            }
            catch(e){
                console.error(e);
            }  
        }
        pegaUser();
    },[])
    
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {

          const img = result.assets[0].uri;

          setImage(img);

          const fileName = img.split("/").pop();
          setInProgress(true);
          uploadToFirebase(img, fileName)
        }
    };

    const [inProgress, setInProgress] = useState(false);

    const uploadToFirebase = async (uri, name) => {
        const fetchResponse = await fetch(uri);
        const theBlob = await fetchResponse.blob();
      
        const imageRef = ref(getStorage(), `users/${name}`);
      
        const uploadTask = uploadBytesResumable(imageRef, theBlob);
      
        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
            },
            (error) => {
              // Handle unsuccessful uploads
              console.log(error);
              reject(error);
            },
            async () => {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve({
                    downloadUrl,
                    metadata: uploadTask.snapshot.metadata,
                });
                
                try {
                    const userUpdated = {nome: user.nome, email: user.email, imagemPerfil: downloadUrl};
                    setUser(userUpdated)
                    await AsyncStorage.setItem("user", JSON.stringify(userUpdated)); //JSON.stringfy converte o objeto em um JSON

                    await updateDoc(doc(db, "users", user.uid), {
                        imagemPerfil: downloadUrl
                    });
                    setInProgress(false);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }

            }
          );
        });
    };

    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => {
        setVisible(false);
        setModalChangePassword(false);
    }
    const [text, setText] = useState("");

    const alterarNome = async ()=>{
        const userUpdated = {nome: text, email: user.email, imagemPerfil: image};
        setUser(userUpdated);
        await AsyncStorage.setItem("user", JSON.stringify(userUpdated)); //JSON.stringfy converte o objeto em um JSON

        try{
            await updateDoc(doc(db, "users", user.uid), {
                nome: text,
            });
            hideModal();    
        }
        catch(e){
            console.error(e);
        }
    }

    return(
        <View style={styles.informacoesPessoais}>

            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <TextInput
                        label="Nome"
                        value={text}
                        onChangeText={text => setText(text)}
                    />

                    <Button onPress={()=>alterarNome()}>
                        Confirmar
                    </Button>
                </Modal>
            </Portal>

            <Portal>
                <Modal visible={modalChangePassword} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <TextInput
                        placeholder="Senha Atual"
                        secureTextEntry
                        value={senhaAtual}
                        onChangeText={setSenhaAtual}
                    />
                    <TextInput
                        placeholder="Nova Senha"
                        secureTextEntry
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                    />
                    <Button onPress={()=>handleChangePassword()}>
                        Alterar    
                    </Button>
                </Modal>
            </Portal>
            <TouchableOpacity onPress={()=>pickImage()}>
                {inProgress ? 
                    <ActivityIndicator animating={true} size={100}/> 
                    :
                    <Avatar.Image size={100} style={styles.imagem} source={{uri: image}} /> 
                }
            </TouchableOpacity>
            {/*View responsável pelo avatar*/}
            <View style={styles.containerText}>
            {/* View responsável pelos textos de informação do usuário, 
            chamando o construtor com as informações do usuário*/}
                <Text style={styles.texto}>{user.nome}</Text>
                
                <Text style={styles.texto}>{user.email}</Text>

                <Button icon="lock" mode="contained" onPress={()=>setModalChangePassword(true)} style={{marginTop: 10}}>
                    Alterar senha
                </Button>

                <Button icon="lead-pencil" mode="contained" onPress={()=>showModal()} style={{marginTop: 10}}>
                    Alterar nome
                </Button>

            </View>

        </View>
    )
}   
const styles = StyleSheet.create({
//criando um construtor com stylesheet, para realizar modificações com informações pessoais, imagem e texto.
    informacoesPessoais:{
        flexDirection:"row",
        alignItems:"center",
    },   
    imagem:{
        marginTop: 10,
        marginLeft: 20,
    },
    texto:{
        fontSize:16,
        color:"black",
        marginTop: 10
    },
    containerText:{
        marginLeft: 20,
    }
})
export default PerfilComponent;