import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Button } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-community/async-storage';
import mainStyles from '../styles/main';
import Axios from 'axios';

// Calculate IRV Winner
// Code by Scott Sauyet
// https://stackoverflow.com/questions/64730987/instant-runoff-voting-in-javascript-with-additional-votes
// Consulted at 9 Nov 2020
const irv = (ballots) => {
    const candidates = [... new Set(ballots.flat())];
    const votes = Object.entries(ballots.reduce(
        (votes, [v]) => { votes[v] += 1; return votes },
        Object.assign(...candidates.map(c => ({ [c]: 0 })))
    ));
    const [topCand, topCount] =
        votes.reduce(([n, m], [v, c]) => c > m ? [v, c] : [n, m], ['?', -Infinity]);
    const [bottomCand, bottomCount] =
        votes.reduce(([n, m], [v, c]) => c < m ? [v, c] : [n, m], ['?', Infinity]);

    // If we want to track tie, instead of returning topCand, do this:
    //  topCount === bottomCount ? [topCand, bottomCand] : [topCand]
    // PS: the code need to chage, as the winner (if not a tie) would be irv(ballots)[0];
    return topCount > ballots.length / 2
        ? topCand
        : irv(ballots.map(ballot => ballot.filter(c => c != bottomCand)).filter(b => b.length > 0));
}

