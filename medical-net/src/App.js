import React from 'react';
import './App.scss';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import {RegisterBox, EmailConfirm} from "./views/register";
import {createTheme, loadTheme} from "office-ui-fabric-react";
import {useCookies} from 'react-cookie';
import Navbar from "./views/Navbar";
import Doctors from "./views/doctors";
import {Footer} from "./views/Footer";
import {GDPRModal} from "./views/gdprModal";
import LoginPanel from "./views/login";
import Faq from "./views/faq";
import NotFound from "./views/not-found";
import MessagesManagementBoard from "./views/support-dashboard";


const customTheme = createTheme({
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
loadTheme(customTheme);

const ProtectedRoute = ({children, allowedRoles, ...rest}) => {
    const [cookies] = useCookies(['user_profile']);
    const userProfile = cookies['user_profile'];

    return (
        <Route {...rest}
               render={({location}) =>
                   userProfile && allowedRoles.includes(userProfile.role_id)
                       ? (children)
                       : (<Redirect
                           to={{
                               pathname: "/not-found",
                               state: {from: location}
                           }}
                       />)
               }
        />
    );
};

const App = () => {
    const [cookies] = useCookies(['user_profile']);

    // get session information
    const cookieConsent = cookies['cookie_consent'];
    const userProfile = cookies['user_profile'];

    return (
        <BrowserRouter basename="/">
            <Navbar user={userProfile}/>

            <Switch>
                <Route path="/not-found" component={NotFound}/>
                <Route path="/login" component={LoginPanel}/>
                <Route path="/register" component={RegisterBox}/>
                <ProtectedRoute path="/doctors" allowedRoles={[0, 1, 2]}>
                    <Doctors/>
                </ProtectedRoute>
                <Route path="/emailconfirmed" component={EmailConfirm}/>
                <Route path="/faq" component={Faq}/>
                <ProtectedRoute path="/support-dashboard" allowedRoles={[0, 1]}>
                    <MessagesManagementBoard/>
                </ProtectedRoute>
            </Switch>
            <Footer/>
            <GDPRModal show={!cookieConsent}/>
        </BrowserRouter>
    );
};

export default App;
