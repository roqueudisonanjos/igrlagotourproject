import { View } from "react-native";
import { StyleSheet } from "react-native";
import { Animated, useWindowDimensions, TouchableOpacity, ScrollView } from "react-native";
import * as React from 'react';
import { Card, Text } from 'react-native-paper';
import { useState, useEffect } from "react";
import { Searchbar } from 'react-native-paper';
import { useRef } from 'react';
import { useNavigation } from '@react-navigation/native'; // Importa o hook de navegação

const EventosRoute = ({ eventos, localUser }) => {
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
    }

    useEffect(() => {
        if (eventos && eventos.length > 0) {
            setResultadoPesquisa(eventos); // Inicializa o resultado com todos os eventos
        } else {
            console.log("Nenhum evento recebido.");
        }
    }, [eventos]);

    const windowDimensions = useWindowDimensions();
    const scrollX = useRef(new Animated.Value(0)).current; // Valor para animação
    const navigation = useNavigation(); // Usando o hook de navegação

    const [searchQuery, setSearchQuery] = React.useState('');
    //const para apresentação dos resultados da barra de pesquisa
    const [resultadoPesquisa, setResultadoPesquisa] = useState([]); 
    
    useEffect(()=>{ //use effect para barra de pesquisa
        if (eventos !== null){
            if (resultadoPesquisa.length >= 0 && searchQuery !== ""){
                setResultadoPesquisa(eventos.filter(evento=>evento.nome.indexOf(searchQuery)!== -1 || evento.nomeDoLocal.indexOf(searchQuery)!== -1 || evento.tipo.indexOf(searchQuery)!== -1 )) //querry que contem o que o usuario esta pesquisando
                // setando os resultados da pesquisa, independente das telas em explorarRoute
            } else{
                setResultadoPesquisa([]);
            }
        }
    },[searchQuery])

    const abreComponenteEventos = (id) => {
        const evento = eventos.find(evento => evento.id === id); // Encontra o evento pelo id
        if (evento) {
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
                            <Searchbar
                                placeholder="Está procurando algo?"
                                onChangeText={setSearchQuery}
                                value={searchQuery}
                                style={styles.searchBar}
                            />


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




                        {/* Animated FlatList para rolagem horizontal com animação */}
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
                                        <Card mode="outlined" style={styles.estiloCard} onPress={() => abreComponenteEventos(item.id)}>
                                            <Card.Cover style={styles.estiloCardCover} source={{ uri: item.fotos[0] }} />
                                            <Card.Title titleStyle={styles.estiloTitulo} title={item.nome} />
                                            <Card.Content>
                                                <Text style={styles.estiloDescricao} variant="bodyMedium">{item.descricao}</Text>
                                                <Text style={styles.estiloDistancia} variant="bodyMedium">
                                                    A {getDistanceBetweenPoints(localUser.latitude, localUser.longitude, item.localizacao.latitude, item.localizacao.longitude, "kilometers")} KM de você
                                                </Text>
                                            </Card.Content>
                                        </Card>
                                    </Animated.View>
                                );
                            }}
                            keyExtractor={item => item.id}
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