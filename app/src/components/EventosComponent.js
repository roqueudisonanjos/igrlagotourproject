// EventosComponent: tela de detalhes de eventos, com fotos, vídeos, mapa

import { FontAwesome } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tab, TabView } from '@rneui/themed';
import * as Font from "expo-font";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Linking, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Avatar, Button, Icon, Snackbar } from "react-native-paper";
import Eventos from "../classes/Eventos";
import Imagens from "./Imagens";
import Videos from "./Videos";

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 80; // altura mínima, como a da barra de navegação
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
// Componente EventosComponent
const EventosComponent = ({ route, navigation }) => {
  
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  // Controla o índice da aba selecionada (Fotos ou Vídeos) no TabView
  const [index, setIndex] = useState(0);
  // Obtém as dimensões da janela do dispositivo 
  const windowDimensions = useWindowDimensions();
  // Controla a visibilidade do Snackbar que indica se o evento já terminou
  const [visible, setVisible] = useState(false);
  // Indica se as fontes personalizadas foram carregadas, evitando renderização antes do carregamento
  const [fontLoaded, setFontLoaded] = useState(false);
  // Recebe o objeto evento enviado pela rota de navegação, contendo todos os dados do evento selecionado
  const { evento } = route.params;
  // Cria um novo evento
  const newEvento = evento;
  // Instancia a classe Eventos, armazenando todos os atributos do evento
  const eventos = new Eventos(
    newEvento.id, 
    newEvento.nome, 
    newEvento.localizacao, 
    newEvento.contatos, 
    newEvento.descricao, 
    newEvento.fotos, 
    newEvento.videos, 
    newEvento.entrada, 
    newEvento.tipo, 
    newEvento.nomeDoLocal, 
    newEvento.data, 
    newEvento.imagemCapa);

  const abreMapa = (localizacao) => {
    navigation.navigate("Mapa", { localizacao });
  };

  const fetchFonts = () => {
    return Font.loadAsync({
      'CircularSpotifyText-Bold': require('../../assets/fonts/CircularSpotifyText-Bold.otf'),
      'CircularSpotifyText-Light': require('../../assets/fonts/CircularSpotifyText-Light.otf'),
      'CircularSpotifyText-Book': require('../../assets/fonts/CircularSpotifyText-Book.otf'),
    });
  };

  useEffect(() => {
    const carregaFonte = async () => {
      await fetchFonts();
      setFontLoaded(true);
    };
    carregaFonte();
  }, []);

  try {
    return (
      <View
        style={[styles.container, {flex:1}]}
      >
          <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            style={styles.snackbar}
            action={{
              label: 'Ok',
              labelStyle: { color: '#fff' },
              onPress: () => setVisible(false),
            }}
          >
            Este evento já terminou.
          </Snackbar>

          <Animated.View style={[styles.header, { height: headerHeight }]}>
            <Image
              source={{ uri: eventos.imagemCapa }}
              style={styles.headerImage}
              resizeMode="cover"
            />
          </Animated.View>

          <Animated.ScrollView
            style={styles.scrollView}
            contentContainerStyle={{flex:1}}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
          >

            <View style={styles.informacoesEventos}>
              
              <View>
                <Avatar.Image size={120} style={styles.imagem} source={{ uri: eventos.imagemCapa }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                  <TouchableOpacity onPress={() => Linking.openURL("https://www.instagram.com/")} style={styles.iconSpacing}>
                    <FontAwesome name="instagram" size={28} color="#C13584" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL(`https://wa.me/${eventos.getContatos()[0].replace(/[^0-9]/g, '')}`)}>
                    <FontAwesome name="whatsapp" size={28} color="#25D366" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.containerText}>
                <Text style={[styles.tituloEvento, { width: 200 }]}>{eventos.getNome()}</Text>

                <View style={styles.dateTimeContainer}>
                  <View style={styles.row}>
                    <Icon source="calendar" size={20} />
                    <Text style={styles.dateTimeText}>{eventos.getData()}</Text>
                  </View>
                  <View style={[styles.row, { marginLeft: 15 }]}> 
                    <Icon source="clock-outline" size={20} />
                    <Text style={styles.dateTimeText}>{eventos.getHora()}</Text>
                  </View>
                </View>

                <View style={styles.buttonsRow}>
                  <Button
                    icon="map-marker"
                    mode="contained"
                    buttonColor="#267c01"
                    textColor="white"
                    style={styles.button}
                    onPress={() => abreMapa(eventos.getLocalizacao())}
                  >
                    Mapa
                  </Button>
                </View>
              </View>
            </View>

            <Text numberOfLines={5} style={[styles.texto, {
              width: windowDimensions.width - 40,
              alignSelf: "center",
              textAlign: "justify",
              fontSize: 16,
              marginVertical: 15,
            }]}>{eventos.getDescricao()}</Text>

            <Tab value={index} onChange={(e) => setIndex(e)} indicatorStyle={{ backgroundColor: '#004D40', height: 3 }} style={{ backgroundColor: 'white' }}>
              <Tab.Item title="Fotos" titleStyle={{ fontSize: 12, color: 'black' }} icon={<Entypo name="images" size={24} color="black" />} />
              <Tab.Item title="Vídeos" titleStyle={{ fontSize: 12, color: 'black' }} icon={<MaterialIcons name="video-collection" size={24} color="black" />} />
            </Tab>

            <TabView value={index} onChange={setIndex} animationType="spring">
              {(eventos.getImagem() && 
                <TabView.Item style={{ width: windowDimensions.width, flex: 1 }}>
                  <Imagens imagens={eventos.getImagem()} />
                </TabView.Item>
              )}

              {(eventos.getVideos() && 
                <TabView.Item style={{ width: windowDimensions.width, flex: 1 }}>
                  <Videos style={{ width: '100%', flex: 1, margin:5 }} videos={eventos.getVideos()} />
                </TabView.Item>
              )}
              
            </TabView>
        
        </Animated.ScrollView>

      </View>
    );
  } catch (e) {
    console.error(e);
  }
};

