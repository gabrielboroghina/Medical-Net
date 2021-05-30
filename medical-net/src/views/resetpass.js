import * as React from 'react';
import '../App.scss';
import {Link} from 'react-router-dom';
import {useState} from "react";
import * as bridge from "../bridge";
import style from '../style.module.scss';

import {
    PrimaryButton,
    Stack,
    TextField,
    getTheme, Text
} from 'office-ui-fabric-react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';

const States = Object.freeze({
    RESET: 0,
    DONE: 1,
});

const PasswordWasReset = () => {
    const {palette} = getTheme();

    return (
        <>
            <h2>Password was reset</h2>
            <Text variant={'medium'} block>
                The password was reset. You can login now.
            </Text>
            <Link className={style.smallLink} to="/login" style={{color: palette.themePrimary}}>
                Go to login page
            </Link>
            <br/>
        </>
    );
};

const ResetPassPanel = props => {
        const {palette} = getTheme();
        const [loginState, setLoginState] = useState(States.RESET);

        const resetPassword = async () => {
            const authData = {
                email: props.location.search.split("=")[1],
                password: document.getElementById("field-pass").value,
            };
            bridge.resetPassword(authData);
            setLoginState(States.DONE);
        }

        return (
            <div className={style.flexContainer}>
                <div className={style.box} style={{boxShadow: Depths.depth4}}>
                    <Stack className="slideLeft" tokens={{childrenGap: 20}}>
                        {loginState === States.RESET ? (
                                <>
                                    <h2>Reset password</h2>
                                    <form>
                                        <Stack tokens={{childrenGap: 20}}>
                                            <TextField label="New password:" id="field-pass" type="password"
                                                       underlined autoComplete="current-password"
                                            />
                                            <Stack horizontal horizontalAlign="end" tokens={{childrenGap: 20}}>
                                                <PrimaryButton text="Reset" onClick={resetPassword} allowDisabledFocus/>
                                            </Stack>
                                        </Stack>
                                    </form>
                                </>
                            ) :
                            <PasswordWasReset/>}
                    </Stack>
                </div>
            </div>
        );
    }
;

export default ResetPassPanel;
