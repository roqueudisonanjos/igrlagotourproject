//classe EstabelecimentoComponent
import app from '@/app/firebaseConfig';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { Tab, TabView } from '@rneui/themed';
import * as Font from "expo-font";
import * as Linking from 'expo-linking';
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Avatar, Button, Modal, Portal } from "react-native-paper";
import StarRating from 'react-native-star-rating-widget';
import Estabelecimento from '../classes/Estabelecimento';
import Comentarios from "./Comentarios";
import Imagens from "./Imagens";
import Videos from "./Videos";

// Componente principal que renderiza os detalhes do estabelecimento selecionado
const EstabelecimentoComponent = ({ route }) => {
    console.log(route)
    const windowDimensions = useWindowDimensions();
    // Configura o título da tela com o nome do estabelecimento
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: estabelecimento.nome,
        });
      }, [navigation]);
    // Inicializa o Firebase e conecta com o banco de dados Firestore
    const db = getFirestore(app, "(default)");
    // Estados para controle do modal de avaliação
    const [modalAvaliacaoVisible, setModalAvaliacaoVisible] = useState(false);
    const abreAvaliacao = () => setModalAvaliacaoVisible(true);
    const hideModal = () => setModalAvaliacaoVisible(false);
    // Estilos do modal
    const containerStyle = {
        backgroundColor: "#fff",
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    };
    // Função para redirecionar o usuário para a tela de mapa
    const abreMapa = (localizacao) => {
        navigation.navigate("Mapa", { localizacao: localizacao });
    }
    // Estados para fontes, aba ativa, avaliação, usuário e cidade
    const [fontesCarregadas, setFontesCarregadas] = useState(false);
    const [abaIndex, setAbaIndex] = useState(0);
    const [avaliacao, setAvaliacao] = useState(null);
    const [usuario, setUsuario] = useState({});
    const [cidade, setCidade] = useState("");
    const [espacoDisponivelTabViews, setEspacoDisponivelTabViews] = useState(0);
    // Carrega fontes personalizadas utilizadas no app
    const carregarFontes = () => {
        return Font.loadAsync({
            'CircularSpotifyText-Bold': require('../../assets/fonts/CircularSpotifyText-Bold.otf'),
            'CircularSpotifyText-Light': require('../../assets/fonts/CircularSpotifyText-Light.otf'),
            'CircularSpotifyText-Book': require('../../assets/fonts/CircularSpotifyText-Book.otf'),
        });
    };

    // Carrega configurações iniciais do app como fontes, usuário e cidade
    useEffect(() => {
        const carregarConfiguracoes = async () => {
            await carregarFontes();
            setFontesCarregadas(true);
            try {
                let dadosUsuario = await AsyncStorage.getItem("user");
                setUsuario(JSON.parse(dadosUsuario));
            } catch (e) { console.error(e); }

            try {
                let dadosCidade = await AsyncStorage.getItem("local");
                setCidade(JSON.parse(dadosCidade));
            } catch (e) { console.error(e); }
        }
        carregarConfiguracoes();
    }, []);
     // Recebe dados do estabelecimento pela rota
    const { local } = route.params;
    const newLocal = local[0];
    console.log("C=EstabelecimentoComponent userInstagram=" + newLocal.userInstagram)
    console.log("C=EstabelecimentoComponent whatsapp=" + newLocal.whatsapp)

    // Cria instância do estabelecimento com os dados recebidos por parâmetro
    const estabelecimento = new Estabelecimento(
        newLocal.nome,
        newLocal.localizacao,
        newLocal.descricao,
        newLocal.fotos,
        newLocal.videos,
        newLocal.comentarios,
        newLocal.avaliacao,
        newLocal.categoria,
        newLocal.imagemCapa,
        newLocal.userInstagram,
        newLocal.whatsapp,
        newLocal.id
    );

    // Atualiza avaliações no Firestore quando o valor da nota muda
    useEffect(() => {
        if (avaliacao) atualizarAvaliacao();
    }, [avaliacao]);

    // Função para salvar avaliação do usuário no banco de dados
    const atualizarAvaliacao = async () => {
        let avaliacaoExistente = estabelecimento.avaliacao.find(obj => obj.user === usuario.uid);

        if (avaliacaoExistente) {
            alert("Você já avaliou esse estabelecimento");
        } else {
            await estabelecimento.avaliacao.push({ user: usuario.uid, avaliacao: avaliacao });
            let idLocal = newLocal.id;
            try {
                await updateDoc(doc(db, cidade, "Estabelecimentos"), {
                    [idLocal]: estabelecimento
                });
            } catch (e) {
                console.error(e);
            }
        }
        hideModal();
    }

    if (!fontesCarregadas) return null;

    // Abre o Instagram se for possível abrir o link
    const abrirInstagram = async (username) => {
        if (username) {
            const instagramUrl = `https://instagram.com/${username}`;
            const supported = await Linking.canOpenURL(instagramUrl);
            if (supported) await Linking.openURL(instagramUrl);
            else {
                alert('Instagram não suportado!');
            }
        } else {
            alert('Este estabelecimento não tem instagram!');
        }
    };

    // Abre o WhatsApp se for possível abrir o link
    const abrirWhatsApp = async (numero) => {
        if (numero) {
            const url = `https://wa.me/${numero}`;
            const supported = await Linking.canOpenURL(url);
            if (supported) await Linking.openURL(url);
            else {
                alert('Whatsapp não suportado!');
            }
        }
        else {
            alert('Este estabelecimento não tem whatsapp!');
        }
    };
    
    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            {/* Modal de avaliação */}
            <Portal>
                <Modal visible={modalAvaliacaoVisible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <StarRating
                        rating={avaliacao}
                        onChange={setAvaliacao}
                        enableHalfStar={false}
                        starSize={40}
                        color="#00B37E"
                        starStyle={{ marginHorizontal: 5 }}
                    />
                    <Button mode="contained" style={{ marginTop: 20 }} onPress={hideModal}>Fechar</Button>
                </Modal>
            </Portal>

            {/* Cabeçalho do estabelecimento */}
            <View style={styles.informacoesEstabelecimento}>
                <View>
                    {/* Imagem de perfil/capa do estabelecimento */} 
                    <Avatar.Image size={120} style={styles.imagem} source={{ uri: estabelecimento.imagemCapa }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                        <TouchableOpacity onPress={() => abrirWhatsApp(estabelecimento.whatsapp)}>
                            {/* Botões de contato: WhatsApp e Instagram */} 
                            <FontAwesome5 name="whatsapp" size={30} color="#3EA201" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => abrirInstagram(estabelecimento.userInstagram)}>
                            <FontAwesome5 name="instagram" size={30} color="#FF54A7" />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Informações de nome, avaliação e botões principais */} 
                <View style={styles.containerText}>
                    <Text style={styles.tituloLugar}>{estabelecimento.getNome()}</Text>
                    {/* Exibe a nota média e quantidade de avaliações */}
                    <View style={styles.avaliacaoContainer}>
                        <Text style={styles.nota}>{estabelecimento.avaliacao?.length > 0 ? estabelecimento.getAvaliacao() : 0.0}</Text>
                        <FontAwesome name="star" size={20} color="#FFD700" style={{ marginHorizontal: 4 }} />
                        <Text style={styles.totalAvaliacoes}>{newLocal.avaliacao.length} avaliações</Text>
                    </View>
                    {/* Botões para abrir modal de avaliação e mapa */}
                    <View style={styles.botoesContainer}>
                        <TouchableOpacity style={styles.botaoPersonalizado} onPress={abreAvaliacao}>
                            <Text style={styles.textoBotao}>Avaliar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.botaoPersonalizado]} onPress={() => abreMapa(estabelecimento.getLocalizacao())}>
                            <Text style={styles.textoBotao}>Mapa</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Text style={styles.textoBio}>{estabelecimento.getDescricao()}</Text>
            {/* Abas de conteúdo */}
            <Tab
                value={abaIndex}
                onChange={(e) => setAbaIndex(e)}
                indicatorStyle={{ backgroundColor: '#00B37E', height: 4, borderRadius: 10 }}
                containerStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}
                style={{ backgroundColor: '#F5F5F5', elevation: 4 }}
            >
                <Tab.Item title="Fotos" titleStyle={styles.tabTitle} icon={<Entypo name="images" size={20} color="#2E2E2E" />} />
                <Tab.Item title="Vídeos" titleStyle={styles.tabTitle} icon={<MaterialIcons name="video-collection" size={20} color="#2E2E2E" />} />
                <Tab.Item title="Comentários" titleStyle={styles.tabTitle} icon={<FontAwesome5 name="comment" size={20} color="#2E2E2E" />} />
            </Tab>

            <TabView value={abaIndex} onChange={setAbaIndex} animationType="spring" >
                <TabView.Item style={{ width: windowDimensions.width, flex: 1 }}>
                    <Imagens imagens={estabelecimento.getFotos()} />
                </TabView.Item>
                <TabView.Item style={{ width: '100%', flex: 1 }}>
                    <Videos style={{ width: '100%', flex: 1, margin:5 }} videos={estabelecimento.getVideos()} />
                </TabView.Item>
                <TabView.Item style={{ width: '100%', flex: 1 }}>
                    <Comentarios comentarios={estabelecimento.getComentarios()} idEstabelecimento={estabelecimento.id} />
                </TabView.Item>
            </TabView>
        </View>
    );
};

