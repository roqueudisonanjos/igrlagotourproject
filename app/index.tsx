import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyNavigation from './src/MyNavigation';


export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={{flex:1}}>
          <MyNavigation/>
      </SafeAreaView>
    </PaperProvider>
  );
}