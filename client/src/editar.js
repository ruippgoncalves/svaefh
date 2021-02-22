import React from 'react';
import { View, Text, TextInput, Switch, ScrollView, TouchableOpacity, Button, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-community/async-storage';
import mainStyles from './styles/main';
import Axios from 'axios';

export default function Gestao({ route, navigation }) {
    const { _id } = route.params;
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
    async function getData() {
        await Axios({
            method: 'GET',
            url: `${Constants.manifest.extra.API}/votacao/mais`,
            headers: { Authorization: 'Bearer ' + await AsyncStorage.getItem('@user') },
            params: {
                votacao: _id
            }
        })
            .then(data => data.data)
            .then(data => { if (data.name == 'Votação' && !data.running) setEditName(true); return data; })
            .then(data => setVotacao(data));
    }
    React.useEffect(() => {
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

            // Prevent No Name
            if (votacao.name.length < 1) {
                erro('Nome inválido, as definições da votação não serão sincronizados até o nome estar correto!');
                return;
            }

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
        }, 2000);

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
        // Remove Spaces
        text = text.replace(/\s/g, '');

        if (text.indexOf(';') > -1) {
            const emails = text.split(';');
            const state = { ...votacao };
            state.allow = state.allow.concat(emails);

            setVotacao(state);
            setFocus('none');
            return;
        }

        if (text.indexOf(',') > -1) {
            const emails = text.split(',');
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

    // Add Branco
    function addBN() {
        let state = { ...votacao };

        state.options[state.options.length] = 'Voto em Branco';

        setVotacao(state);
    }

    // Delete Votacao
    async function deleteVotacao() {
        await Axios({
            method: 'DELETE',
            url: `${Constants.manifest.extra.API}/votacao/apagar`,
            headers: { Authorization: 'Bearer ' + await AsyncStorage.getItem('@user') },
            data: {
                votacao: _id
            }
        })
            .then(() => navigation.navigate('Gerir Votações'));
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
                            <TextInput autoFocus={true} numberOfLines={1} style={{ fontSize: 30, width: 'auto', maxWidth: '90%' }} value={votacao.name} placeholder="Nome da Votação" onChangeText={text => setVotacao({ ...votacao, name: text })} maxLength="50" />
                        )}
                    {!votacao.running && (
                        <TouchableOpacity onPress={() => setEditName(!editName)} >
                            <Text style={{ fontSize: 30 }}>{!editName ? (<>&#9998;</>) : (<>&#10003;</>)}</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={() => deleteVotacao()}><Text style={styles.barBtns}>&#128465;</Text></TouchableOpacity>
            </View>
            <View style={{ maxHeight: '80%', maxWidth: '95%' }}>
                <View>
                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={{ marginRight: 10, fontWeight: 'bold' }}>Interno:</Text>
                        <Switch value={votacao.internal} onValueChange={() => setVotacao({ ...votacao, internal: !votacao.internal, allow: [] })} disabled={votacao.running} />
                        <Text style={{ marginLeft: 10 }}>(Apenas para Alunos e Professores)</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold' }}>Tipo: </Text>
                        <Picker
                            selectedValue={votacao.ir}
                            style={{ height: 20, width: '100%' }}
                            onValueChange={(itemValue) =>
                                setVotacao({ ...votacao, ir: itemValue == 'true' })
                            }>
                            <Picker.Item label="Escolha Múltipla (PV)" value="false" />
                            <Picker.Item label="Escolha Classificada (IRV)" value="true" />
                        </Picker>
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
                    {!votacao.running && !votacao.ir && votacao.options.indexOf('Voto em Branco') === -1 && (
                        <View style={{ width: '100%', marginTop: 5 }}>
                            <Button title="Adicionar Votos Brancos" onPress={addBN} />
                        </View>
                    )}
                </ScrollView>
                {(votacao.internal && !(votacao.running && votacao.allow.length == 0)) && (
                    <ScrollView style={{ backgroundColor: 'white', padding: 10, marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>Emails Permitidos (Deixe em branco para permitir todos):</Text>
                        {votacao.allow.map((option, i) => (
                            <TextInput key={i} value={option} onChangeText={text => acAllow(i, text)} autoFocus={i === votacao.allow.length - 1 && focus === 'allow'} editable={!votacao.running} />
                        ))}
                        {!votacao.running && (
                            <TextInput key={votacao.allow.length} placeholder={"Novo Email"} onChangeText={text => { acAllow(votacao.allow.length, text); setFocus('allow'); }} />
                        )}
                    </ScrollView>
                )}
                <View style={styles.startOrResults}>
                    <Button title={votacao.running ? "Ver Resultados" : "Iniciar"} onPress={() => {
                        if (votacao.options.length !== 0) {
                            navigation.navigate('Dados da Votação', { _id: _id, name: votacao.name, start: !votacao.running, over: votacao.running && !votacao.code, ir: votacao.ir })
                        } else {
                            erro('Necessita de pelo menos uma opção!')
                        }
                    }} />
                </View>
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
        width: '100%'
    }
});
