import React, { useEffect, useState } from "react";
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
import { calcWidth, calcHeight } from "../HelpFunctions";

function About() {
    const brigada = useSelector(state => state.brigada); //Variable que controlará la visibilidad de la notificación
    const caso = useSelector(state => state.case);
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            Actions.replace("home");
        }
    });

    useEffect(() => {
        console.log("Mounted About");
        initializer();
        //updateUser()
        register();
        this.listener = Notifications.addListener(listen);
        return () => {
            console.log("Unmounted About");
            this.listener.remove();
        };
    }, []);

    function initializer() {
        // When component mounts, there will be a listener for notif sent
        let currentUser = firebase
            .auth()
            .currentUser.email.toString()
            .split(".")[0];
        firebase
            .database()
            .ref("Users/" + currentUser)
            .child("notif")
            .on("value", snapshot => {
                console.log(snapshot.val());
                const info = snapshot.val();
                dispatch(notifshow(info));
            });
    }

    async function register() {
        // se pide expoToken, se actualiza y se pone online en firebase
        let currentUser = firebase
            .auth()
            .currentUser.email.toString()
            .split(".")[0];
        let currentUID = firebase.auth().currentUser.uid.toString();

        firebase
            .database()
            .ref("Users/" + currentUser)
            .once("value", snapshot => {
                const info = snapshot.val();
                setEmail(info.Email);
            });
        //let emai = firebase.auth().currentUser.email.toString();
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
        firebase
            .database()
            .ref("Users/" + currentUser)
            .update({
                Expotoken: token,
                UID: currentUID,
                online: true,
                selected: false,
            });
    }

    const listen = ({ origin, data }) => {
        console.log(origin, data);
        let currentUser = firebase
            .auth()
            .currentUser.email.toString()
            .split(".")[0];

        if (origin === "received") {
            Vibration.vibrate(10000);
            firebase
                .database()
                .ref("Users/" + currentUser)
                .once("value", snapshot => {
                    let notif = snapshot.val().receivedNotif;
                    firebase
                        .database()
                        .ref("Casos/" + currentUser + notif)
                        .update({ causaRechazo: "Tiempo agotado" });
                });
            /* setTimeout(() => {
        firebase
          .database()
          .ref("Users/" + currentUser)
          .update({ notif: false });
      }, 10000);  // for avoiding notification always on*/
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
        try {
            let currentUser = firebase
                .auth()
                .currentUser.email.toString()
                .split(".")[0];
            firebase
                .database()
                .ref("Users/" + currentUser)
                .update({
                    online: false,
                    selected: false,
                });

            await firebase.auth().signOut();
            Actions.replace("home");
        } catch (error) {
            console.log(error);
        }
    }

    const rejectCase = () => {
        let currentUser = firebase
            .auth()
            .currentUser.email.toString()
            .split(".")[0];
        firebase
            .database()
            .ref("Users/" + currentUser)
            .once("value", snapshot => {
                const newRejected = snapshot.val().rejected + 1;
                firebase
                    .database()
                    .ref("Users/" + currentUser)
                    .update({ rejected: newRejected, notif: false });
            });
        Actions.replace("reject");
        // Para cuando rechace la notificación se oculte la notificación
    };

    const acceptCase = () => {
        let currentUser = firebase
            .auth()
            .currentUser.email.toString()
            .split(".")[0];
        firebase
            .database()
            .ref("Users/" + currentUser)
            .once("value", snapshot => {
                const newAccepted = snapshot.val().accepted + 1;
                let received = snapshot.val().receivedNotif - 1;
                let tI = Date.now() / 1000;
                firebase
                    .database()
                    .ref("Casos/" + currentUser + received.toString())
                    .update({ tInicial: tI, causaRechazo: "" });
                firebase
                    .database()
                    .ref("Users/" + currentUser)
                    .update({ accepted: newAccepted, ocupado: true });
            });

        firebase
            .database()
            .ref("Users/" + currentUser)
            .update({ notif: false });
        Vibration.cancel();
        Actions.replace("caso"); // Si acepta se va a la ventana de casos
    };

    return (
        <View style={{ flex: 1 }}>
            {brigada ? (
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(248, 245, 245, 0.8)",
                        paddingLeft: calcWidth(2),
                        paddingRight: calcWidth(2),
                        paddingTop: calcHeight(5),
                        paddingBottom: calcHeight(5),
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "#e4d8b4",
                            flexDirection: "column",
                            position: "relative",
                            borderRadius: 10,
                        }}
                    >
                        <View style={styles.caseContainer}>
                            <Text
                                style={{
                                    ...styles.textCase,
                                    paddingTop: calcHeight(5),
                                }}
                            >
                                Código:
                            </Text>
                            <View
                                style={{
                                    ...styles.caseBoxes,
                                    height: calcHeight(5),
                                }}
                            >
                                <Text
                                    style={{
                                        ...styles.textCase,
                                        paddingTop: calcHeight(1),
                                    }}
                                >
                                    {caso.codigo}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    ...styles.textCase,
                                    paddingTop: calcHeight(1.5),
                                }}
                            >
                                Lugar Emergencia:
                            </Text>
                            <View
                                style={{
                                    ...styles.caseBoxes,
                                    height: calcHeight(5),
                                }}
                            >
                                <Text
                                    style={{
                                        ...styles.textCase,
                                        paddingTop: calcHeight(1),
                                    }}
                                >
                                    {caso.lugarEmergencia}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    ...styles.textCase,
                                    paddingTop: calcHeight(1.5),
                                }}
                            >
                                Categoría:
                            </Text>
                            <View
                                style={{
                                    ...styles.caseBoxes,
                                    height: calcHeight(5),
                                }}
                            >
                                <Text
                                    style={{
                                        ...styles.textCase,
                                        paddingTop: calcHeight(1),
                                    }}
                                >
                                    {caso.categoria}
                                </Text>
                            </View>
                            <Text
                                style={{
                                    ...styles.textCase,
                                    paddingTop: calcHeight(1.5),
                                }}
                            >
                                Descripción:
                            </Text>
                            <View
                                style={{
                                    ...styles.caseBoxes,
                                    height: calcHeight(30),
                                }}
                            >
                                <Text
                                    style={{
                                        ...styles.textCase,
                                        paddingTop: calcHeight(1),
                                        textAlign: "justify",
                                    }}
                                >
                                    {caso.descAdicional}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                position: "relative",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    ...styles.touchOpBut,
                                    backgroundColor: "red",
                                }}
                                onPress={rejectCase}
                            >
                                <Text style={styles.button}>RECHAZAR</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    ...styles.touchOpBut,
                                    backgroundColor: "green",
                                }}
                                onPress={acceptCase}
                            >
                                <Text style={styles.button}>ACEPTAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "#ecf0f1",
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        textAlign: "center",
    },
    button: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        paddingVertical: 13,
    },
    touchOpBut: {
        flexDirection: "column",
        height: calcHeight(6),
        width: calcWidth(30),
        top: calcHeight(3),
        position: "relative",
        borderRadius: 10,
    },
    caseBoxes: {
        position: "relative",
        backgroundColor: "rgba(248, 245, 245, 0.8)",
        borderRadius: 10,
        borderColor: "black",
        paddingLeft: calcWidth(1.5),
        paddingRight: calcWidth(1.5),
    },
    caseContainer: {
        flex: 4,
        flexDirection: "column",
        position: "relative",
        paddingLeft: calcWidth(3),
        paddingRight: calcWidth(3),
    },
    textCase: {
        fontWeight: "bold",
    },
});

export default About;
