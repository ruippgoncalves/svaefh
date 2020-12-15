import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-community/async-storage';
import mainStyles from '../styles/main';
import Axios from 'axios';

export default function Gestao({ navigation }) {
    const [votacoes, setVotacoes] = React.useState([]);

    // Fetch votacoes
    async function getData() {
        Axios({
            method: 'GET',
            url: `${Constants.manifest.extra.API}/votacao/obter`,
            headers: { Authorization: 'Bearer ' + await AsyncStorage.getItem('@user') }
        })
            .then(data => setVotacoes(data.data));
    }
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getData();
        });

        getData();
        return unsubscribe;
    }, [navigation]);

    // Add votação
    async function addVotacao() {
        await Axios({
            method: 'POST',
            url: `${Constants.manifest.extra.API}/votacao/novo`,
            headers: { Authorization: 'Bearer ' + await AsyncStorage.getItem('@user') }
        })
            .then(data => navigation.navigate('Editar Votação', data.data));
    }

    // Get Data
    function procData(dt) {
        let data = new Date(dt).toISOString();

        return data.replace(/T/, ', ').replace(/\..+/, '');
    }

    return (
        <View style={mainStyles.container}>
            <View style={[mainStyles.bar, mainStyles.barRow]}>
                <TouchableOpacity onPress={() => navigation.navigate('Iniciar Sessão')}><Text style={styles.barBtns}>&lt;</Text></TouchableOpacity>
                <Text numberOfLines={1} style={styles.barTitle}>Gerir de Votações</Text>
                <TouchableOpacity onPress={addVotacao}><Text style={styles.barBtns}>+</Text></TouchableOpacity>
            </View>
            <ScrollView style={styles.scroll}>
                {votacoes.map((votacao, i) => {
                    return (
                        <TouchableOpacity key={votacao._id} style={i % 2 === 0 ? [styles.btn, styles.btnG] : styles.btn} onPress={() => navigation.navigate('Editar Votação', votacao)}>
                            <Text style={styles.btnTitle} numberOfLines="1">Nome: {votacao.name}, Criada a: {procData(votacao.createdAt)}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    barTitle: {
        fontSize: 30,
        maxWidth: '80%',
        margin: 'auto'
    },
    barBtns: {
        fontSize: 35
    },
    scroll: {
        position: 'absolute',
        top: 50,
        bottom: 0,
        width: '100%'
    },
    btn: {
        padding: 10,
        alignItems: 'center'
    },
    btnG: {
        backgroundColor: 'gainsboro'
    },
    btnTitle: {
        color: '#000000',
        fontWeight: '700'
    }
});