const styles = StyleSheet.create({
  informacoesEventos: { 
    flexDirection: "row", 
    alignItems: "center" 
},
  container: { 
    backgroundColor: '#E0FFF5' 
},  
  parallaxImage: { 
    width: '100%', 
    height: 300 
},
  imagem: { 
    margin: 10 
},
  texto: { 
    fontFamily: 'CircularSpotifyText-Book', 
    fontSize: 15, 
    color: "black" 
},
  containerText: { 
    marginLeft: 20, 
    padding: 8 
},
  tituloEvento: { 
    fontFamily: 'CircularSpotifyText-Bold', 
    fontSize: 20, 
    textAlign: "center", 
    color: "#004D40" 
},
  socialButtons: { 
    flexDirection: 'row', 
    marginTop: 10, 
    marginBottom: 5 
},
  iconSpacing: { 
    marginRight: 15 
},
  dateTimeContainer: { 
    flexDirection: 'row', 
    marginTop: 5 
},
  dateTimeText: { 
    marginLeft: 5, 
    fontFamily: 'CircularSpotifyText-Book', 
    fontSize: 15 
},
  row: { 
    flexDirection: 'row', 
    alignItems: 'center' 
},
  buttonsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
},
  button: { 
    borderRadius: 15, 
    margin: 3 
},
  snackbar: { 
    backgroundColor: '#d32f2f' 
},
  eventoEncerrado: { 
    fontFamily: 'CircularSpotifyText-Bold', 
    color: 'red', 
    fontSize: 16, 
    alignSelf: 'center', 
    marginTop: 8 
},
  headerImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    marginTop: HEADER_MAX_HEIGHT,
    flex:1
  },
  header: {
    width: '100%',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
});

export default EventosComponent;
