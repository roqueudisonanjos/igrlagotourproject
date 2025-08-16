import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyNavigation from './src/MyNavigation';

//Essa classe fornece os recursos de temas, garante que as views da tela sejam coerentes além de exibir 
// o componente de navegação.

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={{flex:1}}>
        <MyNavigation/>
      </SafeAreaView>
    </PaperProvider>
  );
}