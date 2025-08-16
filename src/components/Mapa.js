import { View, StyleSheet, Text, Platform } from "react-native";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';

// IMPORTAÇÕES CONDICIONAIS
let MapView, Marker, Callout, MapViewDirections;

if (Platform.OS !== 'web') {
  MapView = require("react-native-maps").default;
  Marker = require("react-native-maps").Marker;
  Callout = require("react-native-maps").Callout;
  MapViewDirections = require("react-native-maps-directions").default;
}

function degreesToRadians(angle) {
    return angle * (Math.PI / 180);
}

function kMToLongitudes(km, atLatitude) {
    return km * 0.0089831 / Math.cos(degreesToRadians(atLatitude));
}

const Mapa = ({ route }) => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    const { localizacao } = route.params;
    const googleMapsApiKey = "AIzaSyBl22spyfkbeHUzOhwSeOtVCDAIYJhxHwE";
    const [origem, setOrigem] = useState({ latitude: localizacao.latitude, longitude: localizacao.longitude });
    const [destino, setDestino] = useState({ latitude: localizacao.latitude, longitude: localizacao.longitude });

    useEffect(() => {
        if (location !== null) {
            setOrigem({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        }
    }, [location]);

    if (origem.latitude === localizacao[0] && origem.longitude === localizacao[1]) {
        return null;
    }

    // SE FOR WEB, MOSTRA APENAS UMA MENSAGEM
    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>O mapa não está disponível na versão web.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                initialRegion={{
                    latitude: origem.latitude,
                    longitude: origem.longitude,
                    latitudeDelta: 0.00001,
                    longitudeDelta: kMToLongitudes(1.0, origem.longitude)
                }}
                showsUserLocation={true}
                style={styles.mapa}
            >
                <Marker coordinate={destino}>
                    <Callout>
                        <Text>Destino</Text>
                    </Callout>
                </Marker>

                <Marker coordinate={origem}>
                    <Callout>
                        <Text>Você está aqui</Text>
                    </Callout>
                </Marker>

                <MapViewDirections
                    origin={origem}
                    destination={destino}
                    apikey={googleMapsApiKey}
                    precision="high"
                    strokeWidth={7}
                    strokeColor="orange"
                    geodesic={true}
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapa: {
        height: "100%",
        width: "100%",
    },
    inputContainer: {
        width: "100%",
    },
    input: {
        backgroundColor: "white",
    },
    botaoRota: {
        color: "white",
    },
    text: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        marginTop: 20
    }
});

export default Mapa;
