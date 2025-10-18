import app from '@/app/firebaseConfig';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, getFirestore, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Button, Modal, Portal, TextInput } from 'react-native-paper';


// Componente responsável por exibir e enviar comentários
const Comentarios = ({ comentarios, idEstabelecimento, updateComentarios }) => {
    // Dimensões de tela
    const windowDimensions = useWindowDimensions();
    // Armazena o texto digitado pelo usuário no campo de comentário
    const [text, setText] = React.useState("");
    // Controla exibição do modal com um estado boleano
    const [visible, setVisible] = useState(false);
    // Função para fechar o modal
    const hideModal = () => {
        setVisible(false);
    }
    //Função que envia o comentário digitado e fecha o modal
    const enviarComentario = () =>{
        hideModal();
        adicionarComentarioSequencial(text);
        //updateComentarios(text, nome, Timestamp.now);
        setText('')
        // Chama o método recebido envia o texto digitado
    }

        
    const db = getFirestore(app, "(default)");


    async function adicionarComentarioSequencial(texto) {
        try{
            const cidade = await AsyncStorage.getItem("nomeColecao");
            const ref = doc(db, cidade, "Estabelecimentos");
            const snap = await getDoc(ref);
            console.log("print do snap", snap);
            const usuario = await AsyncStorage.getItem("user");
            console.log("C=EstabelecimentoComponent m=pegaUser usuario="+usuario);
            if(usuario!==null) {
               let usuarioJson = JSON.parse(usuario);
               if (!snap.exists()) return;
                
                const data = snap.data();
                //const comentarios = data?.comentarios || {};
                // Pega próximo índice do comentário
                //const novoIndice = comentarios.length; // último número + 1
                const date = Date.now();

                const timestamp = Timestamp.now();
                updateComentarios(texto, usuarioJson.nome, timestamp, date);
                console.debug("A= Comentarios novo indice: ", date);
                console.log("comentario efetuado")
                await updateDoc(ref, {
                    [`${idEstabelecimento}.comentarios.${date}`]: [usuarioJson.nome, texto, timestamp]
                });
            } else{
                console.error("usuário não encontrado")
            }
        }
        catch(e){
            console.error(e);
        }  
    

        
    }



    const containerStyle = {backgroundColor: 'white', padding: 20};

    return (
        <View style={{width: windowDimensions.width, flex:1}}>

            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <TextInput
                        label="Comente aqui"
                        value={text}
                        onChangeText={text => setText(text)}
                    />
                    <Button icon="send" mode="outlined" onPress={() => enviarComentario()}>
                        Enviar
                    </Button>
                </Modal>
            </Portal>

            <TouchableOpacity style={styles.novoComentario} onPress={()=>setVisible(true)}>
                <AntDesign name="pluscircleo" size={24} color="black" />
                <Text style={{fontWeight:600, marginLeft: 10}}>
                    Novo comentario
                </Text>
            </TouchableOpacity>

            <FlatList
                data={comentarios}
                keyExtractor={(item, index) => `comentario-${index}`}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.viewComentario}>
                            <Text style={{marginTop:5}}>{item.getNome()}      {item.getDataFormatada()}</Text>
                            <Text style={{marginTop:5}}>{item.getTexto()}</Text>
                        </View>
                    )
                }}
            />

        </View>
    );
}
 

const styles = StyleSheet.create({
    viewComentario: {
        marginHorizontal: 10,
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 4,
        marginTop: 4
    },
    novoComentario:{
        justifyContent: "space-between",
        alignItems:'center',
        alignSelf: "center",
        alignContent: "center",
        margin: 20,
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1,
        borderStyle: 'solid',
        padding: 10,
        flexDirection: 'row'
    }
});

export default Comentarios;