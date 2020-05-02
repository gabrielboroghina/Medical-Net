import * as React from 'react';
import '../App.scss';
import {Link, useHistory} from 'react-router-dom';
import {useState} from "react";
import bridge from "../bridge";
import style from '../style.module.scss';

import {
    DefaultButton, PrimaryButton,
    Stack,
    TextField,
    getTheme
} from 'office-ui-fabric-react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';


const LoginPanel = props => {
    const {palette} = getTheme();
    const [err, setErr] = useState("");
    const history = useHistory();

    const authenticateUser = async () => {
        const authData = {
            username: document.getElementById("field-user").value,
            password: document.getElementById("field-pass").value,
        };

        try {
            await bridge.login(authData);

            // successful authentication; redirect the user
            history.push('/');
        } catch (err) {
            const response = err.response.data;
            setErr(response.description);
        }
    };

    return (
        <div className={style.flexContainer}>
            <div className={style.box} style={{boxShadow: Depths.depth4}}>
                <Stack className="slide" tokens={{childrenGap: 20}}>
                    <h2>Sign In</h2>
                    <form>
                        <Stack tokens={{childrenGap: 20}}>
                            <TextField label="Username:" id="field-user"
                                       underlined autoComplete="username"/>
                            <TextField label="Password:" id="field-pass" type="password"
                                       underlined autoComplete="current-password" errorMessage={err}/>
                            <Link className={style.smallLink} to="/register" style={{color: palette.themePrimary}}>
                                Don't have an account?
                            </Link>

                            <Stack horizontal horizontalAlign="end" tokens={{childrenGap: 20}}>
                                <DefaultButton text="Back" allowDisabledFocus/>
                                <PrimaryButton text="Sign in" onClick={authenticateUser} allowDisabledFocus/>
                            </Stack>
                        </Stack>
                    </form>
                </Stack>
            </div>
        </div>
    );
};

export default LoginPanel;
