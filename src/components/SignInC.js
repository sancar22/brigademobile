import React, { useState } from "react";
import { Container, Form, Input, Item, Button, Label } from "native-base";
import {
    StyleSheet,
    Text,
    ActivityIndicator,
    View,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    Image,
} from "react-native";
import { Actions } from "react-native-router-flux";
import Animated, { Easing } from "react-native-reanimated";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import Svg, { Image as Img, Circle, ClipPath } from "react-native-svg";
const { width, height } = Dimensions.get("window");
const {
    Value,
    concat,
    event,
    block,
    cond,
    eq,
    set,
    Clock,
    startClock,
    stopClock,
    debug,
    timing,
    clockRunning,
    interpolate,
    Extrapolate,
} = Animated;

function runTiming(clock, value, dest) {
    const state = {
        finished: new Value(0),
        position: new Value(0),
        time: new Value(0),
        frameTime: new Value(0),
    };

    const config = {
        duration: 1000,
        toValue: new Value(0),
        easing: Easing.inOut(Easing.ease),
    };

    return block([
        cond(clockRunning(clock), 0, [
            set(state.finished, 0),
            set(state.time, 0),
            set(state.position, value),
            set(state.frameTime, 0),
            set(config.toValue, 0),
            set(config.toValue, dest),
            startClock(clock),
        ]),
        timing(clock, state, config),
        cond(state.finished, debug("stop clock", stopClock(clock))),
        state.position,
    ]);
}

const buttonOpacity = new Value(1);
const onStateChange = event([
    {
        nativeEvent: ({ state }) =>
            block([
                cond(
                    eq(state, State.END),
                    set(buttonOpacity, runTiming(new Clock(), 1, 0))
                ), // once Button is done being clicked
            ]),
    },
]);

const buttonY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [100, 0],
    extrapolate: Extrapolate.CLAMP,
});
const bgY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [-height / 3 - 50, 0],
    extrapolate: Extrapolate.CLAMP,
});
const textInputZindex = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, -1],
    extrapolate: Extrapolate.CLAMP,
});
const textInputY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [0, 100],
    extrapolate: Extrapolate.CLAMP,
});
const textInputOpacity = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
});
const rotateCross = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [180, 360],
    extrapolate: Extrapolate.CLAMP,
});

function SignInC(props) {
    const onCloseState = event([
        {
            nativeEvent: ({ state }) =>
                block([
                    cond(
                        eq(state, State.END),
                        set(buttonOpacity, runTiming(new Clock(), 0, 1))
                    ), // once Button is done being clicked
                ]),
        },
    ]);
    return (
        <KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: "white",
                justifyContent: "flex-end",
            }}
            behavior="padding"
            enabled
        >
            <Animated.View
                style={{
                    ...StyleSheet.absoluteFill,
                    transform: [{ translateY: bgY }],
                }}
            >
                <Svg height={height + 50} width={width}>
                    <ClipPath id="clip">
                        <Circle r={height + 50} cx={width / 2} />
                    </ClipPath>
                    <Img
                        href={require("../../assets/uni2.jpg")}
                        width={width}
                        height={height + 50}
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="url(#clip)"
                    />
                </Svg>
            </Animated.View>

            <Animated.View style={styles.brigadaIcon}>
                <Image
                    style={styles.round}
                    source={require("../../assets/logoBrigada.png")}
                />
            </Animated.View>

            <View style={{ height: height / 3, justifyContent: "center" }}>
                <TouchableOpacity>
                    <TapGestureHandler onHandlerStateChange={onStateChange}>
                        <Animated.View
                            style={{
                                ...styles.button,
                                opacity: buttonOpacity,
                                transform: [{ translateY: buttonY }],
                            }}
                        >
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                INGRESAR
                            </Text>
                        </Animated.View>
                    </TapGestureHandler>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Actions.forgot()}>
                    <Animated.View
                        style={{
                            ...styles.button,
                            opacity: buttonOpacity,
                            transform: [{ translateY: buttonY }],
                        }}
                    >
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                            RESTABLECER CONTRASEÑA
                        </Text>
                    </Animated.View>
                </TouchableOpacity>

                <Animated.View
                    style={{
                        height: height / 3,
                        ...StyleSheet.absoluteFill,
                        top: null,
                        justifyContent: "center",
                        zIndex: textInputZindex,
                        opacity: textInputOpacity,
                        transform: [{ translateY: textInputY }],
                        backgroundColor: "#fff",
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                    }}
                >
                    <TapGestureHandler onHandlerStateChange={onCloseState}>
                        <Animated.View style={styles.closeButton}>
                            <Animated.Text
                                style={{
                                    fontSize: 15,
                                    transform: [
                                        { rotate: concat(rotateCross, "deg") },
                                    ],
                                }}
                            >
                                X
                            </Animated.Text>
                        </Animated.View>
                    </TapGestureHandler>
                    <View>
                        <TextInput
                            autoCorrect={false}
                            autoCapitalize="none"
                            placeholder="EMAIL"
                            style={styles.textInput}
                            placeholderTextColor="black"
                            onChangeText={email => props.emailHandler(email)}
                            value={props.email}
                        />
                        <TextInput
                            autoCorrect={false}
                            autoCapitalize="none"
                            secureTextEntry={true}
                            placeholder="CONTRASEÑA"
                            style={styles.textInput}
                            placeholderTextColor="black"
                            onChangeText={pass => props.passwordHandler(pass)}
                            value={props.password}
                        />
                        {props.loading && <ActivityIndicator />}
                    </View>
                    <TouchableOpacity
                        onPress={() =>
                            props.loginUser(
                                props.email.toLowerCase(),
                                props.password
                            )
                        }
                    >
                        <Animated.View style={styles.button}>
                            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                                INGRESAR
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </KeyboardAvoidingView>
    );
}

export default SignInC;

const styles = StyleSheet.create({
    button: {
        backgroundColor: "white",
        height: 70,
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
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    closeButton: {
        height: 40,
        width: 40,
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: -20,
        left: width / 2 - 20,
        shadowOffset: { width: 2, height: 2 },
        shadowColor: "black",
        shadowOpacity: 0.8,
        elevation: 3,
    },
    textInput: {
        height: 50,
        borderRadius: 25,
        borderWidth: 0.5,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        borderColor: "rgba(0,0,0,0.2)",
    },
    round: {
        borderRadius: 50,
        overflow: "hidden",
        position: "absolute",
        flex: 1,
        width: 150,
        height: 150,
    },
});
