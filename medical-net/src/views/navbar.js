import * as React from 'react';
import style from '../style.module.scss';
import {Link, useHistory} from 'react-router-dom';
import Flag from "react-world-flags";

import {
    Stack, Text,
    Persona, PersonaSize, ActionButton, CommandBarButton,
    initializeIcons, ContextualMenuItemType, IconButton,
} from 'office-ui-fabric-react';
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import {useCookies} from "react-cookie";
import {withTranslation} from "react-i18next";


initializeIcons();

const Navbar = props => {
    const {t} = props;
    const [, , removeCookie] = useCookies(['user_profile']);
    const [cookies, setCookie,] = useCookies(['locale']);
    let locale = cookies['locale'];
    const history = useHistory();

    if (!locale) {
        setCookie("locale", "en");
    }

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
            text: t('sign_out'),
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
                text: t('nav.home'),
                onClick: () => history.push('/')
            },
            ...(props.user ? [{
                key: 'link2',
                text: t('nav.doctors'),
                onClick: () => history.push('/doctors')
            }] : []),
            ...(props.user && [2, 3].includes(props.user.role_id) ? [{
                key: 'link3',
                text: 'Medical Records',
                onClick: () => history.push('/medical-records')
            }] : []),
            {
                key: 'link1',
                text: 'FAQ',
                onClick: () => history.push('/faq')
            },
            ...(props.user && [0, 1].includes(props.user.role_id) ? [{
                key: 'link4',
                text: 'Dashboard',
                onClick: () => history.push('/support-dashboard')
            }] : []),
        ],
        directionalHintFixed: true,
    };

    const switchLang = () => {
        const {i18n} = props;
        const newLocale = locale === "en" ? "ro" : "en";

        i18n.changeLanguage(newLocale);
        setCookie('locale', newLocale);
    }

    return (
        <div className={style.nav} style={{boxShadow: Depths.depth16}}>
            <IconButton className={style.hamburgerMenu}
                        iconProps={{iconName: "GlobalNavButton"}}
                        menuProps={menuProps}
                        onRenderMenuIcon={() => {
                        }}
            />
            <div className={style.logo}>
                <Link to={'/'}>
                    <img src={require('../res/logo.png')} alt="MedicalNet logo"/>
                </Link>
            </div>
            <Stack className={style.navMenu} horizontal tokens={{childrenGap: 20}}>
                <div className={style.verticalSeparator}/>
                <Link className={style.link} to={"/"}>
                    <Text variant={"mediumPlus"}>{t('nav.home')}</Text>
                </Link>
                {
                    props.user &&
                    <Link className={style.link} to={"/doctors"}>
                        <Text variant={"mediumPlus"}>{t('nav.doctors')}</Text>
                    </Link>
                }
                {
                    props.user && [2, 3].includes(props.user.role_id) &&
                    <Link className={style.link} to={"/medical-records"}>
                        <Text variant={"mediumPlus"}>{t('nav.medical_records')}</Text>
                    </Link>
                }
                <Link className={style.link} to={"/faq"}>
                    <Text variant={"mediumPlus"}>{t('nav.faq')}</Text>
                </Link>
                {
                    props.user && [0, 1].includes(props.user.role_id) &&
                    <Link className={style.link} to={"/support-dashboard"}>
                        <Text variant={"mediumPlus"}>{t('nav.dashboard')}</Text>
                    </Link>
                }
            </Stack>

            <Stack className={style.stack} horizontal horizontalAlign="end">
                <CommandBarButton className={style.flag} onClick={switchLang}>
                    <Flag code={locale === "en" ? "ro" : "gb"} height="20" width="20"/>
                </CommandBarButton>
                {
                    props.user
                        ?
                        <CommandBarButton className={style.personaBtn}
                                          menuProps={personaMenu}
                                          onRenderMenuIcon={() => {
                                          }}
                        >
                            <Persona className={style.personaExtended} {...persona} size={PersonaSize.size32}
                                     hidePersonaDetails={false}/>
                            <Persona className={style.personaCompact} {...persona} size={PersonaSize.size32}
                                     hidePersonaDetails={true}/>
                        </CommandBarButton>
                        :
                        <Link to={'/login'}>
                            <ActionButton iconProps={{iconName: 'Signin'}} className={style.signinBtn}>
                                Sign in
                            </ActionButton>
                        </Link>
                }
            </Stack>
        </div>
    );
};

export default withTranslation('translations')(Navbar);