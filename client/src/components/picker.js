import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Picker(props) {
    // [{ opt: props.opts[0]._id, ir: 0 }]
    const [value, setValue] = React.useState(props.opts.map((opt, i) => { return { opt: opt._id, ir: i + 1 } }));
    const [opts, setOpts] = React.useState(props.opts);
    const [rerender, setRerender] = React.useState(0);

    // Commit the value when changed
    React.useEffect(() => {
        (() => props.change(value))();
    }, [value]);

    // Calculates if a button is disabled
    function isDis(i, btn) {
        return (i === 0 && btn === 0) || (i === props.opts.length - 1 && btn == 1);
    }

    // Changes the state
    function change(fi, ti) {
        let tempValues = value;
        let tempOpts = opts;

        const tempValue = tempValues[fi];
        tempValues[fi] = tempValues[ti];
        tempValues[ti] = tempValue;
        const tempValueIr = tempValues[fi].ir;
        tempValues[fi].ir = tempValues[ti].ir;
        tempValues[ti].ir = tempValueIr;
        setValue(tempValues);

        const tempOpt = tempOpts[fi];
        tempOpts[fi] = tempOpts[ti];
        tempOpts[ti] = tempOpt;
        setOpts(tempOpts);

        // Force Rerender
        setRerender(rerender + 1);
    }

    return (
        <View>
            {opts.map((opt, i) => {
                return (
                    <View key={opt._id} style={i % 2 === 0 ? [styles.container, styles.containerG] : styles.container}>
                        <Text style={styles.pickerTitle} numberOfLines={1}>Posição {i + 1}: {opt.title}</Text>
                        <View style={styles.pickerBtns}>
                            <TouchableOpacity style={isDis(i, 0) ? [styles.pickerBtnL, styles.pickerBtnD] : styles.pickerBtnL} disabled={isDis(i, 0)} onPress={() => change(i, i - 1)}>
                                <Text style={styles.pickerBtnText}>&uarr;</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={isDis(i, 1) ? [styles.pickerBtnR, styles.pickerBtnD] : styles.pickerBtnR} disabled={isDis(i, 1)} onPress={() => change(i, i + 1)}>
                                <Text style={styles.pickerBtnText}>&darr;</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
        justifyContent: 'space-between',
    },
    containerG: {
        backgroundColor: 'gainsboro'
    },
    pickerTitle: {
        marginRight: 10,
        fontSize: 20,
        color: '#000000',
        fontWeight: '700',
        width: '88%'
    },
    pickerBtns: {
        flexDirection: 'row'
    },
    pickerBtnL: {
        height: 30,
        width: 30,
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100,
        borderWidth: 2,
        borderColor: '#05738C',
        backgroundColor: '#05738C',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerBtnR: {
        height: 30,
        width: 30,
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        borderWidth: 2,
        borderColor: '#05738C',
        backgroundColor: '#05738C',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerBtnD: {
        borderColor: '#044959',
        backgroundColor: '#044959'
    },
    pickerBtnText: {
        color: 'white'
    }
});
