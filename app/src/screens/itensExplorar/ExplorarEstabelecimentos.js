// Importações de componentes e cards
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from "react-native-paper";

// Componente que recebe a lista de estabelecimentos, posição do usuário, função de distância e clique no card
const ExplorarEstabelecimentos = ({ estabelecimentos, localUser, getDistanceBetweenPoints, clickCard }) => {
    return (
        <>
            {/* Se houver estabelecimentos mostra a lista senão mostra mensagem*/}
            {estabelecimentos !== null && estabelecimentos !== undefined && estabelecimentos.length > 0 ? (
                <View style={styles.listaEstabelecimentos}>
                    {estabelecimentos.map((item) => (
                        // Ao clicar chama a função
                        <Card 
                            key={item.id.toString()} 
                            onPress={() => clickCard(item.id)} 
                            mode="outlined" 
                            style={styles.estiloCard} 
                        >
                            {/* Verifique se fotos existem antes de tentar acessá-las */}
                            {item.fotos && item.fotos.length > 0 && (
                                <Card.Cover style={styles.estiloCardCover} source={{ uri: item.fotos[0] }} />
                            )}
                            <View style={styles.cardContent}>
                                {/* Textos dos cards e informações de distância*/}
                                <Text style={styles.estiloTitulo}>{item.nome}</Text>
                                <Text style={styles.estiloDescricao}>{item.descricao}</Text>
                                <Text style={styles.estiloDistancia}>
                                    A {getDistanceBetweenPoints(
                                        localUser.latitude, 
                                        localUser.longitude, 
                                        item.localizacao.latitude, 
                                        item.localizacao.longitude, 
                                        "kilometers"
                                    )} KM de você
                                </Text>
                            </View>
                        </Card>
                    ))}
                </View>
            ) : (
                <Text>Não foram encontrados resultados.</Text>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    listaEstabelecimentos: {
        paddingHorizontal: 15,
        paddingBottom: 20,
        backgroundColor: '#f8f8f8',
    },
    estiloCard: {
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 3, // sombra no Android
        shadowColor: '#000', // sombra no iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    estiloCardCover: {
        height: 200,
    },
    cardContent: {
        padding: 15,
    },
    estiloTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    estiloDescricao: {
        fontSize: 14,
        color: '#777',
        marginVertical: 5,
    },
    estiloDistancia: {
        fontSize: 14,
        color: '#4CAF50',
        marginTop: 5,
        fontWeight: 'bold',
    },
});

export default ExplorarEstabelecimentos;
