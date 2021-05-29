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
            <h2>Pending administrator approval</h2>
            <Text variant={'medium'} block>
                A registration request was sent to the platform administrator. You will receive a email when your account will be activated.
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
                    <h2>Account activated</h2>
                    <Text variant={'medium'} block>
                        The account was successfully activated. A confirmation email was sent to the user.
                    </Text>
                    <br/>
                </Stack>
            </div>
        </div>
    );
};

function RegisterBox() {
    const {palette} = getTheme();
    const [err, setErr] = useState({username: "", name: "", email: "", password: ""});
    const [values, setValues] = useState({username: "", name: "", email: "", password: ""});
    const [registrationState, setRegistrationState] = useState(RegistrationStates.DATA_FORM);

    const validatePassword = password => {
        if (password.length < 6) {
            return "Password must have at least 6 characters";
        } else if (password.search(/\d/) === -1) {
            return "Password must contain at least one digit";
        } else if (password.search(/[a-zA-Z]/) === -1) {
            return "Password must contain at least one letter";
        } else if (password.search(/[^a-zA-Z0-9!@#$%^&*()_+]/) !== -1) {
            return "Password contains invalid characters";
        }
        return null;
    };

    const areFieldsValid = (data) => {
        // Validate fields
        if (!(data.username && data.name && data.email && data.password)) {
            setErr({password: "Some required fields are empty"});
            return false;
        }

        const passError = validatePassword(data.password);
        if (passError) {
            setErr({password: passError});
            return false;
        }
        return true;
    };

    const registerUser = async () => {
        const data = {
            username: document.getElementById("field-user").value,
            name: document.getElementById("field-name").value,
            email: document.getElementById("field-email").value,
            password: document.getElementById("field-pass").value,
        };
        setValues(data);

        if (areFieldsValid(data)) {
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
                    <TextField id="field-user" label="Username:" autoFocus
                               underlined required defaultValue={values.username}
                               autoComplete="username" errorMessage={err.username}/>
                    <TextField id="field-name" label="Name:"
                               underlined required defaultValue={values.name}
                               autoComplete="name" errorMessage={err.name}/>
                    <TextField id="field-email" label="Email:"
                               underlined required defaultValue={values.email}
                               autocomplete="email" errorMessage={err.email}/>
                    <TextField id="field-pass" label="Password:" type="password"
                               underlined required defaultValue={values.password}
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