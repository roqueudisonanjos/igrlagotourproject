import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Button, Modal, Portal, TextInput } from 'react-native-paper';

// Componente responsável por exibir e enviar comentários
const Comentarios = ({ comentarios, metodoEnviarComentario }) => {
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
        metodoEnviarComentario(text)
        // Chama o método recebido envia o texto digitado
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