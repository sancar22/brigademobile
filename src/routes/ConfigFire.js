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
                selected: false,
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
                selected: false,
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
                    .update({ tInicial: tI, causaRechazo: "" });
                firebase
                    .database()
                    .ref("Users/" + currentUser)
                    .update({
                        accepted: newAccepted,
                        ocupado: true,
                        notif: false,
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
    }

    updateBusy(currentUser) {
        firebase
            .database()
            .ref("Users/" + currentUser)
            .update({ ocupado: false });
    }
}

export default new Firebase();
