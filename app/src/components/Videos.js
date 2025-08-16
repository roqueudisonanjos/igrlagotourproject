import React from "react";
import {useState} from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions, TouchableOpacity, Modal } from "react-native";
import VideoPlayer from "./VideoPlayer";
import CapaVideo from "./CapaVideo";

const Videos = ({ videos }) => {
    const windowDimensions = useWindowDimensions();

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleVideoPress = (videoURL) => {
        setSelectedVideo(videoURL);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedVideo(null);
    };

    // Função auxiliar fora do JSX
    const chunkArray = (array, tamanho) => {
        const resultado = [];
        for (let i = 0; i < array.length; i += tamanho) {
        resultado.push(array.slice(i, i + tamanho));
        }
        return resultado;
    };

    return (
        <View  style={{width: windowDimensions.width    }}>

            {chunkArray(videos, 3).map((linha, linhaIndex) => (
                <View key={linhaIndex} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    {linha.map((item, index) => (
                        <View style={styles.imageContainer}>
                            <TouchableOpacity key={index} onPress={() => handleVideoPress(item)}>
                                <CapaVideo videoURL={item} />
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
                        {selectedVideo && (
                            <VideoPlayer videoURL={selectedVideo} />
                        )}
                    </View>
                    <TouchableOpacity style={styles.modalCloseArea} onPress={handleCloseModal} />
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        width: '100%',
        marginLeft: 9/2
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6
    },
    modalCloseArea: {
        flex: 1,
        width: '100%',
        margin:5
    },
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: '90%',
    }
});
export default Videos;
