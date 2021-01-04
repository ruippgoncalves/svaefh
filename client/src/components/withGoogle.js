import React from 'react';
import { StyleSheet, TouchableHighlight, View, Image, Text, Alert, Platform } from 'react-native';
import decode from './jwt';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function WithGoogle(props) {
    const [loggedIn, setLogged] = React.useState(false);

    // Erro
    function erro(msg) {
        if (Platform.OS == 'web') {
            return window.alert(msg);
        } else {
            return Alert.alert("Erro", msg);
        }
    }

    // Handles login
    async function login() {
        let data;

        try {
            data = await AuthSession.startAsync({
                authUrl: `${Constants.manifest.extra.API}/auth/google${Platform.OS == 'web' ? '' : '?mobile'}`,
                returnUrl: AuthSession.makeRedirectUri()
            })
        } catch {
            return erro('Não foi possivel iniciar sessão, se estiver a utilizar telemóvel ou tablet descarregue a aplicação.');
        }

        if (data.type != 'success') return;

        // To close the new window first
        setTimeout(async () => {
            if (data.params.error != undefined) {
                erro('Endereço de email inválido. Por favor inicie sessão com a sua conta de email institucional!');

                return;
            }

            await AsyncStorage.setItem('@user', data.params.user);
            setLogged(true);
            props.loginData([true, decode(data.params.user).user.criarVotacao]);
        }, 1);
    }

    // Handles logout
    async function logout() {
        Axios.delete(`${Constants.manifest.extra.API}/auth/logout`, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('@user')
            }
        })
            .then(async () => await AsyncStorage.removeItem('@user'))
            .then(() => setLogged(false))
            .then(() => props.loginData([false, false]))
            .catch();
    }

    // Check Login
    React.useEffect(() => {
        (async () => {
            const temp = await AsyncStorage.getItem('@user');

            if (temp != undefined) {
                setLogged(true);
                props.loginData([true, decode(temp).user.criarVotacao]);
            } else {
                props.loginData([false, false]);
            }
        })();
    }, []);

    return (
        <TouchableHighlight onPress={loggedIn ? logout : login}>
            <View style={styles.container}>
                <View style={styles.iconWhite}>
                    <Image style={styles.icon} source={require('../../assets/ui/signInGoogle.png')} />
                </View>
                <View style={styles.textAlign}>
                    <Text style={styles.text}>{loggedIn ? 'Desconectar-se' : 'Iniciar Sessão com o Google'}</Text>
                </View>
            </View>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#4070f4',
        padding: 1,
        borderRadius: 10
    },
    iconWhite: {
        backgroundColor: 'white',
        borderTopLeftRadius: 9,
        borderBottomLeftRadius: 9
    },
    icon: {
        margin: 2,
        height: 34,
        width: 34,
        resizeMode: 'stretch'
    },
    textAlign: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white'
    }
});
