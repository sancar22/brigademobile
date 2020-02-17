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

    sendWebNotification2(webToken, infoUser, objeto, cant) {
        const PUSH_ENDPOINT = "https://fcm.googleapis.com/fcm/send";
        let key =
            "AAAAppNbUYM:APA91bFd8gfd0fq0Jq8Crskxl5Ah4abkpQUmtrUjsTIQ17nsPK_jvb07JSvvNcBpNpFU_d3yjpR0KtMgRqHQRJpOUMN4iAsQNT7qjRzRmzr5bkUM7uF8M165De9OuYqrUhBmLoeCDImp";
        let to = webToken;
        let notification = {
            body: `El brigadista ${infoUser.nombre +
                " " +
                infoUser.apellido} requiere el apoyo de ${cant} brigadista/s.`,
            objeto: `${objeto.replace(/ /g, "")}`,
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

    sendWebNotification(webToken, infoUser, objeto) {
        const PUSH_ENDPOINT = "https://fcm.googleapis.com/fcm/send";
        let key =
            "AAAAppNbUYM:APA91bFd8gfd0fq0Jq8Crskxl5Ah4abkpQUmtrUjsTIQ17nsPK_jvb07JSvvNcBpNpFU_d3yjpR0KtMgRqHQRJpOUMN4iAsQNT7qjRzRmzr5bkUM7uF8M165De9OuYqrUhBmLoeCDImp";
        let to = webToken;
        let notification = {
            body: `El brigadista ${infoUser.nombre +
                " " +
                infoUser.apellido} requiere: ${objeto}.`,
            objeto: `${objeto.replace(/ /g, "")}`,
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

    updateAdditionalInfo(val, currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ descBrigadista: val });
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

    removeHelper(vinculatedBrigaders, currentUser, infoUser) {
        const reallyHelped = vinculatedBrigaders
            .filter(item => item.trulyHelped === true)
            .map(brigade => {
                const newHelpDid = brigade.helpdid + 1;
                firebase
                    .database()
                    .ref("Users/" + brigade.Email.split(".")[0])
                    .update({
                        apoyandoEmail: "",
                        apoyandoNotifRec: 0,
                        helpOcupado: false,
                        trulyHelped: false,
                        helpdid: newHelpDid
                    });
            });
        const helped = vinculatedBrigaders.filter(
            item => item.trulyHelped === true
        );
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ helpArray: helped });
        const didntHelp = vinculatedBrigaders
            .filter(item => item.trulyHelped === false)
            .map(brigade => {
                const newHelpDidnt = brigade.helpdidnt + 1;
                firebase
                    .database()
                    .ref("Users/" + brigade.Email.split(".")[0])
                    .update({
                        apoyandoEmail: "",
                        apoyandoNotifRec: 0,
                        helpOcupado: false,
                        trulyHelped: false,
                        helpdidnt: newHelpDidnt
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
    requestPol(currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ policia: true });
    }
    requestApoyo(currentUser, infoUser, inputText) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ apoyo: true, apoyoReq: inputText });

        firebase
            .database()
            .ref("Users/" + currentUser)
            .update({ requestedHelp: inputText });
    }
    requestBom(currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ bombero: true });
    }

    requestMantenimiento(currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ mantenimiento: true });
    }

    requestCentroMedico(currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ centromedico: true });
    }
    requestAmb(currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ ambulancia: true });
    }

    requestBotiquin(currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ botiquin: true });
    }

    requestDefCivil(currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ defcivil: true });
    }

    requestCruzRoja(currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ cruzroja: true });
    }

    requestDEA(currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ dea: true });
    }

    requestSillaRuedas(currentUser, infoUser) {
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({ sillaRueda: true });
    }
    async uploadCaseImages1(uri, imageName, currentUser, infoUser) {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = firebase
            .storage()
            .ref()
            .child(
                "caseImages/" +
                    currentUser +
                    "/" +
                    (infoUser.receivedNotif - 1).toString() +
                    "/" +
                    imageName
            )
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
                    .child(
                        currentUser +
                            "/" +
                            (infoUser.receivedNotif - 1).toString() +
                            "/" +
                            imageName
                    )
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
            .child(
                "caseImages/" +
                    currentUser +
                    "/" +
                    (infoUser.receivedNotif - 1).toString() +
                    "/" +
                    imageName
            )
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
                    .child(
                        currentUser +
                            "/" +
                            (infoUser.receivedNotif - 1).toString() +
                            "/" +
                            imageName
                    )
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
    updateTimer(date, currentUser, infoUser) {
        let a = new Date();
        let b = Math.round((a - date) / 1000);
        let c = new Date(b * 1000).toISOString().substr(11, 8);
        firebase
            .database()
            .ref(
                "Casos/" + currentUser + (infoUser.receivedNotif - 1).toString()
            )
            .update({
                formatTime: c
            });
    }
    updateBusy(currentUser) {
        firebase
            .database()
            .ref("Users/" + currentUser)
            .update({ ocupado: false, requestedHelp: 0 });
    }
}

export default new Firebase();
