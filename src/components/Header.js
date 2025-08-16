import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/MaterialIcons';
import { Modal, TouchableOpacity, Text, FlatList, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Image } from 'react-native';
import Menu from './Menu';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = ({image, nomeColecao, mudaColecao, abrirPerfilMethod, goToLogin}) =>{
    const [modalMenu, setModalMenu] = useState(false);
    const [modalLocal, setModalLocal] = useState(false);
    const [modalConfigs, setModalConfigs] = useState(false);

    const cidades = ["Tucuruí-Pará-Brasil", "Novo Repartimento-Pará-Brasil", "Breu Branco-Pará-Brasil", "Goianésia-Pará-Brasil", "Jacundá-Pará-Brasil", "Nova Ipixuna-Pará-Brasil", "Itupiranga-Pará-Brasil", "Novo Repartimento-Pará-Brasil"];

    const escolheCidade = async (cidade) =>{
        await AsyncStorage.setItem("nomeColecao", cidade);
        console.log("Header cidade="+cidade);
        mudaColecao(cidade);
        setModalLocal(false);
    }


    return(
        <View style={styles.header}>
            <TouchableOpacity 
                onPress={()=>setModalMenu(true)}
            >
                <Image style={styles.profileImage} source={{ uri: image }} />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection: 'row'}} 
                onPress={() => setModalLocal(true)}>
                <Entypo name="location-pin" size={24} color="black" />
                <Text style={styles.headerTitle}>{nomeColecao!==null ? nomeColecao.split("-")[0] : "Escolha uma cidade"}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => setModalConfigs(true)}>
                <MaterialIcons name="settings" size={24} color="black" />
            </TouchableOpacity>

            {/*Modal de menu*/}
            <Modal
                transparent={true}
                visible={modalMenu}
                onRequestClose={() =>setModalMenu(false)} 
                >
                <TouchableWithoutFeedback onPress={() =>setModalMenu(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <Menu abrirPerfilMethod={abrirPerfilMethod} goToLogin={goToLogin}/>
                        </TouchableWithoutFeedback>

                        <TouchableOpacity
                            onPress={() => setModalMenu(false)}
                            style={{marginTop: 20, backgroundColor: 'white'}}
                        >
                            <Text style={{
                                    fontSize: 16,
                                    color: 'black',
                                    fontWeight: 'bold',
                                    borderLeftColor: 'black',
                                    borderRightColor: 'black',
                                    paddingHorizontal: 10
                                }}
                            >
                                Voltar
                            </Text>
                        </TouchableOpacity>
                        
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/*Modal de localizaçao*/}
            <Modal
                transparent={true}
                visible={modalLocal}
                onRequestClose={() =>{
                    setModalLocal(false);
                }} // Fecha o modal com o botão de hardware de voltar
                >
                <TouchableWithoutFeedback onPress={() => {
                    setModalLocal(false);
                }}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.cityModalContainer}>
                                
                                <FlatList
                                    data={cidades}
                                    keyExtractor={(item, index) => index}
                                    renderItem={({item})=>{
                                        return(
                                            <TouchableOpacity onPress={()=>escolheCidade(item)}>
                                                <Text style={{textAlign:'center', marginVertical: 5}}>
                                                    {item}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/*Modal de configs*/}
            <Modal
                transparent={true}
                visible={modalConfigs}
                onRequestClose={() =>setModalLocal(false)} // Fecha o modal com o botão de hardware de voltar
                >
                <TouchableWithoutFeedback onPress={() => {
                    setModalConfigs(false);
                }}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <Text>oi</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        paddingHorizontal:10
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    searchButton: {
        backgroundColor: '#FF5757',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    cityInput: {
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      marginBottom: 20,
      paddingHorizontal: 10,
      fontSize: 16,
    },
    cityModalContainer: {
      width: '80%',
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      elevation: 5,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    headerTitle: {
        color: 'black',
    }
})

export default Header;