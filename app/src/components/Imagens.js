import { Image } from '@rneui/themed';
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";

const Imagens = ({ imagens }) => {
    const windowDimensions = useWindowDimensions();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleImagePress = (image) => {
        setSelectedImage(image);
        setModalVisible(true);
    };
    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedImage(null);
    };

    console.log(imagens);

    // Função auxiliar fora do JSX
    const chunkArray = (array, tamanho) => {
        const resultado = [];
        for (let i = 0; i < array.length; i += tamanho) {
        resultado.push(array.slice(i, i + tamanho));
        }
        return resultado;
    };
    
    return (
           
        <ScrollView style={{width: windowDimensions.width, flex: 1}}>
            {chunkArray(imagens, 3).map((linha, linhaIndex) => (
                <View key={linhaIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    {linha.map((item, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <TouchableOpacity onPress={() => handleImagePress(item)}>
                        <Image
                            source={{ uri: item }}
                            style={[
                            styles.image,
                            {
                                width: windowDimensions.width * 0.27,
                                height: windowDimensions.width * 0.27,
                            },
                            ]}
                        />
                        </TouchableOpacity>
                    </View>
                    ))}
                </View>
            ))}

            <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalBackground}>
                        <TouchableOpacity style={styles.modalCloseArea} onPress={handleCloseModal} />
                        <View style={styles.modalContent}>
                            {selectedImage && (
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={{
                                        width: windowDimensions.width * 0.9,
                                        height: windowDimensions.width * 0.9,
                                        resizeMode: 'contain'
                                    }}
                                />
                            )}
                        </View>
                        <TouchableOpacity style={styles.modalCloseArea} onPress={handleCloseModal} />
                    </View>
            </Modal>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    viewImagem: {
    },
    container:{
        flex:1,
    },
    list: {
        marginLeft: 9/2
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCloseArea: {
        flex: 1,
        width: '100%',
    },
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        flex: 1, // Ocupa o espaço disponível
        margin: 3, // Espaço entre as imagens
        alignItems: "center",
      },
    image: {
        borderRadius: 6, // Bordas arredondadas
    },
});

export default Imagens;
