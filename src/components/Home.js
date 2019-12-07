import React, { useState } from "react";
import { Actions } from "react-native-router-flux"; //npm i react-native-router-flux --save
import { config } from "../routes/Config";
import * as firebase from "firebase"; // npm install --save react-native-firebase
import { Container, Form, Input, Item, Button, Label } from "native-base";
import { StyleSheet, Text, ActivityIndicator } from "react-native";

// This is the login Window

function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    let authFlag = true;
    firebase.auth().onAuthStateChanged(user => {
        if (authFlag) {
            authFlag = false;
            if (user) {
                Actions.replace("about");
            }
        }
    });
    const loginUser = (email, password) => {
        try {
            setLoading(true);
            firebase
                .auth()
                .signInWithEmailAndPassword(email.trim(), password)
                .then(() => {
                    setLoading(false);
                    Actions.replace("about"); // If user is registered it will go to about page
                });
        } catch (error) {
            console.log(error.toString());
        }
    };

    const signUpUser = (email, password) => {
        try {
            if (email.length < 6) {
                alert("Please enter at least 6 characters");
                return;
            }
            firebase
                .auth()
                .createUserWithEmailAndPassword(email.trim(), password); // Register user in firebase
        } catch (error) {
            console.log(error.toString());
        }
    };
    return (
        <Container style={styles.container}>
            <Form>
                <Item floatingLabel>
                    <Label>Email</Label>
                    <Input
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={email => setEmail(email)} // Constantly update email
                    />
                </Item>

                <Item floatingLabel>
                    <Label>Password</Label>
                    <Input
                        secureTextEntry={true}
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={password => setPassword(password)} // Constantly update password
                    />
                </Item>

                <Button
                    style={{ marginTop: 10 }} // Login button
                    full
                    rounded
                    success
                    onPress={() => loginUser(email, password)}
                >
                    <Text>Login</Text>
                </Button>

                <Button
                    style={{ margixnTop: 10 }} // Forget button
                    full
                    rounded
                    primary
                    onPress={() => Actions.forgot()}
                >
                    <Text>Forgot PWRD</Text>
                </Button>

                <Button
                    style={{ margixnTop: 10 }} // Forget button
                    full
                    rounded
                    success
                    onPress={() => signUpUser(email, password)}
                >
                    <Text>Sign Up</Text>
                </Button>
                {loading && <ActivityIndicator />}
            </Form>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        padding: 10,
    },
});

export default Home;
