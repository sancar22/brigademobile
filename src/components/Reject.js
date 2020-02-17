import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import * as firebase from "firebase";
import RadioForm from "react-native-radio-form";
import Textarea from "react-native-textarea";
import { calcWidth, calcHeight } from "../HelpFunctions";
import fb from "../routes/ConfigFire";

const mockData = [
    {
        label: "Reunión importante",
        value: "fi"
    },
    {
        label: "Atendiendo otra situación",
        value: "se"
    },
    {
        label: "Otra:",
        value: "th"
    }
];

function Reject() {
    const [textArea, setTextArea] = useState("");
    const [showText, setShowText] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [bullet, setBullet] = useState(null);
    const select = item => {
        if (item.value === "th") {
            setShowText(true);
            setShowButton(true);
            setBullet(item);
        } else {
            setShowText(false);
            setShowButton(true);
            setBullet(item);
        }
    };

    const submitReason = () => {
        let currentUser = firebase
            .auth()
            .currentUser.email.toString()
            .split(".")[0];

        if (showButton) {
            if (bullet.value === "th") {
                if (textArea.length > 0) {
                    fb.fillTextArea(currentUser, textArea);
                    Actions.replace("about");
                } else {
                    alert("¡Escriba algo!");
                }
            } else {
                firebase
                    .database()
                    .ref("Users/" + currentUser)
                    .once("value", snapshot => {
                        const userInfo = snapshot.val();
                        const notifs = snapshot.val().receivedNotif - 1; // aumentar notificaciones recibidas

                        firebase
                            .database()
                            .ref("Casos/" + currentUser + notifs) // Para updatear la variable de Redux de caso
                            .update({ causaRechazo: bullet.label });
                    });
                Actions.replace("about");
            }
        } else {
            alert("¡Escoja una opción!");
        }
    };

    return (
        <View>
            <View style={{ marginVertical: calcHeight(30) }}>
                <RadioForm
                    dataSource={mockData}
                    itemShowKey="label"
                    itemRealKey="value"
                    circleSize={20}
                    initial={-1}
                    formHorizontal={false}
                    labelHorizontal={true}
                    onPress={select}
                />
                {showText && (
                    <Textarea
                        containerStyle={styles.textareaContainer}
                        style={styles.textarea}
                        onChangeText={val => setTextArea(val)}
                        defaultValue={textArea}
                        maxLength={120}
                        placeholder={""}
                        placeholderTextColor={"#c7c7c7"}
                        underlineColorAndroid={"transparent"}
                    />
                )}
                <View style={{ opacity: showButton ? 1 : 0.5 }}>
                    <TouchableOpacity
                        style={{
                            ...styles.touchOpBut,
                            backgroundColor: "green"
                        }}
                        onPress={submitReason}
                    >
                        <Text style={styles.button}>ENVIAR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        justifyContent: "center",
        alignItems: "center"
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
    },
    button: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        paddingVertical: 13
    },
    touchOpBut: {
        flexDirection: "column",
        height: calcHeight(6),
        width: calcWidth(30),
        top: calcHeight(3),
        position: "relative",
        borderRadius: 10,
        left: calcWidth(35)
    }
});
export default Reject;
