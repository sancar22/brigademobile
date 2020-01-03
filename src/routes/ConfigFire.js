import * as firebase from "firebase";
import { config } from "./Config";
import React from "react";

// Initialize Firebase

class Firebase {
    constructor() {
        firebase.initializeApp(config);
    }

    addRemainingData(currentUser, currentUID, token) {
        firebase
            .database()
            .ref("Users/" + currentUser)
            .update({
                Expotoken: token,
                UID: currentUID,
                online: true,
                selected: false
            });
    }

    setCustomRejectCause(currentUser) {
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
    }

    setOnlineSelected(currentUser) {
        firebase
            .database()
            .ref("Users/" + currentUser)
            .update({
                online: false,
                selected: false
            });
    }

    sendWebNotification(webToken, infoUser, genero, objeto) {
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
            requireInteraction: true
        };
        fetch(PUSH_ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: "key=" + key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: notification,
                to: to
            })
        })
            .catch(err => {
                alert(`Error en solicitud de ${objeto}. Vuelva a intentarlo.`);
            })
            .then(() => {
                alert(`Objeto: ${objeto} solicitad@`);
            });
    }

    increaseRejected(currentUser) {
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
    }

    handleAcceptCase(currentUser) {
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
                    .update({
                        tInicial: tI,
                        causaRechazo: "",
                        active: true,
                        closed: false,
                        date: Date.now()
                    });
                firebase
                    .database()
                    .ref("Users/" + currentUser)
                    .update({
                        accepted: newAccepted,
                        ocupado: true,
                        notif: false
                    });
            });
    }

    fillTextArea(currentUser, textArea) {
        firebase
            .database()
            .ref("Users/" + currentUser)
            .once("value", snapshot => {
                const notifs = snapshot.val().receivedNotif - 1; // aumentar notificaciones recibidas

                firebase
                    .database()
                    .ref("Casos/" + currentUser + notifs) // Para updatear la variable de Redux de caso
                    .update({ causaRechazo: textArea.trim() });
            });
    }

    updateCoords(lat, long, currentUser) {
        firebase
            .database()
            .ref("Users/" + currentUser)
            .update({ Latitud: lat, Longitud: long });
    }

    requestExt(currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ extintor: true });
    }

    requestCam(currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ camilla: true });
    }
    async uploadCaseImages1(uri, imageName, currentUser, infoUser) {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = firebase
            .storage()
            .ref()
            .child("caseImages/" + imageName)
            .put(blob);
        ref.on(
            "state_changed",
            snapshot => {
                // progrss function ....
            },
            error => {
                // error function ....
                console.log(error);
            },
            () => {
                // complete function ....
                firebase
                    .storage()
                    .ref("caseImages/")
                    .child(imageName)
                    .getDownloadURL()
                    .then(url => {
                        firebase
                            .database()
                            .ref(
                                "Casos/" +
                                    currentUser +
                                    (infoUser.receivedNotif - 1).toString()
                            )
                            .update({
                                image1: url
                            });
                    });
            }
        );
    }
    async uploadCaseImages2(uri, imageName, currentUser, infoUser) {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = firebase
            .storage()
            .ref()
            .child("caseImages/" + imageName)
            .put(blob);
        ref.on(
            "state_changed",
            snapshot => {
                // progrss function ....
            },
            error => {
                // error function ....
                console.log(error);
            },
            () => {
                // complete function ....
                firebase
                    .storage()
                    .ref("caseImages/")
                    .child(imageName)
                    .getDownloadURL()
                    .then(url => {
                        firebase
                            .database()
                            .ref(
                                "Casos/" +
                                    currentUser +
                                    (infoUser.receivedNotif - 1).toString()
                            )
                            .update({
                                image2: url
                            });
                    });
            }
        );
    }
    closeCase(currentUser) {
        Number.prototype.padLeft = function(base, chr) {
            var len = String(base || 10).length - String(this).length + 1;
            return len > 0 ? new Array(len).join(chr || "0") + this : this;
        };
        let d = new Date(),
            dformat =
                [
                    (d.getMonth() + 1).padLeft(),
                    d.getDate().padLeft(),
                    d.getFullYear()
                ].join("/") +
                " " +
                [
                    d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()
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
                                active: false,
                                tFinal: finishTime,
                                calcFin: Date.now()
                            });
                    });
            });
    }

    updateBusy(currentUser) {
        firebase
            .database()
            .ref("Users/" + currentUser)
            .update({ ocupado: false });
    }
}

export default new Firebase();
