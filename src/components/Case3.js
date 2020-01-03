import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Button,
    Image,
    StyleSheet,
    Alert
} from "react-native";

import { Actions } from "react-native-router-flux";
import * as firebase from "firebase";
import { useSelector, useDispatch } from "react-redux";
import fb from "../routes/ConfigFire";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";
import { CardSwiper } from "native-base";

function Case3() {
    const caso = useSelector(state => state.case);
    let currentUser = firebase
        .auth()
        .currentUser.email.toString()
        .split(".")[0];
    const infoUser = useSelector(state => state.info);
    useEffect(() => {
        cameraPermissions();
    }, []);
    const cameraPermissions = async () => {
        const { status } = await Permissions.askAsync(
            Permissions.CAMERA,
            Permissions.CAMERA_ROLL
        );
        if (status !== "granted") {
            Alert.alert("Necesita dar permisos de cámara");
        }
    };
    const handlePress1 = async () => {
        cameraPermissions();
        const { cancelled, uri } = await ImagePicker.launchCameraAsync({
            allowsEditing: false
        });

        if (!cancelled) {
            fb.uploadCaseImages1(uri, "image1", currentUser, infoUser);
        }
    };
    const handlePress2 = async () => {
        cameraPermissions();
        const { cancelled, uri } = await ImagePicker.launchCameraAsync({
            allowsEditing: false
        });
        if (!cancelled) {
            fb.uploadCaseImages2(uri, "image2", currentUser, infoUser);
        }
    };

    const uploadImage2 = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = firebase
            .storage()
            .ref()
            .child("caseImages/" + imageName);
        return ref.put(blob);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.photoContainer}>
                <TouchableOpacity onPress={handlePress1}>
                    <Image
                        style={{ width: 100, height: 100 }}
                        source={
                            caso.image1 === "image1"
                                ? require("../../assets/cameraicon.png")
                                : { uri: caso.image1 }
                        }
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePress2}>
                    <Image
                        style={{ width: 100, height: 100 }}
                        source={
                            caso.image2 === "image2"
                                ? require("../../assets/cameraicon.png")
                                : { uri: caso.image2 }
                        }
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    photoContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: 10
    }
});

export default Case3;
