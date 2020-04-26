import React, {useState} from 'react';
import '../App.css';
import {Link} from 'react-router-dom';

import {
    Text,
    DefaultButton, PrimaryButton,
    Stack,
    TextField,
    getTheme,
} from 'office-ui-fabric-react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';


function RegisterPanel() {
    const {palette} = getTheme();
    const [state, setState] = useState({passErr: ""});

    const validatePassword = password => {
        return password.length >= 6;
    };

    const registerUser = () => {
        const data = {
            username: document.getElementById("field-user").value,
            name: document.getElementById("field-user").value,
            email: document.getElementById("field-email").value,
            password: document.getElementById("field-pass").value,
        };
        let areFieldsValid = true;

        // Validate fields
        if (!validatePassword(data.password)) {
            setState({passErr: "Password must have at least 6 characters"});
            areFieldsValid = false;
        }

        if (areFieldsValid) {
            //TODO Submit registration request to server
            console.log(data);
            // const response = await axios.post(
            //     '',
            //     { example: 'data' },
            //     { headers: { 'Content-Type': 'application/json' } }
            // );
        }
    };

    return (
        <div className="login"
             style={{
                 boxShadow: Depths.depth4
             }}>
            <Stack className="slide" tokens={{childrenGap: 20}}>
                <h2>Register</h2>
                <Text variant={'smallPlus'} block>
                    Create an account to be able to use the platform
                </Text>

                <form>
                    <Stack tokens={{childrenGap: 20}}>
                        <TextField id="field-user" label="Username:" underlined required autoComplete="username"/>
                        <TextField id="field_name" label="Name:" underlined required autoComplete="name"/>
                        <TextField id="field-email" label="Email:" underlined required autocomplete="email"/>
                        <TextField id="field-pass" label="Password:" type="password" autoComplete="current-password"
                                   errorMessage={state.passErr} underlined required/>

                        <Link className="small-link" to="/login" style={{color: palette.themePrimary}}>
                            Already have an account? Log In
                        </Link>

                        <Stack horizontal horizontalAlign="end" tokens={{childrenGap: 20}}>
                            <DefaultButton text="Back" allowDisabledFocus/>
                            <PrimaryButton text="Register" onClick={registerUser} allowDisabledFocus/>
                        </Stack>
                    </Stack>
                </form>
            </Stack>
        </div>
    );
}

export default RegisterPanel;