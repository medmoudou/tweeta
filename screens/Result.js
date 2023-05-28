import React, { useEffect, useRef, useState } from 'react';
import { Switch, Button } from 'react-native-paper';
import {
    ActivityIndicator, Dimensions, SafeAreaView, Image, ScrollView, StyleSheet, Text, useColorScheme, View,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import { captureRef } from "react-native-view-shot";
import { LinearGradient } from 'expo-linear-gradient';
import twitterLogo from '../assets/twitter.webp';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { cacheDirectory, downloadAsync } from "expo-file-system";
import { Share } from "react-native";
import * as Sharing from "expo-sharing";

function Result({ route, navigation }) {

    const viewRef = useRef();
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <MaterialCommunityIcons name="download" color={'#fff'} size={30} onPress={() => {
                    sharePic()
                }} />
            )
        });
    });

    const sharePic = async () => {



        try {

            captureRef(viewRef, {
                format: "png",
                quality: 0.8,
            }).then(
                async (uri) => {
                    const result = await Share.share({url: uri});

                    if (result.action === Share.sharedAction) {
                        // Always work with android
                        if (result.activityType) {
                            // worked
                        } else {
                            // shared
                        }
                    } else if (result.action === Share.dismissedAction) {
                        // run only for ios if share is dismissed
                    }
                },
                (error) => console.error("Oops, snapshot failed", error)
            );
        } catch (error) {
            console.log(error);
        }

        // captureRef(viewRef, {
        //     format: "jpg",
        //     quality: 0.8,
        // }).then(
        //     (uri) => {
        //         Sharing.shareAsync(Image.resolveAssetSource(uri))

        //         console.log("Image saved to", uri)
        //     },
        //     (error) => console.error("Oops, snapshot failed", error)
        // );

        // try {
        //     const uri = await captureRef(viewRef, {
        //         format: 'png',
        //         quality: 1.0
        //     })
        //     await Sharing.shareAsync(uri)
        // } catch (error) {
        //     console.log(error)
        // }

    }

    const [text, setText] = React.useState("");
    const { url } = route.params;
    const [isLoading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [tweetData, setTweetData] = useState([]);
    const [bgColor, setBgColor] = useState(['#000', '#000', '#000']);
    const [tweetMetrics, setTweetMetrics] = useState([]);
    const [tweetMedia, setTweetMedia] = useState(null);
    const [displayPic, setDisplayPicOn] = useState(true);
    const [displayCount, setDisplayCountOn] = useState(true);

    const onTogglePicSwitch = () => setDisplayPicOn(!displayPic);
    const onToggleCountSwitch = () => setDisplayCountOn(!displayCount);

    const getTweeta = async () => {
        try {
            const response = await fetch('https://twimage.vercel.app/api/tweet/' + url.split('/')[5]);
            const json = await response.json();
            setUserData(json.data.includes.users[0]);
            setTweetData(json.data.data);
            if (json.data.includes.media) setTweetMedia(json.data.includes.media[0].url);
            setTweetMetrics(json.data.data.public_metrics);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTweeta();
    }, []);

    return (
        <SafeAreaView style={{ backgroundColor: "#202328", height: "100%" }}>
            <ScrollView style={styles.scrollView}>
                <LinearGradient ref={viewRef} start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} colors={bgColor} style={{ borderRadius: 10, marginTop: 20, marginHorizontal: 10 }}>
                    <View style={{ backgroundColor: '#000000af', marginVertical: 30, marginHorizontal: 20, borderRadius: 20, padding: 20 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={styles.row}>
                                <Image style={styles.image} source={{ uri: userData.profile_image_url, }} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={[styles.text, { fontSize: 14, fontWeight: '800' }]}>{userData.name}</Text>
                                    <Text style={[styles.text, { fontSize: 12 }]}>@{userData.username}</Text>
                                </View>
                            </View>
                            <Image style={{ width: 25, height: 25 }} resizeMode={'contain'} source={{ uri: Image.resolveAssetSource(twitterLogo).uri }} />
                        </View>
                        <View style={{ paddingVertical: 20 }}>
                            <Text style={[styles.text, { fontSize: 18 }]}>{tweetData.text ? tweetData.text.replace(/(https):\/\/([t.co]*)([\w\/]*)/g, '') : ''}</Text>
                            {tweetMedia != null && displayPic ?
                                <Image resizeMode={'contain'}
                                    style={{
                                        width: '100%',
                                        height: undefined,
                                        aspectRatio: 1,
                                        marginTop: 10
                                    }} source={{ uri: tweetMedia }} />
                                : ''}
                        </View>
                        <Text style={[styles.text, { fontSize: 13, color: '#888888' }]}>{moment(tweetData.created_at).format('hh:mm · MMM D, YYYY')} ··· {tweetData.source}</Text>
                        {displayCount ?
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <MaterialCommunityIcons name="heart-outline" color={'#e84344'} size={30} />
                                <Text style={[styles.text, { fontSize: 16, marginHorizontal: 10 }]}>{kFormatter(tweetMetrics.like_count)}</Text>
                                <MaterialCommunityIcons style={{ marginLeft: 8 }} name="repeat-variant" color={'#10b981'} size={35} />
                                <Text style={[styles.text, { fontSize: 16, marginHorizontal: 10 }]}>{kFormatter(tweetMetrics.retweet_count)}</Text>
                            </View> : ''}
                    </View>
                </LinearGradient>
                <View style={{ margin: 20 }}>
                    <Text style={styles.text}>Background : </Text>
                    <View style={{ flexDirection: "row", alignContent: 'center', width: '100%' }}>
                        <LinearGradient onStartShouldSetResponder={() => setBgColor(['#000', '#000', '#000'])} style={{ flex: 1, height: 50, width: 50, borderRadius: 50, margin: 5 }} start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} colors={['#000', '#000', '#000']}></LinearGradient>
                        <LinearGradient onStartShouldSetResponder={() => setBgColor(['#fff', '#fff', '#fff'])} style={{ flex: 1, height: 50, width: 50, borderRadius: 50, margin: 5 }} start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} colors={['#fff', '#fff', '#fff']}></LinearGradient>
                        <LinearGradient onStartShouldSetResponder={() => setBgColor(['#face87', '#f7b9db', '#b2d1fb'])} style={{ flex: 1, height: 50, width: 50, borderRadius: 50, margin: 5 }} start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} colors={['#face87', '#f7b9db', '#b2d1fb']}></LinearGradient>
                        <LinearGradient onStartShouldSetResponder={() => setBgColor(['#fabad9', '#fce7a6', '#fdd3d0'])} style={{ flex: 1, height: 50, width: 50, borderRadius: 50, margin: 5 }} start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} colors={['#fabad9', '#fce7a6', '#fdd3d0']}></LinearGradient>
                        <LinearGradient onStartShouldSetResponder={() => setBgColor(['#92b2f3', '#82cbb4', '#e8bc84'])} style={{ flex: 1, height: 50, width: 50, borderRadius: 50, margin: 5 }} start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} colors={['#92b2f3', '#82cbb4', '#e8bc84']}></LinearGradient>
                        <LinearGradient onStartShouldSetResponder={() => setBgColor(['#fdfdff', '#b28bf4', '#b1b1f8'])} style={{ flex: 1, height: 50, width: 50, borderRadius: 50, margin: 5 }} start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }} colors={['#fdfdff', '#b28bf4', '#b1b1f8']}></LinearGradient>
                    </View>
                    <View style={[styles.row, { marginTop: 20 }]}>
                        <Switch value={displayPic} onValueChange={onTogglePicSwitch} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={[styles.text, { fontSize: 14, fontWeight: '800' }]}>Show photo</Text>
                            <Text style={[styles.text, { fontSize: 12 }]}>Show or hide the photo in the tweet</Text>
                        </View>
                    </View>
                    <View style={[styles.row, { marginTop: 20 }]}>
                        <Switch value={displayCount} onValueChange={onToggleCountSwitch} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={[styles.text, { fontSize: 14, fontWeight: '800' }]}>Show like and retweet count</Text>
                            <Text style={[styles.text, { fontSize: 12 }]}>Show or hide numbers for likes, RTs etc.</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 50
    },
    text: {
        fontFamily: 'KanitLight',
        color: '#fff'
    },

});

function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
}


export default Result;
