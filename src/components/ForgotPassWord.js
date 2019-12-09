import React from "react";
import { Actions } from "react-native-router-flux";
import * as firebase from "firebase";
import { Container, Form, Input, Item, Button } from "native-base";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    KeyboardAvoidingView,
} from "react-native";

class ForgotPassWord extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
        };
        this.resetPass = this.resetPass.bind(this);
    }

    resetPass = email => {
        try {
            firebase
                .auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                    alert("Check your email to reset your password");
                    Actions.home(); // Return to home
                });
        } catch (error) {
            console.log(error.toString());
        }
    };

    render() {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
                enabled
            >
                <View style={{ ...StyleSheet.absoluteFill }}>
                    <Image
                        source={require("../../assets/uni2.jpg")}
                        style={{ flex: 1, height: null, width: null }}
                    />
                </View>
                <View style={styles.brigadaIcon}>
                    <Image
                        style={styles.round}
                        source={require("../../assets/logoBrigada.png")}
                    />
                </View>
                <Form>
                    <TextInput
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="EMAIL"
                        style={styles.textInput}
                        placeholderTextColor="black"
                        onChangeText={email => this.setState({ email: email })}
                        value={this.state.email}
                        style={styles.textInput}
                    />
                    <TouchableOpacity
                        onPress={() => this.resetPass(this.state.email)}
                    >
                        <View style={styles.button}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                RESTABLECER CONTRASEÑA
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Form>
            </KeyboardAvoidingView>
        );
    }
}
<Button
    style={{ marginTop: 10 }} // Send password reset option to email
    full
    rounded
    success
    onPress={() => this.resetPass(this.state.email)}
>
    <Text></Text>
</Button>;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
    },

    textInput: {
        backgroundColor: "white",
        height: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: "rgba(0,0,0,0.2)",
    },
    button: {
        backgroundColor: "white",
        height: 60,
        marginHorizontal: 20,
        borderRadius: 35,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: "black",
        shadowOpacity: 0.8,
        elevation: 3,
    },
    brigadaIcon: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        top: -90,
    },
    round: {
        borderRadius: 50,
        overflow: "hidden",
        position: "absolute",
        flex: 1,
        width: 110,
        height: 110,
    },
});

export default ForgotPassWord;
