import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function RadioButton(props) {
    const [value, setValue] = React.useState([{ opt: props.opts[0]._id }]);

    // Commit the value when changed
    React.useEffect(() => {
        (() => props.change(value))();
    }, [value]);

    return (
        <View>
            {props.opts.map((opt, i) => {
                return (
                    <TouchableOpacity key={opt._id} style={i % 2 === 0 ? [styles.container, styles.containerG] : styles.container} onPress={() => setValue([{ opt: opt._id }])}>
                        <Text style={styles.radioTitle} numberOfLines={1}>Opção {i + 1}: {opt.title}</Text>
                        <TouchableOpacity style={styles.radioCircle}>
                            {value[0].opt === opt._id && <View style={styles.selectedRb} />}
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerG: {
        backgroundColor: 'gainsboro'
    },
    radioTitle: {
        marginRight: 35,
        fontSize: 20,
        color: '#000000',
        fontWeight: '700',
        width: '88%'
    },
    radioCircle: {
        height: 30,
        width: 30,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#05738C',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedRb: {
        width: 15,
        height: 15,
        borderRadius: 50,
        backgroundColor: '#05738C'
    }
});
