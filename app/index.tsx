import { LogBox } from "react-native";
import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyNavigation from './src/MyNavigation';
LogBox.ignoreAllLogs(true); 


export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={{flex:1}}>
          <MyNavigation/>
      </SafeAreaView>
    </PaperProvider>
  );
}