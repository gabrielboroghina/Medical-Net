import * as React from 'react';
import '../App.scss';
import style from '../style.module.scss';
import {Link, useHistory} from 'react-router-dom';

import {
    Stack, Text,
    Persona, PersonaSize, Callout, DefaultButton, ActionButton, CommandBarButton,
    initializeIcons, ContextualMenuItemType,
} from 'office-ui-fabric-react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import {useConst, useConstCallback} from '@uifabric/react-hooks';
import {useCookies} from "react-cookie";


initializeIcons();

const Navbar = props => {
    const [showCallout, setShowCallout] = React.useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['user_profile']);
    const history = useHistory();

    const onShowCallout = useConstCallback(() => setShowCallout(true));
    const onHideCallout = useConstCallback(() => setShowCallout(false));

    const signOut = () => {
        removeCookie('access_token');
        removeCookie('user_profile');
        history.push('/');
    };

    const persona = props.user ? {
        imageInitials: props.user.name
            .split(' ')
            .map(token => token[0])
            .join('')
            .substr(0, 2)
            .toUpperCase(),
        text: props.user.name,
        secondaryText: props.user.email,
    } : null;

    const menuItems = useConst([
        {
            key: 'divider_1',
            itemType: ContextualMenuItemType.Divider,
        },
        {
            key: 'signout',
            iconProps: {
                iconName: 'UserRemove',
                style: {
                    color: 'salmon',
                },
            },
            text: 'Sign out',
            onClick: signOut
        },
    ]);

    const renderMenuList = useConstCallback((menuListProps, defaultRender) => {
        return (
            <>
                <div className={style.accountBox}>
                    <h4>{props.user.name}</h4>
                    <Text><b>Email:</b> {props.user.email}</Text>
                </div>
                {defaultRender(menuListProps)}
            </>
        );
    });

    const menuProps = useConst({
        shouldFocusOnMount: true,
        items: menuItems,
        onRenderMenuList: renderMenuList,
    });

    return (
        <div className={style.nav} style={{boxShadow: Depths.depth16}}>
            <Stack className={style.nav} horizontal tokens={{childrenGap: 20}}>
                <div className={style.logo}>
                    <img src={require('../res/logo.png')} alt="MedicalNet logo" style={{height: 50}}/>
                </div>

                <div className={style.verticalSeparator}/>
                <Link className={style.link} to={"/doctors"}>
                    <Text variant={"mediumPlus"}>Doctors</Text>
                </Link>
                <Link className={style.link} to={"/faq"}>
                    <Text variant={"mediumPlus"}>FAQ</Text>
                </Link>
            </Stack>

            <Stack className={style.stack} horizontal horizontalAlign="end">
                {
                    props.user
                        ?
                        <CommandBarButton className={style.personaBtn} menuProps={menuProps}>
                            <Persona{...persona}
                                    size={PersonaSize.size32}
                                    hidePersonaDetails={false}
                                    imageAlt=""
                            />
                        </CommandBarButton>
                        :
                        <Link to={'/login'}>
                            <ActionButton iconProps={{iconName: 'Signin'}} className={style.personaBtnSimple}>
                                Sign in
                            </ActionButton>
                        </Link>
                }

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