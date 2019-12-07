import React from "react";
import { Router, Scene } from "react-native-router-flux";
import Home from "../components/Home";
import About from "../components/About";
import ForgotPassWord from "../components/ForgotPassWord";
import Case from "../components/Case";
import Reject from "../components/Reject";
import _ from "lodash";

function Routes() {
    return (
        <Router>
            <Scene key="root">
                <Scene
                    key="home"
                    component={Home}
                    title="Home"
                    initial={true}
                    hideNavBar
                />
                <Scene key="about" component={About} title="About" hideNavBar />
                <Scene
                    key="forgot"
                    component={ForgotPassWord}
                    title="Password Forget"
                />
                <Scene key="caso" component={Case} title="Case" hideNavBar />
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
