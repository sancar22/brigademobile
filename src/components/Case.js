import React, { useEffect, useCallback, useState } from "react";
import { Text, View, BackHandler } from "react-native";
import { Button } from "native-base";
import { Actions } from "react-native-router-flux";
import * as firebase from "firebase";
import { useSelector, useDispatch } from "react-redux";

function Case() {
    const handleBackButton = useCallback(() => {
        return true;
    });
    const infoUser = useSelector(state => state.info);
    const [webToken, setWebToken] = useState("");

    useEffect(() => {
        console.log("Mounted Case");
        BackHandler.addEventListener("hardwareBackPress", handleBackButton);
        getFBInfo();
        return () => {
            console.log("Unmounted Case");
            BackHandler.removeEventListener(
                "hardwareBackPress",
                handleBackButton
            );
        };
    }, []);

    useEffect(() => {
        console.log(webToken);
    }, [webToken]);
    const getFBInfo = () => {
        firebase
            .database()
            .ref("/Users/santiagoyacaman@uninorte")
            .on("value", snapshot => {
                setWebToken(snapshot.val().pushToken);
            });
    };
    const back = () => {
        // let currentUser = firebase.auth().currentUser.uid.toString();
        let currentUser = firebase
            .auth()
            .currentUser.email.toString()
            .split(".")[0];
        Number.prototype.padLeft = function(base, chr) {
            var len = String(base || 10).length - String(this).length + 1;
            return len > 0 ? new Array(len).join(chr || "0") + this : this;
        };
        let d = new Date(),
            dformat =
                [
                    (d.getMonth() + 1).padLeft(),
                    d.getDate().padLeft(),
                    d.getFullYear(),
                ].join("/") +
                " " +
                [
                    d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft(),
                ].join(":");

        firebase
            .database()
            .ref("Users/" + currentUser)
            .once("value", snapshot => {
                let notif = snapshot.val().receivedNotif;
                firebase
                    .database()
                    .ref("Casos/" + currentUser + (notif - 1).toString())
                    .once("value", snapshot => {
                        let initialSec = snapshot.val().tInicial;
                        let finishTime = Date.now() / 1000;
                        let tTrans = finishTime - initialSec;

                        firebase
                            .database()
                            .ref(
                                "Casos/" + currentUser + (notif - 1).toString()
                            )
                            .update({
                                finalFecha: dformat,
                                tTranscurrido: tTrans,
                                tFinal: finishTime,
                            });
                    });
            });
        firebase
            .database()
            .ref("Users/" + currentUser)
            .update({ ocupado: false });
        Actions.replace("about");
    };

    const extintor = () => {
        const extint = "extintor";
        const genero = "un";
        pushWeb(extint, genero);
    };

    const camilla = () => {
        const genero = "una";
        const camill = "camilla";
        pushWeb(camill, genero);
        console.log("Camilla");
    };

    const pushWeb = (objeto, genero) => {
        const PUSH_ENDPOINT = "https://fcm.googleapis.com/fcm/send";
        let key =
            "AAAAppNbUYM:APA91bFd8gfd0fq0Jq8Crskxl5Ah4abkpQUmtrUjsTIQ17nsPK_jvb07JSvvNcBpNpFU_d3yjpR0KtMgRqHQRJpOUMN4iAsQNT7qjRzRmzr5bkUM7uF8M165De9OuYqrUhBmLoeCDImp";
        let to = webToken;
        let notification = {
            body: `El brigadista ${infoUser.nombre +
                " " +
                infoUser.apellido} requiere  ${genero + " " + objeto}.`,
            objeto: `${objeto}`,
            click_action: "http://localhost:3000",
            requireInteraction: true,
        };
        fetch(PUSH_ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: "key=" + key,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: notification,
                to: to,
            }),
        })
            .catch(err => {
                alert(`Error en solicitud de ${objeto}. Vuelva a intentarlo.`);
            })
            .then(() => {
                alert(`Objeto: ${objeto} solicitad@`);
            });
    };

    return (
        <View>
            <Button
                style={{ marginTop: 10 }} // Login button
                full
                rounded
                success
                onPress={back}
            >
                <Text>Devolverse</Text>
            </Button>
            <Button
                style={{ marginTop: 100 }} // Login button
                full
                rounded
                success
                onPress={extintor}
            >
                <Text>Extintor</Text>
            </Button>
            <Button
                style={{ marginTop: 100 }} // Login button
                full
                rounded
                success
                onPress={camilla}
            >
                <Text>Camilla</Text>
            </Button>
        </View>
    );
}

export default Case;
