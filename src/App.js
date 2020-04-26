import React from 'react';
import './App.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import RegisterPanel from "./views/register";
import {createTheme, loadTheme} from "office-ui-fabric-react";
import Navbar from "./views/Navbar";
import CardGrid from "./views/doctors";
import {Footer} from "./views/Footer";
import {GDPRModal} from "./views/gdprModal";
import LoginPanel from "./views/login";


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

class App extends React.Component {
    render() {
        return (
            <>
                <Navbar/>
                <div className="main">
                    <BrowserRouter basename="/">
                        <Switch>
                            <Route path="/login" component={LoginPanel}/>
                            <Route path="/register" component={RegisterPanel}/>
                            <Route path="/doctors" component={CardGrid}/>
                        </Switch>
                    </BrowserRouter>
                </div>
                <Footer/>
                <GDPRModal/>
            </>
        );
    }
}

export default App;
