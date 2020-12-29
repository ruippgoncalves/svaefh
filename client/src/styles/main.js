import {StyleSheet} from 'react-native';

const mainStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bar: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 50,
        alignItems: 'center',
        padding: 5,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderBottomColor: 'gainsboro',
        borderBottomWidth: 1,
        zIndex: 1
    },
    barRow: {
        flexDirection: 'row',
    },
    barTitle: {
        fontSize: 30,
        maxWidth: '80%'
    }
});

export default mainStyles;
