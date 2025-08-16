import * as React from 'react';
import { View} from 'react-native';
import EventosRoute from '../screens/EventosRoute';
import ExplorarRoute from '../screens/ExplorarRoute';
import {useState, useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDocs, collection, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import * as Location from 'expo-location';
import FloatingMenu from './FloatingMenu'; // Importando o FloatingMenu
import Home from '../screens/HomeRoute';
import { useFocusEffect } from '@react-navigation/native';
import Roteiros from '../screens/RoteirosRoute';

const MainComponent = ({navigation}) => {

  const abrirPerfil = ()=>{
    navigation.navigate("Perfil");
  }

  const goToLogin = ()=>{
    navigation.navigate("Login");
    console.log("C=MainComponent M=goToLogin m=Voltando para tela de Login")
  }

  const [currentScreen, setCurrentScreen] = useState('Explorar'); // Controla a tela ativa

  // Função para renderizar a tela com base no estado atual
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return(
          <Home 
            sugestoes={sugestoes}
            user={user}
            localUser={localUser}
            nomeColecao={nomeColecao}
            navigation={navigation}
            mudaColecao={mudaColecao}
            abrirPerfilMethod={abrirPerfil}
            goToLogin={goToLogin}
            estabelecimentos={estabelecimentos}
          />
        );
      case 'Explorar':
        return (
          <ExplorarRoute
            categorias={categorias}
            estabelecimentos={estabelecimentos}
            localUser={localUser}
            navigation={navigation}
          />
        );
      case 'Eventos':
        return <EventosRoute eventos={eventos} localUser={localUser} />;
      case "Roteiros":
        return (
          <Roteiros 
            roteiros={roteirosTuristicos}
          />
        );
      default:
        return null;
    }
  };

  const app = initializeApp(firebaseConfig); // Initializa o Firebase
  const DB=getFirestore(app, "(default)"); //Obtém referência ao Firestore
  const [location, setLocation] = useState(null); // Estado para armazenar a localização do usuário
  const [nomeColecao, setNomeColecao] = useState(""); // Nome da coleção Firestore (dependente da localização do usuário)
  const [categorias, setCategorias] = useState([]); // Estado para armazenar categorias
  
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [roteirosTuristicos, setRoteirosTuristicos] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);

  //const para armazenar informações do usuário
  const [user, setUser] = useState({nome:'Wesley', imagemPerfil:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/640px-Flamengo_braz_logo.svg.png'});

  const loadAllItemsFromCollectionOfMyCity=async()=>{
    try {
      const snapShot=await getDocs(collection(DB, nomeColecao));
      await AsyncStorage.setItem("local", nomeColecao) // Armazena o nome da coleção no armazenamento local
      let estabelecimentosBanco=[];
      let eventosBanco =[];
      let roteirosTuristicosBanco=[]; 
      let sugestoesBanco=[]; 
      
      let campos = null;

      snapShot.forEach((doc)=>{
          if (doc.id==="Estabelecimentos"){
            campos = doc.data();  //campo com todos os estabelecimentos
            for (const campo in campos){ //percorrendo todos os campos e inserindo no array de estabelecimentos
              estabelecimentosBanco.push({id:campo, ...campos[campo]});  //passando um push para o estabelecimento, pegando o id do banco de dados
            }
          }else if(doc.id==="Eventos"){
            campos = doc.data();  //campo com todos os estabelecimentos
            for (const campo in campos){ //percorrendo todos os campos e inserindo no array de estabelecimentos
              eventosBanco.push({id:campo, ...campos[campo]});  //passando um push para o estabelecimento, pegando o id do banco de dados
            }
          }else if(doc.id==="Roteiros"){
            campos = doc.data();  //campo com todos os estabelecimentos
            for (const campo in campos){ //percorrendo todos os campos e inserindo no array de estabelecimentos
              roteirosTuristicosBanco.push({id:campo, ...campos[campo]});  //passando um push para o estabelecimento, pegando o id do banco de dados
            }
          }else if(doc.id="sugestoes"){
            campos = doc.data();  //campo com todos os estabelecimentos
            
            setSugestoes(campos.idsEstabelecimentos)

          }
      }) 

      // Atualiza os estados
      setEstabelecimentos(estabelecimentosBanco);
      setEventos(eventosBanco);
      setRoteirosTuristicos(roteirosTuristicosBanco);

    } catch (error) {    
        console.error("C=MainComponent M=loadAllItemsFromCollectionOfMyCity e="+error);
    }
  }

  //const para acessar a localização do telefone
  const funcaoLocation = async () => {
    //Solicita permissão de localização
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('A permissão para acessar a localização foi negada');
      return;
    }
    let location = await Location.getCurrentPositionAsync({}); //Obtém a localização atual
    setLocation(location); //Armazena a localização no estado
  };

  //Função assíncrona para buscar categorias no Firestore
  const funcaoCategorias = async ()=>{
      try{
          const snapShot=doc(DB, "categorias", "categorias"); //Referência ao documento de categorias
          const documento = await getDoc(snapShot); //Obtém dados do documento
          const categorias = documento.data(); //Armazena categorias no estado
          setCategorias(categorias.nome)
      }
      catch(e){
          console.error("erro ao recuperar categorias. e="+e);
      }
  }

  const getUser = async ()=>{

    try {
      // Recupera o user salvo no momento do login ou criação de conta
      const usuarioOnStorage = await AsyncStorage.getItem("user");
  
      if (usuarioOnStorage!==null) {
        const usuario = await JSON.parse(usuarioOnStorage);

        setUser(usuario);

        console.log("C=MainComponent M=getUser m=Usuário encontrado usuario=");
        console.log(usuario);

      } else {
        console.log("C=MainComponent M=getUser m=Nenhum usuário encontrado!");
      }
    } catch (error) {
      console.error("C=MainComponent M=getUser Erro ao setar usuário:", error);
    }
  }

  // useFocusEffect para parar o áudio quando sair da tela
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        getUser();
      };
    }, [])
  );

  useEffect(()=>{
    funcaoLocation(); //Executa a função de localização
    funcaoCategorias(); //Executa a função para buscar categorias
    getUser();
  }, [])

  const getNomeColecaoFromStorage = async ()=>{
    const nomeColecaoCache = await AsyncStorage.getItem("nomeColecao")
    console.log('C=MainComponent nomeColecaoCache='+nomeColecaoCache);
    setNomeColecao(nomeColecaoCache);
  }

  useEffect(()=>{
    console.log("cidade escolhida")
    console.log(nomeColecao)
    if(nomeColecao!=="") {
      loadAllItemsFromCollectionOfMyCity();
    }
    else{
      getNomeColecaoFromStorage();
    }
  },[nomeColecao])

  const [localUser, setLocalUser] = useState({latitude:0, longitude:0}); // Estado para armazenar coordenadas do usuário
  //useEffect que seta a localização do usuário dizendo em que municipio ele esta, isso é importante para a comunicação com o banco de dados
  useEffect(()=>{
    const getCoordinates = async()=>{
      if (location !== null){
        const localizacao = {latitude: location.coords.latitude, longitude: location.coords.longitude};
        setLocalUser(localizacao);
      }    
    }
    getCoordinates();
  },[location])

  const mudaColecao = async (cidade) =>{
    console.log("entrou no log aqui"+cidade);
    // Seta o nome da coleção de acordo com a cidade escolhida
    setNomeColecao(cidade);
    await AsyncStorage.setItem("nomeColecao", nomeColecao);
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Renderiza a tela ativa */}
      {renderScreen()}

      {/* O FloatingMenu é responsável por controlar a navegação */}
      <FloatingMenu currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
    </View>
  );
};
export default MainComponent;