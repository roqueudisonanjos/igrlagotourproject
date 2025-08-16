import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Card } from "react-native-paper";
import { StyleSheet } from 'react-native';

const ExplorarEstabelecimentos = ({ estabelecimentos, localUser, getDistanceBetweenPoints, clickCard }) => {

    return (
        <>
        {estabelecimentos!==null && estabelecimentos!==undefined && estabelecimentos.length>0 ? (
            <FlatList
                style={{ marginBottom: 90 }}
                data={estabelecimentos}
                renderItem={({ item }) => (
                    <Card onPress={() => clickCard(item.id)} mode="outlined" style={styles.estiloCard}>
                        {/* Verifique se fotos existem antes de tentar acessá-las */}
                        {item.fotos && item.fotos.length > 0 && (
                            <Card.Cover style={styles.estiloCardCover} source={{ uri: item.fotos[0] }} />
                        )}
                        <View style={styles.cardContent}>
                            <Text style={styles.estiloTitulo}>{item.nome}</Text>
                            <Text style={styles.estiloDescricao}>{item.descricao}</Text>
                            <Text style={styles.estiloDistancia}>
                                A {getDistanceBetweenPoints(localUser.latitude, localUser.longitude, item.localizacao.latitude, item.localizacao.longitude, "kilometers")} KM de você
                            </Text>
                        </View>
                    </Card>
                )}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listaEstabelecimentos}
            />
        ) : (
            <Text>Sem estabelecimentos</Text>
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