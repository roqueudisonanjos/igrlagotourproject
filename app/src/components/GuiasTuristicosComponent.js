//classe GuiasTuristicosComponent 
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { List, Modal, Portal, Provider } from 'react-native-paper'; // Adicionado Modal, Portal e Provider do paper
import Carousel from 'react-native-reanimated-carousel';
// Declarando o componente GuiasTuristicosComponent
const GuiasTuristicosComponent = ({ route }) => {
  const navigation = useNavigation();
  // Recebe o objeto "roteiro" passado pela tela anterior via parâmetros
  const { roteiro } = route.params;
  // Altera o título do cabeçalho da tela para o nome do roteiro
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: roteiro.nome,
    });
  }, [navigation]);

  const { width, height } = useWindowDimensions(); // capturando altura da tela também
  // Estados de expansão para cada seção
  const [expandedIntroduction, setExpandedIntroduction] = useState(false);
  const [expandedHow, setExpandedHow] = useState(false);
  const [expandedpontosvisita, setExpandedpontosvisita] = useState(false);
  const [expandedSaibaMais, setExpandedSaibaMais] = useState(false);
  const [expandedExtra, setExpandedExtra] = useState(false);
  // Estado para controlar visibilidade do modal
  const [visibleModal, setVisibleModal] = useState(false);
  // Funções para abrir e fechar o modal
  const showModal = () => setVisibleModal(true);
  const hideModal = () => setVisibleModal(false);
  return (
    // Provider é necessário para o funcionamento do Portal do react-native-paper
    <Provider>
      <List.Section style={styles.container}>
        {/* Accordion Introdução */}
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

        {/* Accordion Como Chegar */}
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

        {/* Accordion Extra */}
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

        {/* Accordion Pontos de Visita */}
        <List.Accordion
          title="Pontos de visita"
          expanded={expandedpontosvisita}
          onPress={() => {
            setExpandedIntroduction(false);
            setExpandedHow(false);
            setExpandedpontosvisita(!expandedpontosvisita);
            setExpandedSaibaMais(false);
            setExpandedExtra(false);

            // Quando o usuário clicar, vai abrir o modal
            if (!expandedpontosvisita) {
              showModal();
            }
          }}
          titleStyle={styles.accordionTitle}
          style={styles.accordion}
        >
        </List.Accordion>

        {/* Modal para exibir o carrossel de Pontos de Visita */}
        <Portal>
          <Modal
            visible={visibleModal}
            onDismiss={hideModal}
            contentContainerStyle={[styles.modalContainer, { height: height * 0.7 }]} 
          >
            <Text style={styles.modalTitulo}>Pontos de Visita</Text>

            <Carousel
              loop={false}
              snapEnabled
              pagingEnabled={false}
              width={width * 0.85}
              height={height * 0.6}
              autoPlayInterval={3000}
              autoPlay
              data={roteiro.pontosDeVisita}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 60,
              }}
              renderItem={({ item }) => (
                <View style={{ alignItems: 'center', padding: 10 }}>
                  <Image source={{ uri: item.imagens[0] }} style={[styles.carouselImage, { height: 350 }]} />
                  <Text style={styles.howToText}>{item.nome}</Text>

                  {/* ScrollView aqui garante que a descrição inteira apareça */}
                  <ScrollView style={{ maxHeight: 200, marginTop: 8 }}>
                    <Text style={styles.howToText}>{item.descricao}</Text>
                  </ScrollView>
                </View>
              )}
            />
          </Modal>
        </Portal>

        {/* Accordion Saiba Mais */}
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

            <Text style={{ fontSize: 10, marginBottom: 4, alignItems: 'center', color: 'gray' }}>
              Desenvolvido por:: Wesley David Santos Lima
            </Text>
          </View>
        </List.Accordion>
      </List.Section>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f7fb',
    paddingBottom: 30,
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
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default GuiasTuristicosComponent;
