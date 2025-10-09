
// Importando os componentes de tela e de funções de navegação.
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './components/Conta/LoginScreen';
import RegistrationScreen from './components/Conta/RegistrationScreen';
import EstabelecimentoComponent from './components/EstabelecimentoComponent';
import EventosComponent from './components/EventosComponent';
import GuiasTuristicosComponent from './components/GuiasTuristicosComponent';
import MainComponent from './components/MainComponent';
import Mapa from './components/Mapa';
import PerfilComponent from './components/PerfilComponent';
import SugestoesComponent from './components/SugestoesComponent';
import CustomNavigationBar from './CustomNavigationBar';
// Instância que será usada para definir as rotas do app;
const Stack=createNativeStackNavigator();
// Função de navegação do app;
export default function MyNavigation(){
    return (
            <Stack.Navigator
// Definindo tela inicial de navegação
                initialRouteName="MainComponent"
                screenOptions={{
// Faz com que o CustomNavigationBar seja utilizado, dando a opção de cabeçalho de navegação.
                header: (props) => <CustomNavigationBar {...props} />,
                }}  
            >
                 {/* Definição das telas */}
                <Stack.Screen name='Login' options={{headerShown:true, headerTitle: 'Login'}} component={LoginScreen} />
                <Stack.Screen name='MainComponent' options={{headerShown:false}} component={MainComponent}/>
                <Stack.Screen name='EstabelecimentoComponent' options={{headerShown:true, headerTitle:'Estabelecimento'}} component={EstabelecimentoComponent}/>
                <Stack.Screen name='Mapa' options={{headerShown:true, headerTitle:'Mapa'}} component={Mapa}/>
                <Stack.Screen name='EventosComponent' options={{headerShown:true, headerTitle:'Eventos'}} component={EventosComponent}/>
                <Stack.Screen name='Registration' options={{headerShown:true, headerTitle: 'Registro de usuário'}} component={RegistrationScreen} />
                <Stack.Screen name='Perfil' options={{headerShown:true, headerTitle: 'Perfil'}} component={PerfilComponent} />
                <Stack.Screen name='Sugestoes' options={{headerShown:true, headerTitle: 'Sugestoes'}} component={SugestoesComponent} />
                <Stack.Screen name='GuiasTuristicos' options={{headerShown:true, headerTitle: 'GuiasTuristicos'}} component={GuiasTuristicosComponent}/>
            </Stack.Navigator>
    )
}