import React from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import { openBrowserAsync } from 'expo-web-browser';
import mainStyles from './styles/main';
import Constants from 'expo-constants';

export default function Agradecimentos({ navigation }) {
    return (
        <View style={mainStyles.container}>
            <Text style={{ marginBottom: 5 }}>Obrigado pela sua participação.</Text>
            <Button title="Voltar" onPress={() => navigation.navigate('Iniciar Sessão')} />
            <Text style={styles.desenvolvida} onPress={() => Platform.OS == 'web' ? window.open(Constants.manifest.githubUrl, '_blank') : openBrowserAsync(Constants.manifest.githubUrl)}>Aplicação desenvolvida por Rui Gonçalves</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    desenvolvida: {
        position: 'absolute',
        bottom: 5
    }
});
