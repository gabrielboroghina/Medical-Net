import * as React from 'react';
import style from '../style.module.scss';
import {useState, useEffect, useCallback} from "react";
import bridge from "../bridge";
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';

import {
    DocumentCard,
    DocumentCardTitle,
    DocumentCardImage,
    DocumentCardStatus,
    DocumentCardLocation,
} from 'office-ui-fabric-react/lib/DocumentCard';

import {
    IconButton, DefaultButton, PrimaryButton, SpinButton,
    Text, TextField,
    CommandBar,
    ImageFit,
    Rating,
    Modal, Stack,
    getTheme,
    mergeStyleSets,
    MessageBarType, MessageBar,
    ComboBox, Label
} from "office-ui-fabric-react";


const {palette} = getTheme();

const Card = props => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <DocumentCard className={style.card}
                          styles={{boxShadow: Depths.depth4}}
                          onClick={() => setModalOpen(true)}
            >
                <DocumentCardImage height={160} imageFit={ImageFit.contain} imageSrc={props.info.doctor.picture_url}/>
                <DocumentCardTitle title={props.info.doctor.name} shouldTruncate/>
                <DocumentCardLocation
                    location={props.info.hospitals.filter(h => h.id === props.info.doctor.workplace)[0].name}/>
                <DocumentCardStatus statusIcon="medical"
                                    status={props.info.specialties.filter(spec => spec.id === props.info.doctor.specialty)[0].name}/>

                <Rating style={{textAlign: "right", marginRight: 10}} id="small"
                        min={1} max={5} rating={(props.info.doctor.rating - 7) / 3 * 5} readOnly
                />
            </DocumentCard>

            <DoctorModal info={props.info} user={props.user} updateCallback={props.updateCallback}
                         open={modalOpen} onDismiss={() => setModalOpen(false)}/>
        </>
    );
};

