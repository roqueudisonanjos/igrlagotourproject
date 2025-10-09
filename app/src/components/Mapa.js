import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Mantive as funções originais mesmo que não sejam usadas para possivel uso posteriormente
function degreesToRadians(angle) {
  return angle * (Math.PI / 180);
}
// Converte uma distância em quilômetros para diferença em longitude
function kMToLongitudes(km, atLatitude) {
  return km * 0.0089831 / Math.cos(degreesToRadians(atLatitude));
}
// Componente principal Mapa que recebe parâmetros de navegação via route
const Mapa = ({ route }) => {
  const [location, setLocation] = useState(null);
  // Solicitação de acesso a localização
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);
  // Estado que representa o destino da rota inicializado com a localização recebida nos parâmetros
  const { localizacao } = route.params; // { latitude, longitude }
  const [origem, setOrigem] = useState({
    latitude: localizacao?.latitude,
    longitude: localizacao?.longitude
  });
  // Atualiza a origem para a localização atual do usuário assim que ela é obtida.
  const [destino, setDestino] = useState({
    latitude: localizacao?.latitude,
    longitude: localizacao?.longitude
  });

  useEffect(() => {
    if (location) {
      setOrigem({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    }
  }, [location]);

  // Web: apenas mensagem
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>O mapa não está disponível na versão web.</Text>
      </View>
    );
  }

  // valida destino
  if (
    !destino ||
    typeof destino.latitude !== 'number' ||
    typeof destino.longitude !== 'number'
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Destino inválido.</Text>
      </View>
    );
  }
  // Prepara as strings de origem e destino para abrir no Google Maps.
  const openRouteInGoogleMaps = async () => {
    const dest = `${destino.latitude},${destino.longitude}`;
    const hasOrigin =
      origem && typeof origem.latitude === 'number' && typeof origem.longitude === 'number';
    const originStr = hasOrigin ? `${origem.latitude},${origem.longitude}` : null;

    // Tentar abrir diretamente no app do Google Maps
    const appUrl = Platform.select({
      ios: originStr
        ? `comgooglemaps://?api=1&travelmode=driving&origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(dest)}`
        : `comgooglemaps://?api=1&travelmode=driving&destination=${encodeURIComponent(dest)}`,
      android: `google.navigation:q=${encodeURIComponent(dest)}&mode=d`,
    });
    // Fallback universal (abre app se instalado; caso contrário, navegador)
    const webUrl = originStr
      ? `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${encodeURIComponent(originStr)}&destination=${encodeURIComponent(dest)}`
      : `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${encodeURIComponent(dest)}`;
  // Função que tenta abrir a rota no app do Google Maps se não for possível abre no navegador.
    try {
      if (appUrl && (await Linking.canOpenURL(appUrl))) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch {
      await Linking.openURL(webUrl);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Rota para o destino</Text>
        <Text style={styles.infoText}>Destino: {destino.latitude.toFixed(6)}, {destino.longitude.toFixed(6)}</Text>
        {origem && typeof origem.latitude === 'number' && typeof origem.longitude === 'number' ? (
          <Text style={styles.infoText}>Origem: {origem.latitude.toFixed(6)}, {origem.longitude.toFixed(6)}</Text>
        ) : (
          <Text style={styles.infoText}>Origem: sua localização atual</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={openRouteInGoogleMaps}>
        <Text style={styles.buttonText}>Abrir rota no Google Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center", alignItems: "center" },
  infoBox: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    marginBottom: 16,
  },
  infoTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6, color: "#111" },
  infoText: { fontSize: 14, color: "#444" },
  button: {
    backgroundColor: "#1a73e8",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  text: { fontSize: 16, color: "#333", textAlign: "center", marginTop: 20 },
});

export default Mapa;
