import * as React from 'react';
import styles from './style.module.scss';
import {getTheme} from "office-ui-fabric-react/lib/Styling";
import {strings} from './strings';
import {Link} from "office-ui-fabric-react";

const {palette} = getTheme();

export const Footer = props => {
    return (
        <div className={styles.footer} style={{backgroundColor: palette.neutralLighter}}>
            <div className={styles.centerBox}>
                <div className={styles.info}>
                    <h3>{strings.appName}</h3>
                    <p>
                        Copyright &copy; {new Date().getFullYear()} MedicalNet. All rights reserved.
                    </p>
                </div>
                <div className={styles.contact}>
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