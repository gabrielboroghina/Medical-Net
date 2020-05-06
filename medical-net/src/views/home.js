import * as React from 'react';
import {useState, useEffect} from 'react';
import style from "../style.module.scss";


import {
    PrimaryButton,
    Text,
    Stack,
    getTheme, Image, ImageFit, FontIcon
} from 'office-ui-fabric-react';
import {Depths} from "@uifabric/fluent-theme";


const Home = (props) => {
    const {palette} = getTheme();

    return (
        <div className={style.flexContainer}>
            <div className={style.homeContent} style={{backgroundColor: palette.neutralLighter}}>
                <img src={require('../res/record3.png')} alt=""/>

                <div className={style.heading}>
                    <h3>One platform. All your medical history, securely accessible from everywhere</h3>
                </div>

                <div className={style.row}>
                    <div className={style.col}>
                        <div className={style.card} style={{boxShadow: Depths.depth8}}>
                            <FontIcon iconName="ProfileSearch" className={style.icon}/>
                            <p>
                                Find the best doctor to your needs. Explore doctors by specialty or hospital, together
                                with their ratings
                            </p>
                        </div>
                    </div>
                    <div className={style.col}>
                        <div className={style.card} style={{boxShadow: Depths.depth8}}>
                            <FontIcon iconName="DataConnectionLibrary" className={style.icon}/>
                            <p>
                                Store all your medical history in a safe place, accessible only to you and to your
                                doctors
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
