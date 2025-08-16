import React from "react";
import { FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { View, Text } from "react-native";

const ListaRoteiros = ({roteiros, clickCard}) =>{

    return(
        <FlatList
           style={{ marginBottom: 90 }}
            data={roteiros}
            keyExtractor={item => item.index}
            contentContainerStyle={styles.listaEstabelecimentos}
            renderItem={(item)=>{

                let itemIteravel = item.item;

                return(
                    <Card onPress={() => clickCard(itemIteravel)} mode="outlined" style={styles.estiloCard}>
                        <Card.Cover style={styles.estiloCardCover} source={{ uri: itemIteravel.fotoCapa }} />
                        <View style={styles.cardContent}>
                            <Text style={styles.estiloTitulo}>{itemIteravel.nome}</Text>
                            <Text style={styles.estiloDescricao}>{itemIteravel.descricao}</Text>
                        </View>
                    </Card>
                )
            }}
        />
    )
}

const styles = StyleSheet.create({
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
    listaEstabelecimentos: {
        paddingHorizontal: 15,
        paddingBottom: 20,
        backgroundColor: '#f8f8f8',
    },
})

export default ListaRoteiros;