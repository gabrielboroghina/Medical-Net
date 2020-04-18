import * as React from 'react';
import './App.css';

import {
    DefaultButton, PrimaryButton,
    Stack,
    TextField,
    createTheme, Customizations,
    Link
} from 'office-ui-fabric-react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';

const myTheme = createTheme({
    palette: {
        themePrimary: '#780b1c',
        themeLighterAlt: '#faf1f2',
        themeLighter: '#e9c7cc',
        themeLight: '#d69ca5',
        themeTertiary: '#ae4f5d',
        themeSecondary: '#881b2b',
        themeDarkAlt: '#6c0a18',
        themeDark: '#5b0815',
        themeDarker: '#43060f',
        neutralLighterAlt: '#faf9f8',
        neutralLighter: '#f3f2f1',
        neutralLight: '#edebe9',
        neutralQuaternaryAlt: '#e1dfdd',
        neutralQuaternary: '#d0d0d0',
        neutralTertiaryAlt: '#c8c6c4',
        neutralTertiary: '#a19f9d',
        neutralSecondary: '#605e5c',
        neutralPrimaryAlt: '#3b3a39',
        neutralPrimary: '#323130',
        neutralDark: '#201f1e',
        black: '#000000',
        white: '#ffffff',
    }
});

const LoginPanel = props => {

    const authenticateUser = () => {

    };

    Customizations.applySettings({theme: myTheme});

    return (
        <div className="login-panel" style={{boxShadow: Depths.depth4}}>
            <Stack tokens={{childrenGap: 20}}>
                <h2>Sign In</h2>
                <TextField label="Username:" underlined/>
                <TextField label="Password:" underlined/>
                <Link href="" className="small-link">Don't have an account?</Link>

                <Stack horizontal horizontalAlign="end" tokens={{childrenGap: 20}}>
                    <DefaultButton text="Back" allowDisabledFocus/>
                    <PrimaryButton text="Sign in" onClick={authenticateUser} allowDisabledFocus/>
                </Stack>
            </Stack>
        </div>
    );
};

export default LoginPanel;

// ReactDOM.render(<LoginPanel/>, document.getElementById("root"));