// Importando bibliotecas de navegação, componentes e interface
import { useNavigation } from '@react-navigation/native';
import React from "react";
import { StyleSheet, Text, View } from "react-native";
// Importa o componente ListaRoteiros que é responsável por renderizar os roteiros
import ListaRoteiros from "../components/ListaRoteiros";

// Define o componente funcional Roteiros, recebendo uma lista de ListaRoteiros
const Roteiros = ({ roteiros }) => {
    // Cria uma instância do objeto navigation, possibilitando navegar para outras telas
    const navigation = useNavigation(); 

    // Função executada quando um roteiro específico é clicado pelo usuário.
    const clickCard = (roteiroClicado) => {
        ////console.log("C=RoteirosRoute roteiroClicado=" + roteiroClicado.fotos)
        navigation.navigate("GuiasTuristicos", { roteiro: roteiroClicado })
    }

    ////console.log("C=RoteirosRoute roteiros=" + roteiros); 

    // Renderização de telas
    return (
        <View style={{ flex: 1 }}>
            {/* Título fixo da tela de roteiros turísticos */}
            <Text style={styles.titulo}>Roteiros Turísticos</Text>  

            {/* Lista de roteiros turísticos em formato de cards */}
            <ListaRoteiros
                roteiros={roteiros}
                clickCard={clickCard}
            />
        </View>
    );
}

// Estilização do título da tela
const styles = StyleSheet.create({
    titulo: {
        fontSize: 22,           // tamanho da fonte do título
        fontWeight: "bold",     // deixa o texto em negrito
        marginVertical: 10,     // espaçamento acima e abaixo
        textAlign: "center",    // centraliza o texto
    }
});

export default Roteiros;
