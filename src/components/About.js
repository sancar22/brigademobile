import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import {
    Text,
    View,
    StyleSheet,
    Button,
    Vibration,
    TouchableOpacity
} from "react-native";
import { Actions } from "react-native-router-flux";
import * as Permissions from "expo-permissions";
import * as firebase from "firebase";
import { Notifications, Alert } from "expo";
import { useSelector, useDispatch } from "react-redux";
import { notifshow, fillAll, fillInfo } from "../actions/index";
import _ from "lodash";
import fb from "../routes/ConfigFire";
import NotificationContainer from "./NotificationContainer";
import * as Location from "expo-location";

function About() {
    const infoUser = useSelector(state => state.info);
    const caso = useSelector(state => state.case);
    const [sound, setSound] = useState(null);
    const [location, setLocation] = useState(null);
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
            shouldDuckAndroid: true
        });
        getPermissionsAsync();

        return () => {
            console.log("Unmounted About");
            this.listener.remove(); // OJO ACÁ CUANDO HAGAMOS MÚLTIPLES PESTAÑAS
        };
    }, []);

    const getPermissionsAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
            alert("No permissions");
        } else {
            console.log("Permission granted!");
        }
        getLocationAsync();
    };
    const getLocationAsync = () => {
        Location.watchPositionAsync(
            {
                enableHighAccuracy: false,
                timeInterval: 30000,
                distanceInterval: 0
            },
            location => {
                setLocation(location);
                fb.updateCoords(
                    location.coords.latitude,
                    location.coords.longitude,
                    currentUser
                );
            }
        );
    };

    function initializer() {
        // When component mounts, there will be a listener for notif sent
        console.log("UPDATED16");
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
            if (data.id !== "1") {
                Vibration.vibrate(10000);
                try {
                    const {
                        sound: soundObject,
                        status
                    } = await Audio.Sound.createAsync(
                        {
                            uri:
                                "https://firebasestorage.googleapis.com/v0/b/brigadaun.appspot.com/o/audios%2Falarm.wav?alt=media&token=a2c80767-bae0-47b8-8dae-3b1a7af590df"
                        },
                        { shouldPlay: true }
                    );
                    setSound(soundObject);
                } catch (error) {
                    console.log(error);
                }

                fb.setCustomRejectCause(currentUser);
                firebase
                    .database()
                    .ref("Users/" + currentUser)
                    .once("value", snapshot => {
                        const userInfo = snapshot.val();
                        const notifs = snapshot.val().receivedNotif + 1; // aumentar notificaciones recibidas
                        if (!userInfo.expired) {
                            firebase
                                .database()
                                .ref(
                                    "Casos/" +
                                        currentUser +
                                        userInfo.receivedNotif
                                ) // Para updatear la variable de Redux de caso
                                .once("value", snapshot => {
                                    const caseInfo = snapshot.val();
                                    dispatch(fillAll(caseInfo));
                                });
                            firebase
                                .database()
                                .ref("Users/" + currentUser)
                                .update({ receivedNotif: notifs, notif: true });
                            // se updatea +1
                        }
                    });
            } else {
                Vibration.vibrate(3000);
                Alert.alert(data.name);
            }
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
            {infoUser.notif ? (
                <NotificationContainer
                    codigo={caso.codigo}
                    lugar={caso.lugar}
                    categoria={caso.categoria}
                    descripcion={caso.descripcion}
                    rejectCase={rejectCase}
                    acceptCase={acceptCase}
                    button={true}
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
