//classe CustomNavigationBar
//Parte do app responsavel pela diminuição do tamamnho da barra de voltar/informações da tela.
import { getHeaderTitle } from '@react-navigation/elements';
import { Appbar } from 'react-native-paper';
import * as Font from "expo-font"
import { useEffect, useState } from "react";

export default function CustomNavigationBar({ navigation, route, options, back }) {
  const title = getHeaderTitle(options, route.name);

  const [active, setActive] = useState('');
  const fetchFonts = () => {
    return Font.loadAsync({
      'CircularSpotifyText-Bold': require('../assets/fonts/CircularSpotifyText-Bold.otf'),
      'CircularSpotifyText-Light': require('../assets/fonts/CircularSpotifyText-Light.otf'),
      'CircularSpotifyText-Book': require('../assets/fonts/CircularSpotifyText-Book.otf'),
    });
  };

  useEffect(()=>{
    const carregaFonte = async ()=>{
      await fetchFonts();
    }
    carregaFonte();

  }, [])

  return (
    <Appbar.Header style={{marginTop: -35}} >
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}