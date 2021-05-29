import * as React from 'react';
import style from "../style.module.scss";

import {
    getTheme, FontIcon
} from 'office-ui-fabric-react';
import {Depths} from "@uifabric/fluent-theme";

import {withTranslation} from 'react-i18next';

const Home = (props) => {
    const {t} = props;
    const {palette} = getTheme();

    return (
        <div className={style.flexContainer}>
            <div className={style.homeContent} style={{backgroundColor: palette.neutralLighter}}>
                <div className={style.placeholder}>
                    <img src={require('../res/record4.jpg')} alt=""/>
                </div>

                <div className={style.heading}>
                    <h3>{t('home.heading')}</h3>
                </div>

                <div className={style.row}>
                    <div className={style.col}>
                        <div className={style.card} style={{boxShadow: Depths.depth8}}>
                            <FontIcon iconName="ProfileSearch" className={style.icon}/>
                            <p>{t('home.feature1')}</p>
                        </div>
                    </div>
                    <div className={style.col}>
                        <div className={style.card} style={{boxShadow: Depths.depth8}}>
                            <FontIcon iconName="DataConnectionLibrary" className={style.icon}/>
                            <p>{t('home.feature2')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withTranslation('translations')(Home);
