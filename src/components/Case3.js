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
import DialogInput from "react-native-dialog-input";

import { calcWidth, calcHeight } from "../HelpFunctions";

function Case3() {
    const caso = useSelector(state => state.case);
    let currentUser = firebase
        .auth()
        .currentUser.email.toString()
        .split(".")[0];
    const infoUser = useSelector(state => state.info);
    const [webToken, setWebToken] = useState("");
    const [dialogueSeen, setDialogueSeen] = useState(false);

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
            [{ text: "NO" }, { text: "SÍ", onPress: changeDialogueSeen }],
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

    const confDEA = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir un desfibrilador?",
            [{ text: "NO" }, { text: "SÍ", onPress: DEA }],
            { cancelable: false }
        );
    };

    const confSillaRuedas = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir una silla de ruedas?",
            [{ text: "NO" }, { text: "SÍ", onPress: sillaRueda }],
            { cancelable: false }
        );
    };

    const confDefCivil = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir apoyo de la Defensa Civil?",
            [{ text: "NO" }, { text: "SÍ", onPress: defCivil }],
            { cancelable: false }
        );
    };

    const confCruzRoja = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir apoyo de la Cruz Roja?",
            [{ text: "NO" }, { text: "SÍ", onPress: cruzRoja }],
            { cancelable: false }
        );
    };

    const confBotiquin = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir un botiquín de primeros auxilios?",
            [{ text: "NO" }, { text: "SÍ", onPress: botiquin }],
            { cancelable: false }
        );
    };

    const confMantenimiento = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir apoyo de Mantenimiento?",
            [{ text: "NO" }, { text: "SÍ", onPress: mantenimiento }],
            { cancelable: false }
        );
    };

    const confCentroMedico = () => {
        Alert.alert(
            "Solicitud de Apoyo",
            "¿Está seguro que desea pedir apoyo del Centro Médico?",
            [{ text: "NO" }, { text: "SÍ", onPress: centroMedico }],
            { cancelable: false }
        );
    };

    const changeDialogueSeen = () => {
        setDialogueSeen(true);
    };
    const ambulancia = () => {
        const ambu = "ambulancia";
        fb.requestAmb(currentUser, infoUser);
        pushWeb(ambu);
    };
    const apoyo = inputText => {
        if (!isNaN(inputText)) {
            const parsedInputText = parseInt(inputText);
            if (parsedInputText > 0) {
                fb.requestApoyo(currentUser, infoUser, parsedInputText);
                const apo = "apoyo";
                pushWeb2(apo, parsedInputText);
                setDialogueSeen(false);
            } else {
                alert("Coloque un número mayor a cero.");
            }
        } else {
            alert("No ingresó un número.");
        }
    };
    const policia = () => {
        const poli = "policía";
        fb.requestPol(currentUser, infoUser);
        pushWeb(poli);
    };
    const bombero = () => {
        const bomb = "bombero";
        fb.requestBom(currentUser, infoUser);
        pushWeb(bomb);
    };
    const camilla = () => {
        const camill = "camilla";
        fb.requestCam(currentUser, infoUser);
        pushWeb(camill);
    };

    const botiquin = () => {
        const botiq = "botiquín"; // Ojo tilde
        fb.requestBotiquin(currentUser, infoUser);
        pushWeb(botiq);
    };

    const defCivil = () => {
        const defCivil = "Defensa Civil";
        fb.requestDefCivil(currentUser, infoUser);
        pushWeb(defCivil);
    };

    const cruzRoja = () => {
        const cruzRoja = "Cruz Roja";
        fb.requestCruzRoja(currentUser, infoUser);
        pushWeb(cruzRoja);
    };

    const centroMedico = () => {
        const centroMed = "Centro Médico";
        fb.requestCentroMedico(currentUser, infoUser);
        pushWeb(centroMed);
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////

    const sillaRueda = () => {
        const sillaR = "silla de ruedas";
        fb.requestSillaRuedas(currentUser, infoUser);
        pushWeb(sillaR);
    };

    const mantenimiento = () => {
        const mantenimiento = "Mantenimiento";
        fb.requestMantenimiento(currentUser, infoUser);
        pushWeb(mantenimiento);
    };

    const DEA = () => {
        const DEA = "DEA";
        fb.requestDEA(currentUser, infoUser);
        pushWeb(DEA);
    };

    const pushWeb = objeto => {
        fb.sendWebNotification(webToken, infoUser, objeto);
    };

    const pushWeb2 = (objeto, cantidad) => {
        fb.sendWebNotification2(webToken, infoUser, objeto, cantidad);
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "white"
            }}
        >
            {dialogueSeen && (
                <DialogInput
                    isDialogVisible={dialogueSeen}
                    title={"Solicitud Apoyo de Brigadistas"}
                    message={"Indique el número de brigadistas que requiere:"}
                    hintInput={"Escriba un número"}
                    submitInput={inputText => {
                        apoyo(inputText);
                    }}
                    closeDialog={() => {
                        setDialogueSeen(false);
                    }}
                ></DialogInput>
            )}
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
            <Text style={styles.text}>Recursos Disponibles</Text>
            <View style={{ ...styles.photoContainer }}>
                <TouchableOpacity onPress={confAmbulancia}>
                    <Image
                        style={{ ...styles.image, width: 85 }}
                        source={require("../../assets/ambulance.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={confCamilla}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/camilla.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={confSillaRuedas}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/sillarueda.png")}
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
                <TouchableOpacity onPress={confDEA}>
                    <Image
                        style={{ ...styles.image, height: 90 }}
                        source={require("../../assets/dea.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={confApoyo}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/logoBrigada.png")}
                    />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    ...styles.photoContainer,
                    justifyContent: "flex-start",
                    paddingLeft: 35
                }}
            >
                <TouchableOpacity onPress={confBotiquin}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/botiquin.png")}
                    />
                </TouchableOpacity>
            </View>
            <Text style={styles.text}>Apoyos Externos Disponibles</Text>
            <View style={{ ...styles.photoContainer }}>
                <TouchableOpacity onPress={confPolicia}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/police.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={confDefCivil}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/defciv.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={confBombero}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/bombero.png")}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.photoContainer}>
                <TouchableOpacity onPress={confCruzRoja}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/cruzroja.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={confMantenimiento}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/mantenimiento.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={confCentroMedico}>
                    <Image
                        style={styles.image}
                        source={require("../../assets/centromedico.png")}
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
    },
    text: {
        textAlign: "center",
        fontWeight: "bold",
        paddingTop: 10,
        paddingBottom: 7
    },
    image: {
        width: 70,
        height: 70
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
