import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { getDistanceBetweenPoints } from '../screens/ExplorarRoute';

const SugestoesComponent = ({sugestoes, estabelecimentos, localUser, clickCard}) => {
  
  const arraySugestoes = JSON.parse(sugestoes)

  const buildObjectsSugestoes = (arraySugestoes) =>{
    
    const estabelecimentosLista = [];
    
    // Percorre cada campo (cada estabelecimento)
    Object.entries(estabelecimentos).forEach(([nomeCampo, valorCampo]) => {

      if (arraySugestoes.includes(parseInt(valorCampo.id))) {
        estabelecimentosLista.push({ nomeCampo, ...valorCampo });
      }
    });

    return estabelecimentosLista;
  }

  return (
    <FlatList
      style={{ marginBottom: 90, paddingHorizontal:10, paddingBottom: 10, marginTop: 20 }}
      data={buildObjectsSugestoes(arraySugestoes)}
      keyExtractor={(_, index)=> index}
      renderItem={(i)=>{

        const item = i.item;

        console.log("C=SugestoesComponent item=")
        console.log(item);

        return(
          <Card onPress={()=>clickCard(item.id)} mode="outlined" style={styles.estiloCard}>
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
        )
        
      }}
    />
  );
};

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
  estiloDistancia: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 5,
    fontWeight: 'bold',
  },
});

export default SugestoesComponent;
