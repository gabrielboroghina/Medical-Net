import * as React from 'react';
import {useState} from "react";
import {useCookies} from 'react-cookie';

import {
    Stack, Dialog, DialogType, DialogFooter,
    PrimaryButton, DefaultButton, Checkbox
} from "office-ui-fabric-react";

const GDPRModal = props => {
    const [hidden, setHidden] = useState(!props.show);
    const [, setCookie] = useCookies();

    const acceptCookies = () => {
        const acceptedCookies = {
            necessary: document.getElementById("check-necessary").checked,
            preferences: document.getElementById("check-preferences").checked,
            analytics: document.getElementById("check-analytics").checked,
        };

        setCookie('cookie_consent', acceptedCookies);
        setHidden(true);
    };

    return (
        <Dialog hidden={hidden}
                onDismiss={() => setHidden(true)}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: 'Cookies and Privacy Policy',
                    subText: 'We use cookies to enhance your experience on the platform. ' +
                        'Select below the cookies that you accept:',
                }}
        >
            <Stack tokens={{childrenGap: 10}}>
                <Checkbox label="Necessary" id="check-necessary" defaultChecked disabled/>
                <Checkbox label="Preferences" id="check-preferences" defaultChecked/>
                <Checkbox label="Analytics" id="check-analytics" defaultChecked/>
            </Stack>
            <br/>
            <DialogFooter>
                <PrimaryButton onClick={acceptCookies} text="Accept cookies"/>
                <DefaultButton onClick={() => setHidden(true)} text="Decline"/>
            </DialogFooter>
        </Dialog>
    )
};

export default GDPRModal;