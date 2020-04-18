import * as React from 'react';
import {
    Stack, Dialog, DialogType, DialogFooter,
    PrimaryButton, DefaultButton, Checkbox
} from "office-ui-fabric-react";
import {useState} from "react";

export const GDPRModal = () => {
    const [hidden, setHidden] = useState(false);

    const getAcceptedCookies = () => {

    };

    return (
        <Dialog
            hidden={hidden}
            onDismiss={() => setHidden(true)}
            dialogContentProps={{
                type: DialogType.normal,
                title: 'Cookies and Privacy Policy',
                subText: 'We use cookies to enhance your experience on the platform. ' +
                    'Select below the cookies that you accept:',
            }}
        >
            <Stack tokens={{childrenGap: 10}}>
                <Checkbox label="Necessary" defaultChecked/>
                <Checkbox label="Preferences"/>
                <Checkbox label="Analytics"/>
            </Stack>
            <br/>
            <DialogFooter>
                <PrimaryButton onClick={getAcceptedCookies} text="Submit"/>
                <DefaultButton onClick={() => setHidden(true)} text="Don't accept any"/>
            </DialogFooter>
        </Dialog>
    )
};