// Estilizações dos componentes da tela
const styles = StyleSheet.create({
    informacoesEstabelecimento: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E0FFF5",
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 10,
        elevation: 2,
        marginTop: 2,
    },
    imagem: {
        marginTop: 5,
        marginLeft: 5,
        borderRadius: 80,
        borderWidth: 1,
        borderColor: "white",
    },
    containerText: {
        flex: 1,
        justifyContent: "center",
        paddingLeft: 10,
    },
    tituloLugar: {
        fontFamily: 'CircularSpotifyText-Bold',
        fontSize: 22,
        marginBottom: 6,
        textAlign: 'center',
        color: "black",
    },
    avaliacaoContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6,
    },
    nota: {
        fontSize: 18,
        fontFamily: "CircularSpotifyText-Bold",
        color: "black",
    },
    totalAvaliacoes: {
        fontSize: 14,
        fontFamily: "CircularSpotifyText-Book",
        color: "black",
        marginLeft: 8,
    },
    botoesContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    botaoPersonalizado: {
        backgroundColor: '#267c01',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 18,
        marginHorizontal: 5,
        borderWidth: 1.8,
        elevation: 2,
    },
    textoBotao: {
        fontFamily: "CircularSpotifyText-Bold",
        fontSize: 14,
        color: "white",
    },
    textoBio: {
        fontSize: 16,
        color: "#4A4A4A",
        fontFamily: "CircularSpotifyText-Book",
        textAlign: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#F2F2F2",
        borderRadius: 12,
        margin: 10,
    },
    tabTitle: {
        fontSize: 13,
        color: '#2E2E2E',
        fontFamily: 'CircularSpotifyText-Bold'
    },
});

export default EstabelecimentoComponent;
