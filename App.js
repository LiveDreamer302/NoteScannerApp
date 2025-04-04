import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import { NotesProvider } from './context/NotesContext';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NotesProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home">
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Camera" component={CameraScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </NotesProvider>
    );
}
