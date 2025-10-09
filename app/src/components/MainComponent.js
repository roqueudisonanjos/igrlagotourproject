// Importando configuração do firebase
import app from '@/app/firebaseConfig';
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
// Importando armazenamento local do dispositivo
import AsyncStorage from "@react-native-async-storage/async-storage";
// Importando função de navegação de telas
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location'; // Captura localização do usuário
import * as React from 'react';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
// Importando classes com as demais telas do aplicativo
import EventosRoute from '../screens/EventosRoute';
import ExplorarRoute from '../screens/ExplorarRoute';
import Home from '../screens/HomeRoute';
import Roteiros from '../screens/RoteirosRoute';
import FloatingMenu from './FloatingMenu'; // Importando o FloatingMenu
// Componente de menu flutuante que controla a troca de telas
const MainComponent = ({navigation}) => {
  // Função para abrir tela de perfil
  const abrirPerfil = ()=>{
    navigation.navigate("Perfil");
  }
  // Função para ir para tela de login
  const goToLogin = ()=>{
    navigation.navigate("Login");
    console.log("C=MainComponent M=goToLogin m=Voltando para tela de Login")
  }
  // Controla a tela ativa, sendo atualizado de forma dinamica
  const [currentScreen, setCurrentScreen] = useState('Explorar'); 
  // Função para renderizar a tela com base no estado atual, podendo alternar entre as telas
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

  const DB=getFirestore(app, "(default)"); //Obtém referência ao Firestore
  const [location, setLocation] = useState(null); // Estado para armazenar a localização do usuário
  const [nomeColecao, setNomeColecao] = useState(""); // Nome da coleção Firestore
  const [categorias, setCategorias] = useState([]); // Estado para armazenar categorias
  
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [roteirosTuristicos, setRoteirosTuristicos] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);

  // const para armazenar informações do usuário e adicionar imagem padrão de perfil
  const [user, setUser] = useState({nome:'Nome', imagemPerfil:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flamengo_braz_logo.svg/640px-Flamengo_braz_logo.svg.png'});
  // Função para carregar todos os itens da coleção da cidade
  const loadAllItemsFromCollectionOfMyCity=async()=>{
    try {
      // Busca todos os documentos da coleção "nomeColecao" no Firestore
      const snapShot=await getDocs(collection(DB, nomeColecao));
      // Armazena o nome da coleção no armazenamento local
      await AsyncStorage.setItem("local", nomeColecao)
      // Criação de listas vazias para armazenar dados
      let estabelecimentosBanco=[];
      let eventosBanco =[];
      let roteirosTuristicosBanco=[]; 
      let sugestoesBanco=[]; 
      let campos = null;
      // Percorre cada documento retornando o snapshot da coleção
      snapShot.forEach((doc)=>{
          if (doc.id==="Estabelecimentos"){
            campos = doc.data();  // Campo com todos os estabelecimentos
            console.log('C=MainComponent  campos=');
            console.log(campos);
            for (const campo in campos){ // Percorrendo todos os campos e inserindo no array de estabelecimentos
              // Passando um push para o estabelecimento, pegando o id do banco de dados
              estabelecimentosBanco.push({id:campo, ...campos[campo]});  
            }
          }else if(doc.id==="Eventos"){
            // Campo com todos os eventos
            campos = doc.data();
            // Percorrendo todos os campos e inserindo no array de eventos  
            for (const campo in campos){ 
              // Passando um push para o evento, pegando o id do banco de dados
              eventosBanco.push({id:campo, ...campos[campo]});  
            }
          }else if(doc.id==="Roteiros"){
            // Campo com todos os roteiros
            campos = doc.data();  
            // Percorrendo todos os campos e inserindo no array de roteiros
            for (const campo in campos){ 
              // Passando um push para o estabelecimento, pegando o id do banco de dados
              roteirosTuristicosBanco.push({id:campo, ...campos[campo]});  
            }
          }else if(doc.id="sugestoes"){
            campos = doc.data();  // Campo com as sugestões
            setSugestoes(campos.idsEstabelecimentos)

          }
      }) 
      // Atualiza os estados
      setEstabelecimentos(estabelecimentosBanco);
      setEventos(eventosBanco);
      setRoteirosTuristicos(roteirosTuristicosBanco);

    } catch (error) {    
        console.error("C=MainComponent M=loadAllItemsFromCollectionOfMyCity e="+error);
        console.error("C=MainComponent M=loadAllItemsFromCollectionOfMyCity DB="+DB);
        console.error("C=MainComponent M=loadAllItemsFromCollectionOfMyCity app="+nomeColecao);
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

  //Função para buscar categorias no Firestore
  const funcaoCategorias = async ()=>{
      try{
        // Referência ao documento de categorias
          const snapShot=doc(DB, "categorias", "categorias"); 
          // Busca e obtém dados do documento
          const documento = await getDoc(snapShot); 
          // Extrai os dados do DocumentSnapshot como um objeto (campos e valores)
          const categorias = documento.data(); 
          // Atualiza o estado com o nome do objeto 
          setCategorias(categorias.nome) 
      }
      catch(e){
          console.error("erro ao recuperar categorias. e="+e);
      }
  }

  // Função para recuperar informações do usuário
  const getUser = async ()=>{
    try {
      // Recupera o user salvo no momento do login ou criação de conta na memória local
      const usuarioOnStorage = await AsyncStorage.getItem("user");
      // Laço para verificação e tratamento das informações do usuário na memoria local
      if (usuarioOnStorage!==null) {
        const usuario = usuarioOnStorage ? JSON.parse(usuarioOnStorage) : null;
        console.log("C=MainComponent M=getUser m=Usuário encontrado usuario=");
        console.log(usuario);
        // Atualiza o estado com os valores do usuario
        setUser(usuario);
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
    if(nomeColecao!=="" && nomeColecao!=null) {
      loadAllItemsFromCollectionOfMyCity();
    }
    else{
      getNomeColecaoFromStorage();
    }
  },[nomeColecao])
  // Estado para armazenar coordenadas do usuário
  const [localUser, setLocalUser] = useState({latitude:0, longitude:0}); 
  //useEffect que seta a localização do usuário dizendo em que municipio ele esta, isso é importante para a comunicação com o banco de dados
  useEffect(()=>{
    const getCoordinates = async()=>{
      if (location !== null && location !== undefined){
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