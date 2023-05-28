import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import Result from './screens/Result';
import { useFonts } from 'expo-font';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();

function App() {
  const [fontsLoaded] = useFonts({
    'KanitLight': require('./assets/fonts/KanitLight.ttf'),
  });

  if (fontsLoaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{
            title: 'Tweeta', headerStyle: {
              backgroundColor: '#202328',
            },
            headerTintColor: '#fff',
          }} />
          <Stack.Screen name="Result" component={Result} options={{
            title: 'Tweeta', headerStyle: {
              backgroundColor: '#202328',
            },
            headerTintColor: '#fff'
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;