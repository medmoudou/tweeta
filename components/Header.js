import React from 'react';
import {
    StatusBar,
    View,
    Text,
    Dimensions,
    Image,
    SafeAreaView,
} from 'react-native'
const { width: W } = Dimensions.get('window')

const Header = () => {
    return (
        <SafeAreaView>
            <View>
                <StatusBar barStyle={'light-content'} backgroundColor={"#202328"} />
                <Text
                    style={{
                        top: 0,
                        fontFamily: 'KanitMedium',
                        color: "#fff",
                        fontSize: 25,
                        textAlign: "center",
                        margin: 30
                    }}>
                    Tweeta
                </Text>
            </View>

        </SafeAreaView>

    );
}


export default Header;