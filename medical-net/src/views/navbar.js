import * as React from 'react';
import '../App.scss';
import style from '../style.module.scss';
import {Link, useHistory} from 'react-router-dom';

import {
    Stack, Text,
    Persona, PersonaSize, ActionButton, CommandBarButton,
    initializeIcons, ContextualMenuItemType, IconButton,
} from 'office-ui-fabric-react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import {useCookies} from "react-cookie";


initializeIcons();

const Navbar = props => {
    const [cookies, setCookie, removeCookie] = useCookies(['user_profile']);
    const history = useHistory();

    const userProfile = cookies['user_profile'];

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

    const menuItems = [
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
    ];

    const renderMenuList = (menuListProps, defaultRender) => {
        return (
            <>
                <div className={style.accountBox}>
                    <h4>{props.user.name}</h4>
                    <Text><b>Email:</b> {props.user.email}</Text>
                </div>
                {defaultRender(menuListProps)}
            </>
        );
    };

    const personaMenu = {
        shouldFocusOnMount: true,
        items: menuItems,
        onRenderMenuList: renderMenuList,
    };

    const menuProps = {
        items: [
            {
                key: 'link0',
                text: 'Home',
                onClick: () => {
                    history.push('/')
                }
            },
            {
                key: 'link1',
                text: 'Doctors',
                onClick: () => {
                    history.push('/doctors')
                }
            },
            {
                key: 'link2',
                text: 'FAQ',
                onClick: () => {
                    history.push('/faq')
                }
            },
        ],
        directionalHintFixed: true,
    };

    return (
        <div className={style.nav} style={{boxShadow: Depths.depth16}}>
            <IconButton className={style.hamburgerMenu}
                        iconProps={{iconName: "GlobalNavButton"}}
                        menuProps={menuProps}
                        onRenderMenuIcon={() => {
                        }}
                        style={{height: "100%"}}
            />
            <div className={style.logo}>
                <img src={require('../res/logo.png')} alt="MedicalNet logo" style={{height: 50}}/>
            </div>
            <Stack className={style.navMenu} horizontal tokens={{childrenGap: 20}}>
                <div className={style.verticalSeparator}/>
                <Link className={style.link} to={"/"}>
                    <Text variant={"mediumPlus"}>Home</Text>
                </Link>
                {
                    userProfile &&
                    <Link className={style.link} to={"/doctors"}>
                        <Text variant={"mediumPlus"}>Doctors</Text>
                    </Link>
                }
                <Link className={style.link} to={"/faq"}>
                    <Text variant={"mediumPlus"}>FAQ</Text>
                </Link>
            </Stack>

            <Stack className={style.stack} horizontal horizontalAlign="end">
                {
                    props.user
                        ?
                        <CommandBarButton className={style.personaBtn}
                                          menuProps={personaMenu}
                                          onRenderMenuIcon={() => {
                                          }}
                        >
                            <Persona{...persona}
                                    size={PersonaSize.size32}
                                    hidePersonaDetails={false}
                            />
                        </CommandBarButton>
                        :
                        <Link to={'/login'}>
                            <ActionButton iconProps={{iconName: 'Signin'}} className={style.personaBtnSimple}>
                                Sign in
                            </ActionButton>
                        </Link>
                }
            </Stack>
        </div>
    );
};

export default Navbar;