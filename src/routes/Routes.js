import React from "react";
import { Router, Scene, Drawer } from "react-native-router-flux";
import Home from "../components/Home";
import About from "../components/About";
import ForgotPassWord from "../components/ForgotPassWord";
import Case from "../components/Case";
import Reject from "../components/Reject";
import _ from "lodash";
import Case2 from "../components/Case2";
import Case3 from "../components/Case3";
import HelpCase from "../components/HelpCase";

function Routes() {
    return (
        <Router>
            <Scene key="root">
                <Scene
                    key="home"
                    initial={true}
                    component={Home}
                    title="Home"
                    hideNavBar
                />
                <Scene key="about" component={About} title="About" hideNavBar />
                <Scene
                    key="forgot"
                    component={ForgotPassWord}
                    title="Password Forget"
                />
                <Scene key="help" component={HelpCase} title="Help Case" />

                <Scene
                    key="caso"
                    tabs
                    hideNavBar
                    tabBarStyle={{
                        backgroundColor: "white",
                        display: "flex"
                    }}
                    labelStyle={{
                        fontSize: 20,
                        marginBottom: 10
                    }}
                    headerLayoutPreset="center"
                >
                    <Scene key="tab1" title="Info Caso">
                        <Scene
                            key="caso"
                            component={Case2}
                            headerLayoutPreset="center"
                            initial
                        />
                    </Scene>
                    <Scene key="tab2" title="Caso Parte 2">
                        <Scene
                            key="caso"
                            component={Case3}
                            headerLayoutPreset="center"
                            initial
                        />
                    </Scene>
                    <Scene key="tab3" title="Caso Parte 3">
                        <Scene
                            key="caso"
                            component={Case}
                            headerLayoutPreset="center"
                            initial
                        />
                    </Scene>
                </Scene>

                <Scene
                    key="reject"
                    component={Reject}
                    title="Case"
                    hideNavBar
                />
            </Scene>
        </Router>
    );
}
export default Routes;
