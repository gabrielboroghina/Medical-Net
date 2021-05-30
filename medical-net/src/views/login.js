import * as React from 'react';
import '../App.scss';
import {Link, useHistory} from 'react-router-dom';
import {useState} from "react";
import * as bridge from "../bridge";
import style from '../style.module.scss';
import {useCookies} from "react-cookie";

import {
    DefaultButton, PrimaryButton,
    Stack,
    TextField,
    getTheme, Text
} from 'office-ui-fabric-react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';

const LoginStates = Object.freeze({
    LOGIN: 0,
    SEND_PASS_RESET_MAIL: 1,
    RESET_PASS: 2,
});

const PasswordResetMailSent = () => {
    return (
        <>
            <h2>Password reset</h2>
            <Text variant={'medium'} block>
                A password reset email was sent to you. Click the link in the mail to reset your password.
            </Text>
        </>
    );
};

const LoginPanel = () => {
    const {palette} = getTheme();
    const [err, setErr] = useState("");
    const history = useHistory();
    const [, setCookie] = useCookies([]);
    const [loginState, setLoginState] = useState(LoginStates.LOGIN);

    const authenticateUser = async () => {
        const authData = {
            username: document.getElementById("field-user").value,
            password: document.getElementById("field-pass").value,
        };

        try {
            const data = (await bridge.login(authData)).data;
            setCookie("access_token", data.accessToken);
            setCookie("user_profile", data.userProfile);

            // successful authentication; redirect the user
            history.push('/');
        } catch (err) {
            const response = err.response;
            setErr(response ? response.data.description : "There was an error processing your request");
        }
    };

    const forgotPassword = async () => {
        const authData = {
            username: document.getElementById("field-user").value,
        };
        bridge.forgotPassword(authData);
        setLoginState(LoginStates.SEND_PASS_RESET_MAIL);
    }

    return (
        <div className={style.flexContainer}>
            <div className={style.box} style={{boxShadow: Depths.depth4}}>
                <Stack className="slideLeft" tokens={{childrenGap: 20}}>
                    {loginState === LoginStates.LOGIN ? (
                            <>
                                <h2>Sign In</h2>
                                <form>
                                    <Stack tokens={{childrenGap: 20}}>
                                        <TextField label="Username:" id="field-user"
                                                   underlined autoComplete="username"
                                        />
                                        <TextField label="Password:" id="field-pass" type="password"
                                                   underlined autoComplete="current-password" errorMessage={err}
                                        />
                                        <Link className={style.smallLink} to="/register"
                                              style={{color: palette.themePrimary}}>
                                            Don't have an account?
                                        </Link>

                                        <Stack horizontal horizontalAlign="end" tokens={{childrenGap: 20}}>
                                            <DefaultButton text="Forgot password" onClick={forgotPassword}
                                                           allowDisabledFocus/>
                                            <PrimaryButton text="Sign in" onClick={authenticateUser} allowDisabledFocus/>
                                        </Stack>
                                    </Stack>
                                </form>
                            </>
                        ) :
                        <PasswordResetMailSent/>}
                </Stack>
            </div>
        </div>
    );
};

export default LoginPanel;
