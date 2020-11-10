import React from 'react';
import { StyleSheet, KeyboardAvoidingView, Text, TextInput, Button, Alert, Platform, ImageBackground, Dimensions, Image, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-community/async-storage';
import WithGoogle from './components/withGoogle';
import Axios from 'axios';

export default function LogIn({ navigation }) {
    const [scan, setScan] = React.useState(false);
    const [hasPermission, setHasPermission] = React.useState(false);
    const [loginData, setLoginData] = React.useState([false, false]);
    const [dimStyle, setDymStyle] = React.useState(onChange({ window: Dimensions.get('window') }));
    const [codVotacao, setCodVotacao] = React.useState("");
    const criarVotacao = Platform.OS == 'web' && loginData[1];
    const cdVotacao = codVotacao.length == 4;

    // To render Image Properly
    function onChange({ window }) {
        if (window.width < window.height) {
            return {
                resizeMode: 'stretch',
                height: '100%',
                width: '200%',
                transform: [{ translateX: -window.width }]
            }
        } else { return { resizeMode: 'stretch' } }
    }
    Dimensions.addEventListener('change', (e) => setDymStyle(onChange(e)));

    // Erro
    function erro(msg) {
        if (Platform.OS == 'web') {
            return window.alert(msg);
        } else {
            return Alert.alert("Erro", msg);
        }
    }

    // Web and Mobile Messages
    async function votar() {
        let header = null;
        if (loginData[0]) header = { Authorization: 'Bearer ' + await AsyncStorage.getItem('@user') }

        const data = await Axios({
            method: 'GET',
            url: `${Constants.manifest.extra.API}/votacao/votacao`,
            headers: header,
            params: {
                code: codVotacao
            }
        });

        // Check if we can vote
        if (data.data.voted == true) return erro('Já votou nesta votação!');
        if (typeof (data.data.internal) == 'undefined') return erro('Votação não encontrada!');
        if (data.data.internal && !loginData[0]) return erro('Necessita de iniciar Sessão!');
        if (data.data.internal && data.data.options.length == 0) return erro('Não pode votar nesta votação!');

        setCodVotacao('');
        navigation.navigate('Votar', data.data);
    }

    // BarCode
    React.useEffect(() => {
        (async () => {
            if (Platform.OS != 'web') {
                const { status } = await BarCodeScanner.requestPermissionsAsync();
                setHasPermission(status === 'granted');
            }
        })();
    }, []);

    const handleBarcode = async () => {
        if (!hasPermission) {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            return setHasPermission(status === 'granted');
        }

        setScan(true);
    }

    const handleBarCodeScanned = ({ data }) => {
        if (typeof (data == 'string') && data.length == 4) {
            setCodVotacao(data.toUpperCase());
            setScan(false);
        }
    };

    const BarCode = () => {
        if (Platform.OS != 'web' && scan) {
            return (
                <>
                    <TouchableOpacity onPress={() => setScan(false)} style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, backgroundColor: 'white', borderRadius: 10 }}>
                        <Image source={require('../assets/ui/close.png')} />
                    </TouchableOpacity>
                    <BarCodeScanner
                        onBarCodeScanned={codVotacao ? undefined : handleBarCodeScanned}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', elevation: 25, zIndex: 1 }}
                    />
                </>
            )
        }

        return null
    }

    return (
        <ImageBackground source={require('../assets/ui/escola.png')} style={styles.container} imageStyle={dimStyle}>
            <BarCode />
            <Image style={styles.icon} source={require('../assets/icon.png')} />
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} style={styles.size}>
                <Text style={styles.text}>Sistema de Votação AEFH</Text>
                <WithGoogle loginData={data => setLoginData(data)} />
                <TextInput value={codVotacao} style={styles.input} autoFocus={true} autoCapitalize="characters" placeholder="Código da Votação" onChangeText={code => setCodVotacao(code.toUpperCase())} maxLength={4} />
                {Platform.OS != 'web' && <View style={styles.qr}><Button title={"Ler Código QR"} onPress={handleBarcode} /></View>}
                <Button disabled={!(criarVotacao || cdVotacao)} title={criarVotacao && !cdVotacao ? "Gerir Votações" : "Votar"} onPress={criarVotacao && !cdVotacao ? () => navigation.navigate('Gerir Votações') : votar} />
            </KeyboardAvoidingView>
            <Text style={styles.fotografia}>Fotografia da Autoria de Ricardo Fernandes</Text>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        height: '30%',
        width: '30%',
        maxWidth: 100,
        maxHeight: 100,
        marginBottom: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 15
    },
    size: {
        width: '80%',
        maxWidth: 300,
        padding: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#F8F8F8',
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 16.00,
        elevation: 24,
        marginBottom: 40
    },
    text: {
        textAlign: 'center',
        fontSize: 30,
        marginBottom: 10
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 5,
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center'
    },
    qr: {
        marginBottom: 10
    },
    fotografia: {
        color: 'white',
        position: 'absolute',
        bottom: 10,
        right: 10
    }
});
