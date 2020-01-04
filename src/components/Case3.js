import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    Button,
    Image,
    StyleSheet,
    Alert,
    KeyboardAvoidingView
} from "react-native";

import { Actions } from "react-native-router-flux";
import * as firebase from "firebase";
import { useSelector, useDispatch } from "react-redux";
import fb from "../routes/ConfigFire";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Textarea from "react-native-textarea";
import { calcWidth, calcHeight } from "../HelpFunctions";

function Case3() {
    const caso = useSelector(state => state.case);
    let currentUser = firebase
        .auth()
        .currentUser.email.toString()
        .split(".")[0];
    const infoUser = useSelector(state => state.info);
    const [webToken, setWebToken] = useState("");
    const [textArea, setTextArea] = useState("");
    useEffect(() => {
        getFBInfo();
        cameraPermissions();
    }, []);
    const getFBInfo = () => {
        firebase
            .database()
            .ref("/Users/admin@gmail")
            .on("value", snapshot => {
                setWebToken(snapshot.val().pushToken);
            });
    };
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
    const extintor = () => {
        const extint = "extintor";
        const genero = "un";
        fb.requestExt(currentUser, infoUser);
        pushWeb(extint, genero);
    };
    const confExtintor = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir un extintor?",
            [{ text: "NO" }, { text: "SÍ", onPress: extintor }],
            { cancelable: false }
        );
    };
    const confCamilla = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir una camilla?",
            [{ text: "NO" }, { text: "SÍ", onPress: camilla }],
            { cancelable: false }
        );
    };
    const confBombero = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir bomberos?",
            [{ text: "NO" }, { text: "SÍ", onPress: bombero }],
            { cancelable: false }
        );
    };
    const confPolicia = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir a la policía?",
            [{ text: "NO" }, { text: "SÍ", onPress: policia }],
            { cancelable: false }
        );
    };
    const confApoyo = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir apoyo de otros brigadistas?",
            [{ text: "NO" }, { text: "SÍ", onPress: apoyo }],
            { cancelable: false }
        );
    };
    const confAmbulancia = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir una ambulancia?",
            [{ text: "NO" }, { text: "SÍ", onPress: ambulancia }],
            { cancelable: false }
        );
    };
    const ambulancia = () => {
        const genero = "una";
        const ambu = "ambulancia";
        fb.requestAmb(currentUser, infoUser);
        pushWeb(ambu, genero);
    };
    const apoyo = () => {
        const genero = "un";
        const apo = "apoyo";
        fb.requestApoyo(currentUser, infoUser);
        pushWeb(apo, genero);
    };
    const policia = () => {
        const genero = "un";
        const poli = "policía";
        fb.requestPol(currentUser, infoUser);
        pushWeb(poli, genero);
    };
    const bombero = () => {
        const genero = "un";
        const bomb = "bombero";
        fb.requestBom(currentUser, infoUser);
        pushWeb(bomb, genero);
    };
    const camilla = () => {
        const genero = "una";
        const camill = "camilla";
        fb.requestCam(currentUser, infoUser);
        pushWeb(camill, genero);
    };
    const pushWeb = (objeto, genero) => {
        fb.sendWebNotification(webToken, infoUser, genero, objeto);
    };

    const handleText = val => {
        fb.updateAdditionalInfo(val, currentUser, infoUser);
        setTextArea(val);
    };
    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: "white",
                justifyContent: "flex-end"
            }}
            behavior="padding"
            enabled
        >
            <Text
                style={{
                    textAlign: "center",
                    paddingTop: 20,
                    fontWeight: "bold"
                }}
            >
                Fotos del Caso
            </Text>
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
            <Text style={styles.text}>Apoyos Disponibles</Text>
            <View style={{ ...styles.photoContainer }}>
                <TouchableOpacity onPress={confPolicia}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/police.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={confAmbulancia}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/ambulance.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={confCamilla}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/camilla.png")}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.photoContainer}>
                <TouchableOpacity onPress={confExtintor}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/extintor.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={confApoyo}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/apoyo.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={confBombero}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/bombero.png")}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.text}>Descripción Adicional</Text>
            <Textarea
                containerStyle={styles.textareaContainer}
                style={styles.textarea}
                onChangeText={val => handleText(val)}
                defaultValue={caso.descBrigadista}
                maxLength={1000}
                placeholder={""}
                placeholderTextColor={"#c7c7c7"}
                underlineColorAndroid={"transparent"}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    photoContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: 10
    },
    text: {
        textAlign: "center",
        fontWeight: "bold",
        paddingTop: 20,
        paddingBottom: 10
    },
    image: {
        width: 70,
        height: 70,
        borderWidth: 3,
        borderColor: "black"
    },
    textareaContainer: {
        height: calcHeight(30),
        padding: calcHeight(1),
        width: calcWidth(95),
        marginLeft: calcWidth(2.5),
        borderRadius: 10,
        backgroundColor: "#F5FCFF"
    },
    textarea: {
        textAlignVertical: "top",
        height: 170,
        fontSize: 14,
        color: "#333"
    }
});

export default Case3;