const DoctorModal = (props) => {
    const theme = getTheme();
    const [notification, setNotification] = useState([null, null]);
    const [selectedSpec, setSelectedSpec] = useState([
        props.info.doctor.specialty,
        props.info.specialties.filter(spec => spec.id === props.info.doctor.specialty)[0].name
    ]);
    const [selectedWorkplace, setSelectedWorkplace] = useState([
        props.info.doctor.workplace,
        props.info.hospitals.filter(h => h.id === props.info.doctor.workplace)[0].name
    ]);

    const onChangeSpecialty = useCallback((ev, option, index, value) =>
        setSelectedSpec([option?.key, value]), [setSelectedSpec]
    );
    const onChangeWorkplace = useCallback((ev, option, index, value) =>
        setSelectedWorkplace([option?.key, value]), [setSelectedWorkplace]
    );

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
        bridge.deleteDoctor(props.info.doctor.id).then(() => {
            setNotification([MessageBarType.success, 'The doctor was deleted from the database']);
        }).catch(() => {
            setNotification([MessageBarType.severeWarning, 'There was an error processing your request']);
        });
    };

    const updateDoctorInfo = () => {
        const newDetails = {
            name: document.getElementById("field-name").value,
            title: document.getElementById("field-title").value,
            specialty: selectedSpec[0] || selectedSpec[1],
            workplace: selectedWorkplace[0] || selectedWorkplace[1],
            description: document.getElementById("field-description").value,
            picture_url: document.getElementById("field-photo").value,
            rating: document.getElementById("field-rating").childNodes[0].value,
        };

        bridge.updateDoctorInfo(props.info.doctor.id, newDetails).then(() => {
            setNotification([MessageBarType.success, 'Doctor\'s details were updated']);
            props.updateCallback(); // update the data in the main page (doctor cards)
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
               allowTouchBodyScroll={true}
        >
            <div className={contentStyles.header}>
                {
                    props.user.role_id === 0
                        ? <TextField id="field-name" label="Name:" underlined defaultValue={props.info.doctor.name}/>
                        : <span>{props.info.doctor.name}</span>
                }
                <IconButton styles={iconButtonStyles}
                            iconProps={{iconName: "Cancel"}}
                            ariaLabel="Close popup modal"
                            onClick={props.onDismiss}
                />
            </div>
            <div className={style.body}>
                {
                    props.user.role_id === 0
                        ? <Stack tokens={{childrenGap: 10}}>
                            <TextField id="field-title" label="Title:" defaultValue={props.info.doctor.title}
                                       underlined
                            />
                            <div style={{display: "flex"}}>
                                <Label className={style.inlineLabel}>Specialty:</Label>
                                <ComboBox id="field-spec" style={{flex: 1}} allowFreeform
                                          text={selectedSpec[1]}
                                          selectedKey={selectedSpec[0]}
                                          onChange={onChangeSpecialty}
                                          options={props.info.specialties.map(spec => ({key: spec.id, text: spec.name}))}
                                />
                            </div>
                            <div style={{display: "flex"}}>
                                <Label className={style.inlineLabel}>Hospital:</Label>
                                <ComboBox id="field-workplace" style={{flex: 1}} allowFreeform
                                          text={selectedWorkplace[1]}
                                          selectedKey={selectedWorkplace[0]}
                                          onChange={onChangeWorkplace}
                                          options={props.info.hospitals.map(h => ({key: h.id, text: h.name}))}
                                />
                            </div>
                        </Stack>
                        : <Text variant={"mediumPlus"}>
                            {props.info.doctor.title} <b>{props.info.doctor.specialty}</b> - {props.info.doctor.workplace}
                        </Text>
                }

                <div className={style.cardDetails}>
                    <br/>
                    {
                        props.user.role_id === 0
                            ?
                            <Stack tokens={{childrenGap: 10}}>
                                <TextField id="field-description" label="Description:"
                                           defaultValue={props.info.doctor.description}
                                           underlined multiline autoAdjustHeight resizable={false}
                                />
                                <TextField id="field-photo" label="Photo url:"
                                           defaultValue={props.info.doctor.picture_url}
                                           underlined
                                />
                                <div style={{display: "flex"}}>
                                    <Label className={style.inlineLabel}>Rating:</Label>
                                    <SpinButton style={{flex: 1}} id="field-rating"
                                                min={0} max={10} step={0.1} defaultValue={props.info.doctor.rating}
                                    />
                                </div>
                            </Stack>
                            : props.info.doctor.description &&
                            props.info.doctor.description.split('\n').map((phrase, idx) =>
                                <Text key={idx}>• {phrase}<br/></Text>
                            )
                    }
                </div>
                {
                    props.user && props.user.role_id === 0 &&
                    <>
                        <div style={{paddingBottom: 10}}/>
                        <Stack horizontal tokens={{childrenGap: 20}}>
                            <PrimaryButton iconProps={{iconName: "Save"}} onClick={updateDoctorInfo}>
                                Update information
                            </PrimaryButton>
                            <DefaultButton iconProps={{iconName: "Delete"}} onClick={deleteDoctor}>
                                Delete doctor
                            </DefaultButton>
                        </Stack>
                        {
                            notification[0] &&
                            <div style={{marginTop: 10}}>
                                <MessageBar messageBarType={notification[0]} isMultiline={true}>
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

const Doctors = (props) => {
    const [[doctors, specialties, hospitals], setItems] = useState([[], [], []]);

    const defaultCmdBarItems = props.user.role_id === 0
        ? [
            {
                key: 'new',
                text: 'New',
                iconProps: {iconName: 'Add'},
                onClick: () => {
                }
            }
        ]
        : [];
    const [cmdBarItems, setCmdBarItems] = useState(defaultCmdBarItems);

    const cmdBarFarItems = [
        {
            key: 'info',
            text: 'Info',
            ariaLabel: 'Info',
            iconOnly: true,
            iconProps: {iconName: 'Info'},
            onClick: () => {
            },
        },
    ];

    async function fetchData() {
        // fetch doctors information from server
        const [doctors, specialties, hospitals] = await bridge.getDoctors();

        for (const doctor of doctors)
            doctor.showDetails = false;
        setItems([doctors, specialties, hospitals]);

        // create filters in the command bar for each specialty
        const specialtyFilters = [];
        specialties.forEach(spec => specialtyFilters.push({
            key: spec.name,
            text: spec.name,
            onClick: () => setItems([doctors.filter(item => item.specialty === spec.name), specialties, hospitals])
        }));

        setCmdBarItems([
            cmdBarItems[0],
            {
                key: 'filter',
                text: 'Filter',
                iconProps: {iconName: 'Filter'},
                subMenuProps: {
                    items: [
                        {
                            key: 'all',
                            text: 'All specialties',
                            onClick: () => setItems([doctors, specialties, hospitals])
                        },
                        ...specialtyFilters
                    ],
                },
            }]);
    }

    useEffect(() => {
        fetchData().catch(err => console.error(err));
    }, []);

    return (
        <div className={style.flexContainerScreenHeight}>
            <div className={style.cardGridContainer} style={{backgroundColor: palette.neutralLighter}}>
                <CommandBar
                    style={{boxShadow: Depths.depth8}}
                    items={cmdBarItems}
                    farItems={cmdBarFarItems}
                />
                <div className={style.gridAutoFill}>
                    {doctors.map(doctor =>
                        <div className={style.gridItem} key={doctor.id}>
                            <Card info={{doctor, specialties, hospitals}} user={props.user} updateCallback={fetchData}/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Doctors;