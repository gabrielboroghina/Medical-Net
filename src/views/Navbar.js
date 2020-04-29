import * as React from 'react';
import '../App.scss';
import style from '../style.module.scss';
import {Link, BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {
    Stack,
    Persona, PersonaSize, Callout, DefaultButton, CommandBarButton,
    initializeIcons, ContextualMenuItemType, Text,
} from 'office-ui-fabric-react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import {useConst, useConstCallback} from '@uifabric/react-hooks';


initializeIcons();

const Navbar = props => {

    const persona = {
        imageInitials: 'GB',
        text: 'Gabriel',
        secondaryText: 'Software Engineer',
        tertiaryText: 'In a meeting',
        optionalText: 'Available at 4:00pm',
    };

    const [showCallout, setShowCallout] = React.useState(false);

    const onShowCallout = useConstCallback(() => setShowCallout(true));
    const onHideCallout = useConstCallback(() => setShowCallout(false));

    const menuItems = useConst([
        {
            key: 'upload',
            onClick: onShowCallout,
            iconProps: {
                iconName: 'Upload',
                style: {
                    color: 'salmon',
                },
            },
            text: 'Upload (Click for popup)',
        },
        {
            key: 'divider_1',
            itemType: ContextualMenuItemType.Divider,
        },
        {
            key: 'signout',
            iconProps: {
                iconName: 'UserRemove',
            },
            text: 'Sign out',
        },
    ]);

    const menuProps = useConst({
        shouldFocusOnMount: true,
        items: menuItems,
    });

    return (
        <div className="navbar" style={{boxShadow: Depths.depth16}}>
            <Stack className="navbar-nav" horizontal tokens={{childrenGap: 20}}>
                <div className={style.logo}>
                    <img src={require('../res/logo.png')} alt="MedicalNet logo" style={{height: 50}}/>
                </div>

                <div className="vertical-separator"/>

                <Link className="nav-link" to={"/doctors"}>
                    <Text variant={"mediumPlus"}>Doctors</Text>
                </Link>
                <Link className="nav-link" to={"/faq"}>
                    <Text variant={"mediumPlus"}>FAQ</Text>
                </Link>
            </Stack>

            <Stack className="navbar-stack" horizontal horizontalAlign="end">
                <CommandBarButton className="persona-btn" menuProps={menuProps}>
                    <Persona
                        {...persona}
                        size={PersonaSize.size32}
                        hidePersonaDetails={false}
                        imageAlt="Annie Lindqvist, status is online"
                    />
                </CommandBarButton>

                {showCallout && (
                    <Callout setInitialFocus={true} onDismiss={onHideCallout}>
                        <DefaultButton onClick={onHideCallout} text="Hello Popup"/>
                    </Callout>
                )}
            </Stack>
        </div>
    );
};

export default Navbar;