import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import RadioButton from './components/radioButton';
import Picker from './components/picker';
import Axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-community/async-storage';
import mainStyles from './styles/main';

export default function Votar({ route, navigation }) {
    const { _id, name, internal, ir, options } = route.params;
    const [value, setValue] = React.useState([]);

    // Commit the vote to the server
    async function votar() {
        let header = null;
        if (internal) header = { Authorization: 'Bearer ' + await AsyncStorage.getItem('@user') }

        await Axios({
            method: 'POST',
            url: `${Constants.manifest.extra.API}/votacao/votar`,
            headers: header,
            data: {
                votacao: _id,
                voto: value
            }
        }).catch(err => console.log(err));

        navigation.navigate('Agradecimentos')
    }

    return (
        <View style={mainStyles.container} emulateUnlessSupported={true}>
            <View style={mainStyles.bar}>
                <Text numberOfLines={1} style={mainStyles.barTitle}>{name}</Text>
            </View>
            <ScrollView style={styles.scroll}>
                {ir ? (
                    <Picker opts={options} change={value => setValue(value)} />
                ) : (
                        <RadioButton opts={options} change={value => setValue(value)} />
                    )
                }
            </ScrollView>
            <View style={styles.votar}>
                <Button title="Votar" onPress={votar} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    scroll: {
        position: 'absolute',
        top: 50,
        bottom: 34,
        width: '100%'
    },
    votar: {
        width: '100%',
        position: 'absolute',
        bottom: 0
    }
});
