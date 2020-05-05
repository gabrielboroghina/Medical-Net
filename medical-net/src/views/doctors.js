import * as React from 'react';
import style from '../style.module.scss';
import {useState, useEffect} from "react";
import bridge from "../bridge";
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';

import {
    DocumentCard,
    DocumentCardTitle,
    DocumentCardDetails,
    DocumentCardImage,
    DocumentCardStatus,
    DocumentCardLocation,
} from 'office-ui-fabric-react/lib/DocumentCard';

import {
    IconButton, DefaultButton,
    Text,
    CommandBar,
    ImageFit,
    Rating,
    List,
    Modal,
    getTheme, mergeStyleSets, Separator, MessageBarType, MessageBar,
} from "office-ui-fabric-react";
import {useCookies} from "react-cookie";


const {palette} = getTheme();

const _items = [
    {
        key: 'newItem',
        text: 'New',
        cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
        iconProps: {iconName: 'Add'},
        subMenuProps: {
            items: [
                {
                    key: 'emailMessage',
                    text: 'Email message',
                    iconProps: {iconName: 'Mail'},
                },
                {
                    key: 'calendarEvent',
                    text: 'Calendar event',
                    iconProps: {iconName: 'Calendar'},
                },
            ],
        },
    },
    {
        key: 'upload',
        text: 'Upload',
        iconProps: {iconName: 'Upload'},
        href: 'https://developer.microsoft.com/en-us/fluentui',
    },
    {
        key: 'share',
        text: 'Share',
        iconProps: {iconName: 'Share'},
        onClick: () => console.log('Share'),
    },
    {
        key: 'download',
        text: 'Download',
        iconProps: {iconName: 'Download'},
        onClick: () => console.log('Download'),
    },
];

const _overflowItems = [
    {key: 'move', text: 'Move to...', onClick: () => console.log('Move to'), iconProps: {iconName: 'MoveToFolder'}},
    {key: 'copy', text: 'Copy to...', onClick: () => console.log('Copy to'), iconProps: {iconName: 'Copy'}},
    {key: 'rename', text: 'Rename...', onClick: () => console.log('Rename'), iconProps: {iconName: 'Edit'}},
];

const _farItems = [
    {
        key: 'tile',
        text: 'Grid view',
        // This needs an ariaLabel since it's icon-only
        ariaLabel: 'Grid view',
        iconOnly: true,
        iconProps: {iconName: 'Tiles'},
        onClick: () => console.log('Tiles'),
    },
    {
        key: 'info',
        text: 'Info',
        // This needs an ariaLabel since it's icon-only
        ariaLabel: 'Info',
        iconOnly: true,
        iconProps: {iconName: 'Info'},
        onClick: () => console.log('Info'),
    },
];

const Card = props => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <DocumentCard
                className={style.card}
                styles={{width: props.width, boxShadow: Depths.depth4}}
                onClick={() => setModalOpen(true)}
            >
                <DocumentCardImage height={160} imageFit={ImageFit.contain} imageSrc={props.info.picture_url}/>
                <DocumentCardTitle title={props.info.name} shouldTruncate/>
                <DocumentCardLocation location={props.info.workplace}/>
                <DocumentCardStatus statusIcon="medical" status={props.info.specialty}/>

                <Rating style={{textAlign: "right", marginRight: 10}} id="small"
                        min={1} max={5} rating={(props.info.rating - 7) / 3 * 5} readOnly
                />
            </DocumentCard>

            <DoctorModal info={props.info}
                         open={modalOpen} onDismiss={() => setModalOpen(false)}/>
        </>
    );
};

