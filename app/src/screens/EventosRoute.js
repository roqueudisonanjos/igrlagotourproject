// Import de bibliotecas essenciais para o funcionamento da tela, como navegação
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useEffect, useRef, useState } from "react";
// Funções de interação de tela
import { Animated, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Card, Text } from 'react-native-paper';
import { getDistanceBetweenPoints } from './ExplorarRoute';
// Componente que recebe a lista de evenbtos locais e a localidade do usuário
const EventosRoute = ({ eventos, localUser }) => {
    /* / Função para capturar distancia do usuário e calcular até um ponto
    function getDistanceBetweenPoints(latitude1, longitude1, latitude2, longitude2, unit = 'miles') {
        let theta = longitude1 - longitude2;
        let distance = 60 * 1.1515 * (180 / Math.PI) * Math.acos(
            Math.sin(latitude1 * (Math.PI / 180)) * Math.sin(latitude2 * (Math.PI / 180)) +
            Math.cos(latitude1 * (Math.PI / 180)) * Math.cos(latitude2 * (Math.PI / 180)) * Math.cos(theta * (Math.PI / 180))
        );
        if (unit == 'miles') {
            return Math.round(distance, 2); // Retorna a distância em milhas
        } else if (unit == 'kilometers') {
            return (distance * 1.609344).toFixed(2); // Retorna a distância em quilômetros
        }
    }*/
    // Responsável por pesquisar eventos na tela de pesquisa
    useEffect(() => {
        if (eventos && eventos.length > 0) {
            setResultadoPesquisa(eventos); // Inicializa o resultado com todos os eventos
        } else {
            console.log("Nenhum evento recebido.");
        }
    }, [eventos]);
// Captura largura e altura da tela para uso em layout responsivo
    const windowDimensions = useWindowDimensions();
// Valor animado usado para controlar a escala dos cards durante a rolagem horizontal.
    const scrollX = useRef(new Animated.Value(0)).current; 
// Hook de navegação que permite ir para a tela de detalhes de um evento.
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
// Const para apresentação dos resultados da barra de pesquisa
    const [resultadoPesquisa, setResultadoPesquisa] = useState([]); 
    
    useEffect(()=>{ // Use effect para barra de pesquisa
        if (eventos !== null){
            if (resultadoPesquisa.length >= 0 && searchQuery !== ""){
                setResultadoPesquisa(eventos.filter(evento=>evento.nome.indexOf(searchQuery)!== -1 || evento.nomeDoLocal.indexOf(searchQuery)!== -1 || evento.tipo.indexOf(searchQuery)!== -1 )) //querry que contem o que o usuario esta pesquisando
                // setando os resultados da pesquisa, independente das telas em explorarRoute
            } else{
                setResultadoPesquisa([]);
            }
        }
    },[searchQuery])
    // Função que recebe o ID do evento para abrir
    const abreComponenteEventos = (id) => {
        // Encontra o evento pelo id
        const evento = eventos.find(evento => evento.id === id); 
        if (evento) {
            // Navega para EventosComponent passando o evento selecionado como parâmetro
            navigation.navigate('EventosComponent', { evento });
        } else {
            console.log(`Evento com ID ${id} não encontrado.`);
        }
    };
   
    const filtraCategoria = (categoria) => { 
    }
    /* esse valor de 180 na altura, é para que o container onde está a lista de eventos caiba entre o appheader e o bottomnavigator */
    return (
        <View style={styles.container}>
            <View style={{height: windowDimensions.height - 180}}> 
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: windowDimensions.width }}>
                            
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity style={[styles.botaoCategoria, styles.botaoSelecionado]} onPress={() => filtraCategoria('Shows e Festas')}>
                            <Text style={styles.textoBotao}>Shows e Festas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.botaoCategoria, styles.botaoSelecionado]} onPress={() => filtraCategoria('Eventos Locais')}>
                            <Text style={styles.textoBotao}>Eventos Locais</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.botaoCategoria, styles.botaoSelecionado]} onPress={() => filtraCategoria('Eventos Distantes')}>
                            <Text style={styles.textoBotao}>Eventos Distantes</Text>
                        </TouchableOpacity>
                    </ScrollView>
                        {/* Animated FlatList para rolagem horizontal dos cards com animação */}
                        <Animated.FlatList
                            data={resultadoPesquisa.length > 0 ? resultadoPesquisa : eventos}
                            renderItem={({ item, index }) => {
                                const inputRange = [
                                    (index - 1) * 300,
                                    index * 300,
                                    (index + 1) * 300,
                                ];
                    
                                const scale = scrollX.interpolate({
                                    inputRange,
                                    outputRange: [0.8, 1, 0.8],
                                    extrapolate: 'clamp',
                                });

                                return (
                                    <Animated.View style={[styles.estiloCard, { transform: [{ scale }], }]}>
                                         {/* Card do evento com imagem, título, descrição e distância */}
                                        <Card mode="outlined" style={styles.estiloCard} onPress={() => abreComponenteEventos(item.id)}>
                                            <Card.Cover style={styles.estiloCardCover} source={{ uri: item.fotos[0] }} />
                                            <Card.Title titleStyle={styles.estiloTitulo} title={item.nome} />
                                            <Card.Content>
                                                <Text style={styles.estiloDescricao} variant="bodyMedium">{item.descricao}</Text>
                                                <Text style={styles.estiloDistancia} variant="bodyMedium">
                                                    {/* Calcula a distância do usuário até o evento */}
                                                    A {getDistanceBetweenPoints(localUser.latitude, localUser.longitude, item.localizacao.latitude, item.localizacao.longitude, "kilometers")} KM de você
                                                </Text>
                                            </Card.Content>
                                        </Card>
                                    </Animated.View>
                                );
                            }}
                            keyExtractor={item => item.id} // Identificador único para cada card
                            horizontal // Rolagem horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={300} // Snap para card centrado
                            decelerationRate="fast"
                            contentContainerStyle={styles.flatListContent}
                            bounces={false}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                { useNativeDriver: true }
                            )}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#E6F5E6', // Fundo verde claro
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 5,
        marginHorizontal: 10,
        marginVertical: 10,
        alignItems: 'center',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    containerBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    botaoCategoria: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        backgroundColor: '#66CDAA',
        borderRadius: 25,
        elevation: 2,  // Para dar uma sombra leve
    },
    textoBotao: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        fontWeight: 'bold',
    },
    botaoSelecionado: {
        backgroundColor: '#66CDAA',
        shadowColor: '#6200EE',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    estiloCard: {
        width: 280,
        margin: 10,
        alignSelf: "center",
        borderRadius: 20, // Bordas arredondadas
        elevation: 3, // Sombra
        backgroundColor: '#fff', // Fundo branco para destacar

    },
    estiloCardCover: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 250,
    },
    estiloTitulo: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "600",
        fontFamily: 'CircularSpotifyText-Bold',
        color: '#333', // Texto em cor mais escura para contraste
    },
    estiloDescricao: {
        marginBottom: 4,
        fontSize: 15,
        color: '#666', // Cor cinza para descrição
    },
    estiloDistancia: {
        fontFamily: "CircularSpotifyText-Light",
        fontSize: 13,
        textAlign: "center",
        margin: 3,
        color: '#007AFF',
    },
    flatListContent: {
        paddingVertical: 10,
    },
});

export default EventosRoute;