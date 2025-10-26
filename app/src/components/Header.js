import { default as Entypo } from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Menu from './Menu';

// Define o componente Header, recebendo como parâmetros funções e dados vindos do MainComponent
const Header = ({image, nomeColecao, mudaColecao, abrirPerfilMethod, goToLogin}) =>{
    // Estados para controlar se os modais estão abertos ou fechados
    const [modalMenu, setModalMenu] = useState(false);
    const [modalLocal, setModalLocal] = useState(false);
    // Lista de cidades disponíveis para seleção
    const cidades = [
        "Tucuruí-Pará-Brasil", 
        "Breu Branco-Pará-Brasil", 
        "Goianésia-Pará-Brasil", 
        "Jacundá-Pará-Brasil", 
        "Nova Ipixuna-Pará-Brasil", 
        "Itupiranga-Pará-Brasil", 
        "Novo Repartimento-Pará-Brasil"];

    // Função chamada quando o usuário escolhe uma cidade    
    const escolheCidade = async (cidade) =>{
        // Salva a cidade escolhida no armazenamento local
        await AsyncStorage.setItem("nomeColecao", cidade);
        ////console.log("Header cidade="+cidade);
        // Atualiza o MainComponent com a cidade selecionada
        mudaColecao(cidade);
        setModalLocal(false);
    }

    // Renderização do componente
    return(
        <View style={styles.header}>
            <TouchableOpacity 
                onPress={()=>setModalMenu(true)}
            >
                <Image style={styles.profileImage} source={{ uri: image }} />
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection: 'row'}} 
                onPress={() => setModalLocal(true)}>
                <Entypo name="location-pin" size={22} color="black" />
                <Text style={styles.headerTitle}>{nomeColecao!==null ? nomeColecao.split("-")[0] : "Escolha uma cidade"}</Text>
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
                            <View>
                                <Menu abrirPerfilMethod={abrirPerfilMethod} goToLogin={goToLogin}/>
                                <TouchableOpacity
                                    onPress={() => setModalMenu(false)}
                                    style={{marginTop: 20, backgroundColor: 'white'}}
                                >
                                    <Text style={{
                                            fontSize: 16,
                                            color: 'black',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        Voltar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
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
                                    keyExtractor={(item, index) => index.toString()}
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
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    headerTitle: {
        color: 'black',
    }
})

export default Header;
