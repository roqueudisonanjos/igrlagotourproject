// Imports responsáveis por componentes basicos, utilizarios, estilos e fontes
import * as Font from "expo-font";
import * as React from 'react';
import { useEffect } from "react";
import { StyleSheet, Text, View } from 'react-native';
// Importação das classes Header e SugestoesComponent para alteração de dados de perfil receber sugestoes
import Header from '../components/Header';
import SugestoesComponent from '../components/SugestoesComponent';
// Define o componente Home, que possui as funções de navegação da classe Header, mostrando informações de acordo com o local do usuário
const Home=({navigation, sugestoes, user, nomeColecao, mudaColecao, abrirPerfilMethod, goToLogin, estabelecimentos, localUser})=>{
    // Navega para a tela de detalhes de um estabelecimento
    
    const navegaTela= async (id)=>{
        if (estabelecimentos !== null && estabelecimentos !== undefined){
            const local = await estabelecimentos.filter(estabelecimento=>estabelecimento.id === id); 
            navigation.navigate('EstabelecimentoComponent', {local:local}) 
        }
    }

    // Função para carregar fontes personalizadas
    const fetchFonts = () => {
        return Font.loadAsync({
          'CircularSpotifyText-Bold': require('../../assets/fonts/CircularSpotifyText-Bold.otf'),
          'CircularSpotifyText-Light': require('../../assets/fonts/CircularSpotifyText-Light.otf'),
          'CircularSpotifyText-Book': require('../../assets/fonts/CircularSpotifyText-Book.otf'),
        });
    };
    useEffect(()=>{
    // Carrega as fontes
        fetchFonts(); 
    }, []); 
// Renderização de tela  
    return (
        <View style={styles.container}>
            <Header image={user.imagemPerfil} nomeColecao={nomeColecao} mudaColecao={mudaColecao} abrirPerfilMethod={abrirPerfilMethod} goToLogin={goToLogin}/>
            <View style={{ flex: 1, padding: 20 }}>
                <View
                    style={{
                        borderBottomColor: 'gray',
                        borderBottomWidth: 1,
                        width: '100%',
                    }}
                />
            </View>
            <Text style={{textAlign: 'center', fontSize:18, fontWeight: 'bold'}}>Sugestões</Text>
            <SugestoesComponent sugestoes={sugestoes} estabelecimentos={estabelecimentos} localUser={localUser} clickCard={navegaTela}/>
        </View>
    );
}
// Estilos do componente
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F5E6', // Fundo verde claro
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 15,
        marginHorizontal: 20,
        marginVertical: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    searchInput: {
        flex: 1,
        fontSize: 18,
        color: "#333",
        marginLeft: 10,
    },
    buttonBack: {
        backgroundColor: '#006400',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        marginVertical: 10,
        margin: 5,
        borderColor: 'black',
        borderWidth: 2,
        flexDirection: 'row',
    },
    buttonBackText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 5,
    },
    icon: {
        marginRight: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    chipExplorar: {
        backgroundColor: "#66CDAA", // Verde claro suave
        borderRadius: 25,
        paddingVertical: 15, // Aumentado o tamanho dos botões
        paddingHorizontal: 15,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    chipText: {
        color: '#000000',
        fontSize: 15, // Aumentado o tamanho da fonte
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textoCategoria: {
        width: '80%',
        paddingHorizontal: 40,
        paddingVertical: 17, // Aumentado o tamanho dos botões
        margin: 8,
        alignItems: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 20,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        flexDirection: 'row', 
    },
    categoriaText: {
        fontSize: 18, // Aumentado o tamanho da fonte
        color: '#333',
        marginLeft: 10,
    },
    estiloTitulo: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    estiloDescricao: {
        marginBottom: 4,
        fontSize: 16,
        color: '#666',
    },
    estiloDistancia: {
        fontFamily: "CircularSpotifyText-Light",
        fontSize: 14,
        textAlign: 'center',
        margin: 3,
        color: '#888',
    },
    estiloCard: {
        width: '85%',
        margin: 10,
        alignSelf: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
});
export default Home;