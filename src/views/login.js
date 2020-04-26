import * as React from 'react';
import '../App.css';
import {Link} from 'react-router-dom';


import {
    DefaultButton, PrimaryButton,
    Stack,
    TextField,
    getTheme
} from 'office-ui-fabric-react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';


const LoginPanel = props => {
    const {palette} = getTheme();

    const authenticateUser = () => {

    };

    return (
        <div className="login" style={{boxShadow: Depths.depth4}}>
            <Stack className="slide" tokens={{childrenGap: 20}}>
                <h2>Sign In</h2>
                <form>
                    <Stack tokens={{childrenGap: 20}}>
                        <TextField label="Username:" underlined autoComplete="username"/>
                        <TextField label="Password:" underlined autoComplete="current-password"/>
                        <Link className="small-link" to="/register" style={{color: palette.themePrimary}}>
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
    );
};

export default LoginPanel;
