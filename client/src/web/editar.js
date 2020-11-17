import React from 'react';
import { View, Text, TextInput, Switch, ScrollView, TouchableOpacity, Button, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-community/async-storage';
import mainStyles from '../styles/main';
import Axios from 'axios';

export default function Gestao({ route, navigation }) {
    const { _id, name } = route.params;
    const [votacao, setVotacao] = React.useState({ name: '', options: [] });
    const [editName, setEditName] = React.useState(false);
    const [focus, setFocus] = React.useState('none');

    // Erro
    function erro(msg) {
        if (Platform.OS == 'web') {
            return window.alert(msg);
        } else {
            return Alert.alert("Erro", msg);
        }
    }

    // Get More Data
    React.useEffect(() => {
        const getData = async () => {
            await Axios({
                method: 'GET',
                url: `${Constants.manifest.extra.API}/votacao/mais`,
                headers: { Authorization: 'Bearer ' + await AsyncStorage.getItem('@user') },
                params: {
                    votacao: _id
                }
            })
                .then(data => data.data)
                .then(data => { return { ...data, name: name } })
                .then(data => setVotacao(data));
        }

        const unsubscribe = navigation.addListener('focus', () => {
            getData();
        });

        getData();
        return unsubscribe;
    }, [navigation]);

    // Sync Data
    const isFirst = React.useRef(true);
    React.useEffect(() => {
        // Prevent Sending a request when data is loaded for the first time
        if (isFirst.current) {
            isFirst.current = false || votacao.ir === undefined;
            return;
        }

        const timeout = setTimeout(async () => {
            if (votacao.over || votacao.running) return;

            // Prevent Sending Invalid Emails
            let send = false;
            votacao.allow.map(email => { send = send || email.indexOf('@') === -1 });
            if (send) {
                erro('Endereço de email inválido, as definições da votação não serão sincronizados até o email estar correto!');
                return;
            }

            Axios({
                method: 'PATCH',
                url: `${Constants.manifest.extra.API}/votacao/alterar`,
                headers: { Authorization: 'Bearer ' + await AsyncStorage.getItem('@user') },
                data: {
                    votacao: _id,
                    update: votacao
                }
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [votacao]);

    // Add/Change Option
    function acOpt(i, text) {
        let state = { ...votacao };
        if (!text) { state.options.splice(i, 1) }
        else state.options[i] = text;

        setVotacao(state);
        setFocus('none');
    }

    // Add/Change Allow
    function acAllow(i, text) {
        if (text.indexOf(';') > -1) {
            // Remove Spaces
            text = text.replace(/\s/g, '');

            const emails = text.split(';');
            const state = { ...votacao };
            state.allow = state.allow.concat(emails);

            setVotacao(state);
            setFocus('none');
            return;
        }

        let state = { ...votacao };
        if (!text) { state.allow.splice(i, 1) }
        else state.allow[i] = text;

        setVotacao(state);
        setFocus('none');
    }

    // Add Branco/Nulo
    function addBN() {
        let state = {...votacao};

        state.options[state.options.length] = 'Voto Nulo';
        state.options[state.options.length] = 'Voto em Branco';

        setVotacao(state);
    }

    return (
        <View style={mainStyles.container}>
            <View style={[mainStyles.bar, mainStyles.barRow]}>
                <TouchableOpacity onPress={() => navigation.navigate('Gerir Votações')}><Text style={styles.barBtns}>&lt;</Text></TouchableOpacity>
                <View style={styles.barTitle}>
                    {!editName ? (
                        <Text numberOfLines={1} style={{ fontSize: 30 }}>
                            {votacao.name}
                        </Text>
                    ) : (
                            <TextInput autoFocus={true} numberOfLines={1} style={{ fontSize: 30 }} value={votacao.name} placeholder="Nome da Votação" onChangeText={text => setVotacao({ ...votacao, name: text })} />
                        )}
                    {!votacao.running && (
                        <TouchableOpacity onPress={() => setEditName(!editName)} >
                            <Text style={{ fontSize: 30 }}>{!editName ? (<>&#9998;</>) : (<>&#10003;</>)}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={{ maxHeight: '80%', maxWidth: '95%' }}>
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ marginRight: 10, fontWeight: 'bold' }}>Interno:</Text>
                        <Switch value={votacao.internal} onValueChange={() => setVotacao({ ...votacao, internal: !votacao.internal, allow: [] })} disabled={votacao.running} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold' }}>Tipo: </Text><Text style={{ marginRight: 10 }}>Escolha Múltipla (PV)</Text>
                        <Switch value={votacao.ir} onValueChange={() => setVotacao({ ...votacao, ir: !votacao.ir })} disabled={votacao.running} />
                        <Text style={{ marginLeft: 10 }}>Escolha Classificada (IRV)</Text>
                    </View>
                </View>
                <ScrollView style={{ backgroundColor: 'white', padding: 10, marginBottom: 10, marginTop: 10 }}>
                    <Text style={{ fontWeight: 'bold' }}>Opções:</Text>
                    {votacao.options.map((option, i) => (
                        <TextInput key={i} value={option} onChangeText={text => acOpt(i, text)} autoFocus={i === votacao.options.length - 1 && focus === 'option'} editable={!votacao.running} maxLength={50} />
                    ))}
                    {!votacao.running && (
                        <TextInput key={votacao.options.length} placeholder={"Nova Opção"} onChangeText={text => { acOpt(votacao.options.length, text); setFocus('option'); }} />
                    )}
                    {!votacao.running && !votacao.ir && (votacao.options.indexOf('Voto Nulo') === -1 || votacao.options.indexOf('Voto em Branco') === -1) && (
                        <View style={{width: '100%'}}>
                            <Button title="Adicionar Votos Brancos/Nulos" onPress={addBN} />
                        </View>
                    )}
                </ScrollView>
                {(votacao.internal && !(votacao.running && votacao.allow.length == 0)) && (
                    <ScrollView style={{ backgroundColor: 'white', padding: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Emails Permitidos (Deixe em braco para permitir todos):</Text>
                        {votacao.allow.map((option, i) => (
                            <TextInput key={i} value={option} onChangeText={text => acAllow(i, text)} autoFocus={i === votacao.allow.length - 1 && focus === 'allow'} editable={!votacao.running} />
                        ))}
                        {!votacao.running && (
                            <TextInput key={votacao.allow.length} placeholder={"Novo Email"} onChangeText={text => { acAllow(votacao.allow.length, text); setFocus('allow'); }} />
                        )}
                    </ScrollView>
                )}
            </View>
            <View style={styles.startOrResults}>
                <Button title={votacao.running ? "Ver Resultados" : "Iniciar"} onPress={() => {if (votacao.options.length !== 0) navigation.navigate('Dados da Votação', { _id: _id, name: votacao.name, start: !votacao.running, over: votacao.running && ! votacao.code, ir: votacao.ir })}} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    barTitle: {
        maxWidth: '80%',
        flexDirection: 'row',
        margin: 'auto'
    },
    barBtns: {
        fontSize: 35
    },
    startOrResults: {
        width: '100%',
        position: 'absolute',
        bottom: 0
    }
});
