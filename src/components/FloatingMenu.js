// FloatingMenu.js
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function FloatingMenu({ currentScreen, setCurrentScreen }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setCurrentScreen('Home')}
      >
        <Ionicons
          name={currentScreen === 'Home' ? 'home' : 'home-outline'}
          size={32}
          color={currentScreen === 'Home' ? 'white' : 'black'}
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setCurrentScreen('Explorar')}
      >
        <Ionicons
          name={currentScreen === 'Explorar' ? 'compass' : 'compass-outline'}
          size={32}
          color={currentScreen === 'Explorar' ? 'white' : 'black'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={()=>setCurrentScreen('Roteiros')}
      >
        <MaterialCommunityIcons 
          name={ currentScreen === "Roteiros" ? "bag-suitcase" : "bag-suitcase-outline"}
          size={35}
          color={currentScreen === 'Roteiros' ? 'white' : 'black'}
        />

      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setCurrentScreen('Eventos')}
      >
        <Ionicons
          name={currentScreen === 'Eventos' ? 'calendar' : 'calendar-outline'} // Novo ícone para eventos
          size={30}
          color={currentScreen === 'Eventos' ? 'white' : 'black'}
        />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#66CDAA',
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  menuText: {
    color: 'black', // Cor do texto
    fontSize: 12, // Tamanho da fonte
    marginTop: 4, // Espaçamento entre o ícone e o texto
  },
});
