import React, {useState} from 'react';
import '../App.scss';
import {Link} from 'react-router-dom';
import * as bridge from "../bridge";
import style from '../style.module.scss';

import {
    Text, TextField,
    DefaultButton, PrimaryButton,
    Stack,
    getTheme,
} from 'office-ui-fabric-react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';


const RegistrationStates = Object.freeze({
    DATA_FORM: 0,
    EMAIL_CONFIRM: 1,
});

const ValidateEmailBox = () => {
    return (
        <>
            <h2>Email verification</h2>
            <Text variant={'medium'} block>
                We've sent you a verification email. Please confirm it to finalize your registration.
            </Text>
        </>
    );
};

const EmailConfirm = () => {
    const {palette} = getTheme();

    return (
        <div className={style.flexContainer}>
            <div className={style.box} style={{boxShadow: Depths.depth4}}>
                <Stack className="slideLeft" tokens={{childrenGap: 20}}>
                    <h2>Email confirmed</h2>
                    <Text variant={'medium'} block>
                        Your account was successfully validated.
                    </Text>
                    <Link className={style.smallLink} to="/login" style={{color: palette.themePrimary}}>Go to login
                        page</Link>
                    <br/>
                </Stack>
            </div>
        </div>
    );
};

function RegisterBox() {
    const {palette} = getTheme();
    const [err, setErr] = useState({username: "", name: "", email: "", password: ""});
    const [registrationState, setRegistrationState] = useState(RegistrationStates.DATA_FORM);

    const validatePassword = password => {
        return password.length >= 6;
    };

    const registerUser = async () => {
        const data = {
            username: document.getElementById("field-user").value,
            name: document.getElementById("field-user").value,
            email: document.getElementById("field-email").value,
            password: document.getElementById("field-pass").value,
        };
        let areFieldsValid = true;

        // Validate fields
        if (!validatePassword(data.password)) {
            setErr({pass: "Password must have at least 6 characters"});
            areFieldsValid = false;
        }

        if (areFieldsValid) {
            // submit registration request to server
            try {
                await bridge.register(data);

                // successful registration; show the "validate email" modal
                setRegistrationState(RegistrationStates.EMAIL_CONFIRM);
            } catch (err) {
                const response = err.response.data;
                if (response.errorCode === 0) { // invalid field
                    const param = response.field;
                    setErr({[param]: response.description});
                }
            }
        }
    };

    const RegisterForm = () => (
        <>
            <h2>Register</h2>
            < Text variant={'smallPlus'} block>
                Create an account to be able to use the platform
            </Text>

            <form>
                <Stack tokens={{childrenGap: 20}}>
                    <TextField id="field-user" label="Username:" underlined required
                               autoComplete="username" errorMessage={err.username}/>
                    <TextField id="field_name" label="Name:" underlined required
                               autoComplete="name" errorMessage={err.name}/>
                    <TextField id="field-email" label="Email:" underlined required
                               autocomplete="email" errorMessage={err.email}/>
                    <TextField id="field-pass" label="Password:" type="password" underlined required
                               autoComplete="current-password" errorMessage={err.password}/>

                    <Link className={style.smallLink} to="/login" style={{color: palette.themePrimary}}>
                        Already have an account? Log In
                    </Link>

                    <Stack horizontal horizontalAlign="end" tokens={{childrenGap: 20}}>
                        <DefaultButton text="Back" allowDisabledFocus/>
                        <PrimaryButton text="Register" onClick={registerUser} allowDisabledFocus/>
                    </Stack>
                </Stack>
            </form>
        </>
    );

    return (
        <div className={style.flexContainer}>
            <div className={style.box} style={{boxShadow: Depths.depth4}}>
                <Stack className="slideLeft" tokens={{childrenGap: 20}}>
                    {
                        registrationState === RegistrationStates.EMAIL_CONFIRM
                            ? <ValidateEmailBox/>
                            : <RegisterForm/>
                    }
                </Stack>
            </div>
        </div>
    );
}

export {RegisterBox, EmailConfirm};