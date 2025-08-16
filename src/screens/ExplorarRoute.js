//classe ExplorarRoute
import * as React from 'react';
import { ScrollView, View, useWindowDimensions,Text, TouchableOpacity, TextInput } from 'react-native';
import { StyleSheet } from 'react-native';
import { useState, useEffect } from "react";
import * as Font from "expo-font"
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from '@expo/vector-icons/Ionicons';
import ExplorarEstabelecimentos from './itensExplorar/ExplorarEstabelecimentos';
import IconesCategorias from "./IconesCategorias";

// Função para calcular a distância entre dois pontos geográficos (latitude/longitude)
export function getDistanceBetweenPoints(latitude1, longitude1, latitude2, longitude2, unit = 'miles') {
    let theta = longitude1 - longitude2;
    let distance = 60 * 1.1515 * (180/Math.PI) * Math.acos(
        Math.sin(latitude1 * (Math.PI/180)) * Math.sin(latitude2 * (Math.PI/180)) + 
        Math.cos(latitude1 * (Math.PI/180)) * Math.cos(latitude2 * (Math.PI/180)) * Math.cos(theta * (Math.PI/180))
    );
    if (unit == 'miles') {
        return Math.round(distance, 2); // Retorna a distância em milhas
    } else if (unit == 'kilometers') {
        return (distance * 1.609344).toFixed(2); // Retorna a distância em quilômetros
    }
}

const ExplorarRoute=({navigation, estabelecimentos, categorias, localUser})=>{

    useEffect(()=>{
        let result = estabelecimentos.filter(estabelecimento=>estabelecimento.categoria === categoriaAtiva);
        console.log('result')
        console.log(result) 
        setResultadoPesquisa(result) //querry que contem o que o usuario esta pesquisando
    },[estabelecimentos])

    // Função para carregar fontes personalizadas
    const fetchFonts = () => {
        return Font.loadAsync({
          'CircularSpotifyText-Bold': require('../../assets/fonts/CircularSpotifyText-Bold.otf'),
          'CircularSpotifyText-Light': require('../../assets/fonts/CircularSpotifyText-Light.otf'),
          'CircularSpotifyText-Book': require('../../assets/fonts/CircularSpotifyText-Book.otf'),
        });
    };

    useEffect(()=>{
        fetchFonts(); //Carrega as fontes
    }, []); //Executa apenas uma vez ao carregar o componente

    const windowDimensions = useWindowDimensions();
    
    // Navega para a tela de detalhes de um estabelecimento
    const navegaTela= async (id)=>{
        const local = await estabelecimentos.filter(estabelecimento=>estabelecimento.id === id); 
        navigation.navigate('EstabelecimentoComponent', {local:local}) 
    }
    
    //Variavel par a apresentação dos resultados da barra de pesquisa
    const [ searchQuery, setSearchQuery] = React.useState('');
    //Variavel para armazenar os resultados da pesquisa
    const [resultadoPesquisa, setResultadoPesquisa] = useState([]); 

    useEffect(()=>{ //use effect para barra de pesquisa
        if (estabelecimentos !== null && searchQuery.trim() !== ""){
            let result = estabelecimentos.filter(estabelecimento=>estabelecimento.nome.indexOf(searchQuery)!== -1 || estabelecimento.categoriaNome.indexOf(searchQuery)!== -1 || estabelecimento.descricao.indexOf(searchQuery)!== -1 );
            setResultadoPesquisa(result) //Atualiza os resultados da pesquisa
        } 
    },[searchQuery]) //Executa quando o termo de pesquisa muda

    //Variável para armazenar a categoria ativa
    const [categoriaAtiva, setCategoriaAtiva] = useState(null);
    
    const mudaCategoria = (index)=>{
        if(index !== null){
            setCategoriaAtiva(index);
            // Filtra estabelecimentos com base na pesquisa
            let result = estabelecimentos.filter(estabelecimento=>estabelecimento.categoria === index);
            console.log('result')
            console.log(result) 
            setResultadoPesquisa(result) //querry que contem o que o usuario esta pesquisando
        }
        else {
            setCategoriaAtiva(null);
        }
    }

    const renderComponent = () => {
        if (categoriaAtiva !== null) {
            return (
                <View>
                    <TouchableOpacity style={styles.buttonBack} onPress={() => mudaCategoria(null)}>
                        <Icon name="arrow-back" size={20} color="#fff" style={styles.icon} />
                        <Text style={styles.buttonBackText}>Voltar</Text>
                    </TouchableOpacity>
                    <ExplorarEstabelecimentos 
                        estabelecimentos={resultadoPesquisa} 
                        localUser={localUser} 
                        clickCard={navegaTela} 
                        getDistanceBetweenPoints={getDistanceBetweenPoints} 
                    />
                </View>
            )
        }else{
            return(renderCategorias());
        }
    };

    const renderCategorias = () => {
        return (
            <ScrollView>
                {categorias.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => mudaCategoria(index)} style={[styles.textoCategoria, index===categorias.length-1 && {marginBottom:40}]}>
                        <IconesCategorias index={index}/>
                        <Text style={styles.categoriaText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    };
    
    return (
        <View style={styles.container}>
    
            {/* Barra de Pesquisa */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={25} color="#555" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Está procurando algo?"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#aaa"
                />
                <Ionicons name="options" size={28} color="#555" />
            </View>
    
            {/* Conteúdo dinâmico */}
            <View style={{ width: windowDimensions.width, height: '80%' }}>
                {renderComponent()}
            </View>
        </View>
    );
}
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F5E6', // Fundo verde claro
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 15,
        marginHorizontal: 20,
        marginVertical: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 18,
        color: "#333",
        marginLeft: 10,
    },
    buttonBack: {
        backgroundColor: '#006400',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        marginVertical: 10,
        margin: 5,
        borderColor: 'black',
        borderWidth: 2,
        flexDirection: 'row',
    },
    buttonBackText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 5,
    },
    icon: {
        marginRight: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    chipExplorar: {
        backgroundColor: "#66CDAA", // Verde claro suave
        borderRadius: 25,
        paddingVertical: 15, // Aumentado o tamanho dos botões
        paddingHorizontal: 15,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    chipText: {
        color: '#000000',
        fontSize: 15, // Aumentado o tamanho da fonte
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textoCategoria: {
        width: '80%',
        paddingHorizontal: 40,
        paddingVertical: 19, // Aumentado o tamanho dos botões
        margin: 8,
        alignItems: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 20,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        flexDirection: 'row', 
    },
    categoriaText: {
        fontSize: 18, // Aumentado o tamanho da fonte
        color: '#333',
        marginLeft: 10,
    },
    estiloTitulo: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    estiloDescricao: {
        marginBottom: 4,
        fontSize: 16,
        color: '#666',
    },
    estiloDistancia: {
        fontFamily: "CircularSpotifyText-Light",
        fontSize: 14,
        textAlign: 'center',
        margin: 3,
        color: '#888',
    },
    estiloCard: {
        width: '85%',
        margin: 10,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
});
export default ExplorarRoute;