export default function Dados({ route, navigation }) {
    const { _id, name, start, over, ir } = route.params;
    const [optimizer, setOptimizer] = React.useState(null);
    const [data, setData] = React.useState([]);
    const [QRCodeURI, setQRCodeURI] = React.useState(null);
    const [code, setCode] = React.useState(null);
    const [finalData, setFinalData] = React.useState([]);

    // Get Options
    React.useEffect(() => {
        const loadOptions = async () => {
            const qrcode = await Axios({
                method: 'GET',
                url: `${Constants.manifest.extra.API}/votacao/options`,
                headers: {
                    Authorization: 'Bearer ' + await AsyncStorage.getItem('@user')
                },
                params: {
                    votacao: _id
                }
            })
                .then(data => data.data.map(option => { return { ...option, count: 0 }; }))
                .then(data => setFinalData(data))
                .catch();
        }

        loadOptions();
    }, []);

    // Get RTData
    async function getData() {
        await Axios({
            method: 'GET',
            url: `${Constants.manifest.extra.API}/votacao/rtdata`,
            headers: {
                Authorization: 'Bearer ' + await AsyncStorage.getItem('@user')
            },
            params: {
                votacao: _id,
                previous: optimizer
            }
        })
            .then(dat => {
                if (ir) {
                    if (dat.data.votos.length != 0) {
                        setOptimizer(dat.data.previous);
                        setData([...data, ...dat.data.votos]);
                    }
                } else {
                    if (dat.data.length != 0) {
                        setOptimizer(dat.data[dat.data.length - 1]._id);
                        setData([...data, ...dat.data]);
                    }
                }
            });
    }

    React.useEffect(() => { getData() }, []);
    if (!over) React.useEffect(() => {
        const interval = setInterval(getData, 5000);

        return () => clearInterval(interval);
    });

    // Start
    if (start) {
        React.useEffect(() => {
            const gtDat = async () => {
                await Axios({
                    method: 'POST',
                    url: `${Constants.manifest.extra.API}/votacao/iniciar`,
                    headers: { Authorization: 'Bearer ' + await AsyncStorage.getItem('@user') },
                    data: {
                        votacao: _id
                    }
                })
                    .then(data => setCode(data.data.code))
                    .catch();
            }

            gtDat()
        }, []);
    } else if (!over) {
        React.useEffect(() => {
            const gtDat = async () => {
                await Axios({
                    method: 'GET',
                    url: `${Constants.manifest.extra.API}/votacao/mais`,
                    headers: { Authorization: 'Bearer ' + await AsyncStorage.getItem('@user') },
                    params: {
                        votacao: _id
                    }
                })
                    .then(data => setCode(data.data.code))
                    .catch();
            }

            gtDat()
        }, []);
    }

    // Over
    async function stop() {
        await Axios({
            method: 'DELETE',
            url: `${Constants.manifest.extra.API}/votacao/terminar`,
            headers: { Authorization: 'Bearer ' + await AsyncStorage.getItem('@user') },
            data: {
                votacao: _id
            }
        });

        navigation.navigate('Editar Votação', { _id: _id, name: name });
    }

    // QRCode
    async function loadQRCode() {
        if (!code) return;

        try {
            const qrcode = await Axios({
                method: 'GET',
                url: `${Constants.manifest.extra.API}/votacao/qrcode`,
                headers: {
                    Authorization: 'Bearer ' + await AsyncStorage.getItem('@user')
                },
                params: {
                    code: code
                }
            });

            setQRCodeURI(qrcode.data);
        } catch {
            return;
        }
    }
    if (!over) React.useEffect(() => { loadQRCode() }, [code]);

    // Data Processing
    React.useEffect(() => {
        let final = [...finalData];
        final.map((dt, i) => { final[i] = { ...dt, count: 0 } });

        if (ir) {
            if (data.length === 0) return;
            const winner = irv(data);

            finalData.find((obj, i) => {
                if (obj._id == winner)
                    final[i].count++;
            });
        } else {
            data.map(voto => {
                finalData.find((obj, i) => {
                    if (obj._id == voto.option)
                        final[i].count++;
                });
            });
        }

        setFinalData(final);
    }, [data]);

    // Get Winner
    function winner() {
        if (finalData[0] == undefined) return;
        if (data.length == 0) return;

        let arr = finalData.map(data => data.count);

        // Votos Nulos/Brancos
        if (!ir) {
            const votoNulo = finalData.findIndex(data => data.title == 'Voto Nulo');
            if (votoNulo !== -1) arr[votoNulo] = 0;
            const votoBranco = finalData.findIndex(data => data.title == 'Voto em Branco');
            if (votoBranco !== -1) arr[votoBranco] = 0;
        }

        const max = Math.max.apply(null, arr);

        if (max == 0) return;
        if (arr.filter(v => v === max).length !== 1) return `Empate (${max} ponto(s))`;
        return finalData[arr.indexOf(max)].title;
    }

    return (
        <View style={mainStyles.container}>
            <View style={[mainStyles.bar, mainStyles.barRow, { position: 'fixed', backgroundColor: 'rgb(242, 242, 242)' }]}>
                <TouchableOpacity onPress={() => navigation.navigate('Editar Votação', { _id })}>
                    <Text style={styles.barBtns}>&lt;</Text>
                </TouchableOpacity>
                <View style={styles.barTitle}>
                    <Text numberOfLines={1} style={{ fontSize: 30 }}>{name}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, marginTop: 70, justifyContent: 'center' }}>
                {!over && (
                    <View>
                        <Text style={{ fontSize: 20, textAlign: 'center', paddingTop: 40, backgroundColor: 'white' }}>Código: {code}</Text>
                        <Image style={{ width: 300, height: 300 }} source={QRCodeURI} />
                    </View>
                )}
                <View style={{ maxHeight: 366.4, width: 300, padding: 10, backgroundColor: 'white' }}>
                    <Text style={{ fontSize: 20 }}>Estatísticas:</Text>
                    <Text style={{ fontSize: 18 }}>Opção Vencedora: {winner()}</Text>
                    <ScrollView style={{ marginBottom: 10, height: 'auto' }}>
                        {!ir && finalData.map(data => {
                            return (
                                <Text key={data._id}>Opção: {data.title}, Quantidade de Votos: {data.count}</Text>
                            );
                        })}
                    </ScrollView>
                    <Text style={{ fontSize: 18 }}>Total de Votos: {data.length}</Text>
                    {!over && (
                        <Button title="Terminar Votação" onPress={stop} />
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    barTitle: {
        maxWidth: '80%',
        flexDirection: 'row',
        margin: 'auto'
    },
    barBtns: {
        fontSize: 35
    }
});
