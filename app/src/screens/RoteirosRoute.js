//classe RouteirosRoute
import React from "react";
import ListaRoteiros from "../components/ListaRoteiros";
import { View } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Importa o hook de navegação

const Roteiros= ({roteiros}) =>{

    const navigation = useNavigation(); // Usando o hook de navegação

    const clickCard = (roteiroClicado)=>{
        console.log("C=RoteirosRoute roteiroClicado="+roteiroClicado.fotos)
        navigation.navigate("GuiasTuristicos", {roteiro: roteiroClicado})
    }

    console.log("C=RoteirosRoute roteiros="+roteiros);
     
    return(
        <View>
            <ListaRoteiros
                roteiros={roteiros}
                clickCard={clickCard}
            />
        </View>
    )

}

export default Roteiros;