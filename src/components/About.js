import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import {
    Text,
    View,
    StyleSheet,
    Button,
    Vibration,
    Alert,
    TouchableOpacity,
} from "react-native";
import { Actions } from "react-native-router-flux";
import * as Permissions from "expo-permissions";
import * as firebase from "firebase";
import { Notifications } from "expo";
import { useSelector, useDispatch } from "react-redux";
import {
    notifshow,
    fillPlace,
    fillCode,
    fillCategory,
    fillDescription,
    fillInfo,
} from "../actions/index";
import _ from "lodash";
import fb from "../routes/ConfigFire";
import NotificationContainer from "./NotificationContainer";
import BackgroundTimer from "react-native-background-timer";

function About() {
    const infoUser = useSelector(state => state.info);
    const brigada = useSelector(state => state.brigada); //Variable que controlará la visibilidad de la notificación
    const caso = useSelector(state => state.case);
    const [sound, setSound] = useState(null);
    const dispatch = useDispatch();
    let currentUser = firebase
        .auth()
        .currentUser.email.toString()
        .split(".")[0];

    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            Actions.replace("home");
        }
    });
    if (infoUser.ocupado) {
        Actions.replace("caso");
    }
    useEffect(() => {
        console.log("Mounted About");
        initializer();
        register();
        this.listener = Notifications.addListener(listen);
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
            shouldDuckAndroid: true,
        });
        return () => {
            console.log("Unmounted About");
            this.listener.remove(); // OJO ACÁ CUANDO HAGAMOS MÚLTIPLES PESTAÑAS
        };
    }, []);

    function initializer() {
        // When component mounts, there will be a listener for notif sent
        console.log("UPDATED14");
        firebase
            .database()
            .ref("Users/" + currentUser)
            .on("value", snapshot => {
                const allUserInfo = snapshot.val();
                dispatch(notifshow(allUserInfo.notif));
                dispatch(fillInfo(allUserInfo));
            });
    }

    async function register() {
        let currentUID = firebase.auth().currentUser.uid.toString();
        const { status } = await Permissions.askAsync(
            Permissions.NOTIFICATIONS
        );
        console.log(status);
        if (status !== "granted") {
            alert("You need to enable permissions in settings");
            return;
        }
        let token = await Notifications.getExpoPushTokenAsync();
        console.log(token);
        fb.addRemainingData(currentUser, currentUID, token);
    }

    const listen = async ({ origin, data }) => {
        console.log(origin, data);

        if (origin === "received") {
            Vibration.vibrate(10000);
            try {
                const {
                    sound: soundObject,
                    status,
                } = await Audio.Sound.createAsync(
                    {
                        uri:
                            "https://firebasestorage.googleapis.com/v0/b/brigadaun.appspot.com/o/audios%2Falarm.wav?alt=media&token=a2c80767-bae0-47b8-8dae-3b1a7af590df",
                    },
                    { shouldPlay: true }
                );
                setSound(soundObject);
            } catch (error) {
                console.log(error);
            }

            BackgroundTimer.setInterval(() => {
                console.log("Hello");
            }, 5000);

            fb.setCustomRejectCause(currentUser);
            firebase
                .database()
                .ref("Users/" + currentUser)
                .once("value", snapshot => {
                    const userInfo = snapshot.val();
                    const notifs = snapshot.val().receivedNotif + 1; // aumentar notificaciones recibidas

                    firebase
                        .database()
                        .ref("Casos/" + currentUser + userInfo.receivedNotif) // Para updatear la variable de Redux de caso
                        .once("value", snapshot => {
                            const caseInfo = snapshot.val();
                            dispatch(fillPlace(caseInfo.lugar));
                            dispatch(fillCode(caseInfo.codigo));
                            dispatch(fillDescription(caseInfo.descripcion));
                            dispatch(fillCategory(caseInfo.categoria));
                        });
                    firebase
                        .database()
                        .ref("Users/" + currentUser)
                        .update({ receivedNotif: notifs });
                    // se updatea +1
                });

            firebase
                .database()
                .ref("Users/" + currentUser)
                .update({ notif: true });
        }
    };

    async function signOutUser() {
        fb.setOnlineSelected(currentUser);
        await firebase.auth().signOut();
        Actions.replace("home");
    }

    const rejectCase = () => {
        fb.increaseRejected(currentUser);
        sound.stopAsync();
        Vibration.cancel();
        Actions.replace("reject");
        // Para cuando rechace la notificación se oculte la notificación
    };

    const acceptCase = () => {
        fb.handleAcceptCase(currentUser);
        sound.stopAsync();
        Vibration.cancel();
        Actions.replace("caso"); // Si acepta se va a la ventana de casos
    };

    return (
        <View style={{ flex: 1 }}>
            {brigada ? (
                <NotificationContainer
                    codigo={caso.codigo}
                    lugarEmergencia={caso.lugarEmergencia}
                    categoria={caso.categoria}
                    descAdicional={caso.descAdicional}
                    rejectCase={rejectCase}
                    acceptCase={acceptCase}
                />
            ) : (
                <View style={{ position: "relative", top: 500 }}>
                    <Button
                        full
                        rounded
                        success
                        title="logout"
                        onPress={() => signOutUser()}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({});

export default About;
