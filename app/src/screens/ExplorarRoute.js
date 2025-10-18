// Imports de bibliotecas para componentes funcionais
import * as React from 'react';
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
// Bibliotecas de fontes, icones
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Font from "expo-font";
import Icon from 'react-native-vector-icons/Ionicons';
// Imports de classes de icones e estabelecimentos
import IconesCategorias from "./IconesCategorias";
import ExplorarEstabelecimentos from './itensExplorar/ExplorarEstabelecimentos';

// Função para calcular a distância entre dois pontos geográficos (latitude/longitude)
export function getDistanceBetweenPoints(latitude1, longitude1, latitude2, longitude2, unit = 'miles') {
    let theta = longitude1 - longitude2;
    // Função matemática para calcular a distância
    let distance = 60 * 1.1515 * (180/Math.PI) * Math.acos(
        Math.sin(latitude1 * (Math.PI/180)) * Math.sin(latitude2 * (Math.PI/180)) + 
        Math.cos(latitude1 * (Math.PI/180)) * Math.cos(latitude2 * (Math.PI/180)) * Math.cos(theta * (Math.PI/180))
    );

    if (unit === 'miles') {
        return parseFloat(distance.toFixed(2)); // ✅ Corrigido: retorna em milhas com 2 casas decimais
    } else if (unit === 'kilometers') {
        return parseFloat((distance * 1.609344).toFixed(2)); // ✅ Corrigido: retorna em km com 2 casas decimais
    }
}

// Componente funcional principal da rota "Explorar"
const ExplorarRoute = ({ navigation, estabelecimentos, categorias, localUser}) => {
    //Variável para armazenar a categoria ativa
    const [categoriaAtiva, setCategoriaAtiva] = useState(null);
    //Variavel para a apresentação dos resultados da barra de pesquisa
    const [searchQuery, setSearchQuery] = React.useState('');
    //Variavel para armazenar os resultados da pesquisa
    const [resultadoPesquisa, setResultadoPesquisa] = useState([]); 

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
    const navegaTela = async (id) => {
        if (categoriaAtiva !== null && (estabelecimentos !== null && estabelecimentos !== undefined)){
            const local = await estabelecimentos.filter (estabelecimento=>estabelecimento.id === id); 
            navigation.navigate('EstabelecimentoComponent', {local:local}) 
        }
    }
    
    // useEffect para atualizar a lista de resultados quando a categoria muda
    useEffect(()=>{
        if (categoriaAtiva !== null && (estabelecimentos !== null && estabelecimentos !== undefined)) {
            // Mostra todos os estabelecimentos da categoria ativa inicialmente
            const result = estabelecimentos.filter(estabelecimento => estabelecimento.categoria === categoriaAtiva);
            setResultadoPesquisa(result);
        } else {
            setResultadoPesquisa([]);
        }
    }, [categoriaAtiva, estabelecimentos]);

    // useEffect para barra de pesquisa
    useEffect(()=>{
        if (categoriaAtiva !== null && (estabelecimentos !== null && estabelecimentos !== undefined)) {
            if (searchQuery.trim() !== "") {
                // Busca em tempo real apenas pelo nome do estabelecimento dentro da categoria ativa
                const filtered = estabelecimentos.filter(estabelecimento =>
                    estabelecimento.categoria === categoriaAtiva &&
                    estabelecimento.nome.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setResultadoPesquisa(filtered); //Atualiza os resultados da pesquisa
            } else {
                // ✅ Se a pesquisa for apagada, mostra todos os da categoria ativa
                const result = estabelecimentos.filter(estabelecimento => estabelecimento.categoria === categoriaAtiva);
                setResultadoPesquisa(result);
            }
        }
    }, [searchQuery, categoriaAtiva, estabelecimentos]);

    const mudaCategoria = (index) => {
        if(index !== null){
            setCategoriaAtiva(index);
        } else {
            setCategoriaAtiva(null);
            setResultadoPesquisa([]); // limpa quando volta para as categorias
        }
        setSearchQuery(''); // ✅ limpa pesquisa ao trocar de categoria
    }

    const renderComponent = () => {
        if (categoriaAtiva !== null) {
            // Renderização de tela
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <TouchableOpacity style={styles.buttonBack} onPress={() => mudaCategoria(null)}>
                        <Icon name="arrow-back" size={20} color="#fff" style={styles.icon} />
                        <Text style={styles.buttonBackText}>Voltar</Text>
                    </TouchableOpacity>

                    {/* A barra de pesquisa só aparece quando uma categoria é selecionada */}
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

                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{
                            paddingBottom: 120, // <-- Reservado espaço extra para o FloatingMenu
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        <ExplorarEstabelecimentos 
                            estabelecimentos={resultadoPesquisa} 
                            localUser={localUser} 
                            clickCard={navegaTela} 
                            getDistanceBetweenPoints={getDistanceBetweenPoints} 
                        />
                    </ScrollView>
                </SafeAreaView>
            )
        } else {
            return (renderCategorias());
        }
    };

    const renderCategorias = () => {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {/* 🔹 O título agora está fixo fora da ScrollView, não rola junto */}
                <Text style={styles.tituloCategorias}>Categorias de Lugares</Text>

                {/* 🔹 A ScrollView agora ocupa todo o espaço e elimina o espaço vazio */}
                <ScrollView 
                    style={{ flex: 1 }}
                    contentContainerStyle={{ 
                        paddingBottom: 120, // <-- reservado espaço extra para o FloatingMenu (corrige o problema)
                        flexGrow: 1 
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {categorias.map((item, index) => (
                        <TouchableOpacity 
                            key={index} 
                            onPress={() => mudaCategoria(index)} 
                            style={[styles.textoCategoria, index===categorias.length-1 && {marginBottom:40}]}
                        >
                            <IconesCategorias index={index}/>
                            <Text style={styles.categoriaText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    };
    
    return (
        <View style={styles.container}>
            {/* A pesquisa é exibida apenas dentro de renderComponent quando categoriaAtiva !== null */}
            <View style={{ width: windowDimensions.width, height: '90.8%' }}>
                {renderComponent()}
            </View>
        </View>
    );
}

// Folha de estilos utilizadas
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F5E6', 
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
        backgroundColor: "#66CDAA", 
        borderRadius: 25,
        paddingVertical: 15,
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
        fontSize: 15, 
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textoCategoria: {
        width: '80%',
        paddingHorizontal: 40,
        paddingVertical: 19, 
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
        fontSize: 18, 
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
    tituloCategorias: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
});
export default ExplorarRoute;
