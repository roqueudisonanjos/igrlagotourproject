//classe GuiasTuristicosComponent
import React, {useState } from 'react';
import {View,Text,Image, ScrollView ,StyleSheet,FlatList, useWindowDimensions} from 'react-native';
import { List } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

const GuiasTuristicosComponent = ({ route }) => {

  const navigation = useNavigation();

  const { roteiro } = route.params;

  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: roteiro.nome,
    });
  }, [navigation]);

  const { width } = useWindowDimensions();

  const [expandedIntroduction, setExpandedIntroduction] = useState(false);
  const [expandedHow, setExpandedHow] = useState(false);
  const [expandedpontosvisita, setExpandedpontosvisita] = useState(false);
  const [expandedSaibaMais, setExpandedSaibaMais] = useState(false);
  const [expandedExtra, setExpandedExtra] = useState(false);

  return (
    <List.Section style={styles.container}>
      <List.Accordion
        title="Introdução"
        expanded={expandedIntroduction}
        onPress={() => {
          setExpandedIntroduction(!expandedIntroduction);
          setExpandedHow(false);
          setExpandedpontosvisita(false);
          setExpandedSaibaMais(false);
          setExpandedExtra(false);
        }}
        titleStyle={styles.accordionTitle}
        style={styles.accordion}
      >
        <View style={styles.carouselWrapper}>
          <Carousel
            loop
            snapEnabled
            pagingEnabled
            width={width * 0.85}
            height={width * 0.5}
            autoPlayInterval={3000}
            autoPlay
            data={roteiro.fotos}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 60,
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.carouselImage} />
            )}
          />
        </View>
        <ScrollView style={styles.scrollIntro}>
          <Text style={styles.introText}>{roteiro.introducao}</Text>
        </ScrollView>
      </List.Accordion>

      <List.Accordion
        title="Como chegar"
        expanded={expandedHow}
        onPress={() => {
          setExpandedIntroduction(false);
          setExpandedHow(!expandedHow);
          setExpandedpontosvisita(false);
          setExpandedSaibaMais(false);
          setExpandedExtra(false);
        }}
        titleStyle={styles.accordionTitle}
        style={styles.accordion}
      >

        <FlatList
          horizontal
          data={roteiro.como_chegar}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.howToList}
          renderItem={({ item }) => (
            <View style={styles.howToCard}>
              <Text style={styles.howToText}>{item}</Text>
            </View>
          )}
        />

        <View style={styles.carouselWrapper}>
          <Carousel
            loop
            snapEnabled
            pagingEnabled
            width={width * 0.85}
            height={width * 0.5}
            autoPlayInterval={3000}
            autoPlay
            data={roteiro.imagensComo_chegar}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 60,
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.carouselImage} />
            )}
          />
        </View>

      </List.Accordion>

      <List.Accordion
        title={roteiro.extra[0]}
        expanded={expandedExtra}
        onPress={() => {
          setExpandedIntroduction(false);
          setExpandedHow(false);
          setExpandedpontosvisita(false);
          setExpandedSaibaMais(false);
          setExpandedExtra(!expandedExtra);
        }}
        titleStyle={styles.accordionTitle}
        style={styles.accordion}
      > 
        <View style={styles.carouselWrapper}>
          <Carousel
            loop
            snapEnabled
            pagingEnabled
            width={width * 0.85}
            height={width * 0.5}
            autoPlayInterval={3000}
            autoPlay
            data={roteiro.fotos}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 60,
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.carouselImage} />
            )}
          />    
        </View>
              
        <ScrollView style={styles.scrollIntro}>
          <Text style={styles.introText}>{roteiro.extra[1]}</Text>
        </ScrollView>
      </List.Accordion>

      <List.Accordion
        title="Pontos de visita"
        expanded={expandedpontosvisita}
        onPress={() => {
          setExpandedIntroduction(false);
          setExpandedHow(false);
          setExpandedpontosvisita(!expandedpontosvisita);
          setExpandedSaibaMais(false);
          setExpandedExtra(false);
        }}
        titleStyle={styles.accordionTitle}
        style={styles.accordion}
      >           
        <View style={styles.carouselWrapper}>
          <Carousel
            loop={false}
            snapEnabled
            pagingEnabled={false}
            width={width * 0.85}
            height={width*0.5}
            autoPlayInterval={3000}
            autoPlay
            data={roteiro.pontosDeVisita}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 60,
            }}
            renderItem={({ index, item }) => {
              
              console.log("C=GuiasTuristicos item="+item);

              return(
                <View>
                  <Image source={{ uri: item.imagens[index] }} style={[styles.carouselImage, {height:180}]} />
                  <Text style={styles.howToText}>{item.nome}</Text>
                  <Text style={styles.howToText}>{item.descricao}</Text>
                </View>
            )}}
          />
        </View>

      </List.Accordion>

      <List.Accordion
        title="Saiba mais"
        expanded={expandedSaibaMais}
        onPress={() => {
          setExpandedIntroduction(false);
          setExpandedHow(false);
          setExpandedpontosvisita(false);
          setExpandedSaibaMais(!expandedSaibaMais);
          setExpandedExtra(false);
        }}
        titleStyle={styles.accordionTitle}
        style={styles.accordion}
      >           
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            INSTÂNCIA DE GOVERNANÇA REGIONAL - IGR LAGOTUR
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 4 }}>
            WhatsApp: (94) 99903-0066
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 4 }}>
            Instagram: @lago.tur
          </Text>
          
          <Text style={{ fontSize: 10, marginBottom: 4, alignItems:'center', color:'gray' }}>
            Desenvolvido por:: Wesley David Santos Lima
          </Text>
      </View>
      </List.Accordion>

    </List.Section>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f7fb',
    paddingBottom: 30,
  },

  imageCarousel: {
    paddingVertical: 10,
    paddingLeft: 16,
  },
  carouselImage: {
    width: 250,
    height: 150,
    borderRadius: 12,
    marginRight: 16,
  },


  accordion: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    elevation: 3,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e2a38',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    paddingVertical: 10,
  },
  scrollIntro: {
    paddingHorizontal: 20,
    maxHeight: 200,
    marginBottom: 15,
  },
  introText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 26,
    textAlign: 'justify',
    letterSpacing: 0.3,
  },
  carouselWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  howToList: {
    paddingVertical: 15,
    paddingLeft: 16,
  },
  howToCard: {
    width: 270,
    height: 140,
    marginRight: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dce1e7',
    elevation: 2,
  },
  howToText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
  diaCard: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  diaImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 5,
  },
  diaTitulo: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 2,
  },
  diaTexto: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});

export default GuiasTuristicosComponent;