
// Importando os componentes de tela e de funções de navegação.
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import MainComponent from './components/MainComponent';
import EstabelecimentoComponent from './components/EstabelecimentoComponent';
import Mapa from './components/Mapa';
import EventosComponent from './components/EventosComponent';
import CustomNavigationBar from './CustomNavigationBar';
import LoginScreen from './components/Conta/LoginScreen';
import RegistrationScreen from './components/Conta/RegistrationScreen';
import PerfilComponent from './components/PerfilComponent';
import GuiasTuristicosComponent from './components/GuiasTuristicosComponent';
import SugestoesComponent from './components/SugestoesComponent';

// Instância que será usada para definir as rotas do app;
const Stack=createNativeStackNavigator();

// Função de navegação do app;
export default function MyNavigation(){
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="MainComponent"
                screenOptions={{
                header: (props) => <CustomNavigationBar {...props} />,
                }}  
            >
                 {/* Definição das telas */}
                <Stack.Screen name='Login' options={{headerShown:true, headerTitle: 'Login'}} component={LoginScreen} />
                <Stack.Screen name='MainComponent' options={{headerShown:false}} component={MainComponent}/>
                <Stack.Screen name='EstabelecimentoComponent' options={{headerShown:true, headerTitle:'Estabelecimento'}} component={EstabelecimentoComponent}/>
                <Stack.Screen name='Mapa' options={{headerShown:true, headerTitle:'Mapa'}} component={Mapa}/>
                <Stack.Screen name='EventosComponent' options={{headerShown:true, headerTitle:'Eventos'}} component={EventosComponent}/>
                <Stack.Screen name='Registration' options={{headerShown:true, headerTitle: 'Registrar'}} component={RegistrationScreen} />
                <Stack.Screen name='Perfil' options={{headerShown:true, headerTitle: 'Perfil'}} component={PerfilComponent} />
                <Stack.Screen name='Sugestoes' options={{headerShown:true, headerTitle: 'Sugestoes'}} component={SugestoesComponent} />
                <Stack.Screen name='GuiasTuristicos' options={{headerShown:true, headerTitle: 'GuiasTuristicos'}} component={GuiasTuristicosComponent}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}