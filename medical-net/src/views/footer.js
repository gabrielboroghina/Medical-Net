import * as React from 'react';
import style from '../style.module.scss';
import {getTheme} from "office-ui-fabric-react/lib/Styling";
import {strings} from '../strings';
import {Link} from "office-ui-fabric-react";
import {withTranslation} from "react-i18next";


const Footer = props => {
    const {t} = props;
    const {palette} = getTheme();

    return (
        <div className={style.footer} style={{backgroundColor: palette.neutralLighter}}>
            <div className={style.centerBox}>
                <div className={style.column}>
                    <h3>{strings.appName}</h3>
                    <p>
                        Copyright &copy; {new Date().getFullYear()} {strings.appName}. {t('footer.rights_reserved')}
                    </p>
                </div>
                <div className={style.column}>
                    <h5 style={{marginBottom: 5}}>Contact</h5>
                    <p style={{fontSize: "small"}}>
                        Email: <Link href={'mailto:' + strings.mail}>{strings.mail}</Link>
                        <br/>
                        Tel: <Link href={'tel:' + strings.phone}>{strings.phone}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default withTranslation('translations')(Footer);