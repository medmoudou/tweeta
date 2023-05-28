import React from 'react';
import { TextInput, Button } from 'react-native-paper';

import {
    SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Header from '../components/Header'


function Home({ navigation }) {
    const [text, setText] = React.useState("");

    return (
        <SafeAreaView style={{ backgroundColor: "#202328", height: "100%" }}>
            <View>
                <Text style={{
                    color: "#fff",
                    textAlign: "center",
                    fontFamily: 'KanitLight',
                    fontSize: 17,
                    marginHorizontal: 50,
                    marginVertical: 60
                }}>
                    Create perfect screenshots from your tweets, paste the tweet URL, customize your screenshot and share it wherever you want.
                </Text>
                <View style={styles.textContainer}>
                    <TextInput
                        style={{ marginStart: 50, flex: 1, backgroundColor: '#202328' }}
                        label="Paste tweet URL"
                        contentStyle={{ backgroundColor: '#fff', borderRadius: 15 }}
                        underlineStyle={{ height: 0, backgroundColor: '#fff' }}
                        mode="flat"
                        value={text}
                        onChangeText={text => setText(text)}
                    />
                    <Button icon="close" style={{ marginTop: 13 }} labelStyle={{ color: '#fff' }} onPress={() => setText('')}>
                    </Button>
                </View>


                <Button
                    style={{ width: 120, marginTop: 20, alignSelf: 'center' }}
                    mode="contained"
                    color="#fff"
                    icon="link"
                    onPress={() => navigation.navigate('Result', {
                        url: text,
                    })}>
                    go
                </Button>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    textContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});

export default Home;