const DoctorModal = (props) => {
    const [cookies] = useCookies(['user_profile']);
    const [notification, setNotification] = useState([null, null]);
    const theme = getTheme();

    const contentStyles = mergeStyleSets({
        header: [
            theme.fonts.xLargePlus,
            {
                flex: '1 1 auto',
                borderTop: `4px solid ${theme.palette.themePrimary}`,
                color: theme.palette.neutralPrimary,
                display: 'flex',
                alignItems: 'center',
                padding: '12px 12px 14px 24px',
                boxShadow: Depths.depth4,
            },
        ],
    });
    const iconButtonStyles = {
        root: {
            color: theme.palette.neutralPrimary,
            margin: '4px 2px 0 auto',
        },
        rootHovered: {
            color: theme.palette.neutralDark,
        },
    };

    const deleteDoctor = () => {
        bridge.deleteDoctor(props.info.id).then(() => {
            setNotification([MessageBarType.success, 'The doctor was deleted from the database']);
        }).catch(() => {
            setNotification([MessageBarType.severeWarning, 'There was an error processing your request']);
        });
    };

    return (
        <Modal titleAriaId={props.titleId}
               isOpen={props.open}
               onDismiss={props.onDismiss}
               isBlocking={false}
               containerClassName={style.modal}
        >
            <div className={contentStyles.header}>
                <span>{props.info.name}</span>
                <IconButton
                    styles={iconButtonStyles}
                    iconProps={{iconName: "Cancel"}}
                    ariaLabel="Close popup modal"
                    onClick={props.onDismiss}
                />
            </div>
            <div className={style.body}>
                <Text variant={"mediumPlus"}>
                    {props.info.title} <b>{props.info.specialty}</b> - {props.info.workplace}
                </Text>
                <div className={style.cardDetails}>
                    <br/>
                    {props.info.description && props.info.description.split('\n').map((phrase, idx) =>
                        <Text key={idx}>• {phrase}<br/></Text>
                    )}
                </div>
                {
                    cookies['user_profile'] && cookies['user_profile'].role_id === 0 &&
                    <>
                        <div style={{margin: "10px 0"}}>
                            <Separator>Manage</Separator>
                        </div>
                        <DefaultButton iconProps={{iconName: "Delete"}}
                                       onClick={deleteDoctor}
                        >
                            Delete doctor
                        </DefaultButton>
                        {
                            notification[0] &&
                            <div style={{marginTop: 10}}>
                                <MessageBar messageBarType={notification[0]} isMultiline={true}
                                >
                                    {notification[1]}
                                </MessageBar>
                            </div>

                        }
                    </>
                }
            </div>
        </Modal>
    );
};

const ListGrid = (props) => {
    const minCardWidth = 210;
    const ROWS_PER_PAGE = 3;
    let _columnCount, _columnWidth, _rowHeight;

    const _getItemCountForPage = (itemIndex, surfaceRect) => {
        if (itemIndex === 0) {
            _columnCount = Math.floor(surfaceRect.width / minCardWidth);
            _columnWidth = Math.floor(surfaceRect.width / _columnCount);
            _rowHeight = _columnWidth;
        }

        return _columnCount * ROWS_PER_PAGE;
    };

    const _getPageHeight = () => {
        return _rowHeight * ROWS_PER_PAGE;
    };

    const _onRenderCell = (item, index) => {
        return (
            <div className={style.listGridTile}
                 style={{width: Math.floor(100 / _columnCount) + '%'}}
            >
                <div className={style.pad}>
                    {item}
                </div>
            </div>
        );
    };

    return (
        <List className={style.listGrid}
              items={props.items}
              getItemCountForPage={_getItemCountForPage}
              getPageHeight={_getPageHeight}
              renderedWindowsAhead={4}
              onRenderCell={_onRenderCell}
        />
    );
};

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);

    async function fetchData() {
        // fetch doctors information from server
        const doctors = await bridge.getDoctors();

        for (const doctor of doctors)
            doctor.showDetails = false;
        setDoctors(doctors);
    }

    useEffect(() => {
        fetchData().catch(err => console.error(err));
    }, []);

    return (
        <div className={style.flexContainer}>
            <div className={style.cardGridContainer} style={{backgroundColor: palette.neutralLighter}}>
                <CommandBar
                    style={{boxShadow: Depths.depth8}}
                    items={_items}
                    overflowItems={_overflowItems}
                    farItems={_farItems}
                />
                <ListGrid items={doctors.map(doctor =>
                    <Card info={doctor}/>
                )}/>
            </div>
        </div>
    );
};

export default Doctors;