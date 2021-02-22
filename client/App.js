import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const LogIn = React.lazy(() => import('./src/login'));
const Votar = React.lazy(() => import('./src/votar'));
const Agradecimentos = React.lazy(() => import('./src/agradecimentos'));

const Gestao = React.lazy(() => import('./src/gestao'));
const Editar = React.lazy(() => import('./src/editar'));
const Dados = React.lazy(() => import('./src/dados'));

const Stack = createStackNavigator();

export default function App() {
    return (
        <React.Suspense fallback={<View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#05738C',
            width: '100%',
            height: '100%'
        }}>
            <Text style={{ fontSize: 60 }}>A Carregar...</Text>
        </View>}>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#05738C' }} />

            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Iniciar Sessão" component={LogIn} />
                    <Stack.Screen name="Votar" component={Votar} />
                    <Stack.Screen name="Agradecimentos" component={Agradecimentos} />
                    <Stack.Screen name="Gerir Votações" component={Gestao} />
                    <Stack.Screen name="Editar Votação" component={Editar} />
                    <Stack.Screen name="Dados da Votação" component={Dados} />
                </Stack.Navigator>
            </NavigationContainer>

            <SafeAreaView style={{ flex: 0, backgroundColor: '#05738C' }} />
        </React.Suspense>
    );
}
