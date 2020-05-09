import * as React from 'react';
import style from '../style.module.scss';
import {useState, useEffect, useReducer, memo} from "react";
import * as bridge from "../bridge";
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';

import {
    getTheme, mergeStyleSets,
    Label, Text, TextField,
    Persona, PersonaSize,
    SearchBox,
    NormalPeoplePicker,
    Stack,
    IconButton, PrimaryButton, CommandBarButton,
    TeachingBubble,
    Dialog, DialogFooter, DialogType,
    Modal,
    MessageBar, MessageBarType
} from "office-ui-fabric-react";
import {useBoolean} from "@uifabric/react-hooks";

const PatientSelectionDialog = (props) => {
    const [selectedPerson, setSelectedPerson] = useState(undefined);
    const personas = props.patients.map(patient => ({
        id: patient.id,
        imageInitials: patient.name
            .split(' ')
            .slice(-2)
            .map(token => token[0])
            .join('')
            .substr(0, 2)
            .toUpperCase(),
        text: patient.name,
        secondaryText: patient.email,
        size: PersonaSize.size24,
    }));

    const peoplePickerSuggestionProps = {
        suggestionsHeaderText: 'Suggested Patients',
        mostRecentlyUsedHeaderText: 'Suggested Patients',
        noResultsFoundText: 'No results found',
        loadingText: 'Loading',
    };

    const onFilterChanged = (filterText) => {
        if (filterText)
            return personas.filter(item => item.text.includes(filterText));
        return [];
    };

    return (
        <Dialog
            hidden={!props.open}
            onDismiss={props.onDismiss}
            dialogContentProps={{
                type: DialogType.largeHeader,
                title: 'Select a patient',
                subText: 'Choose a patient to view its medical records and register new ones.'
            }}
            modalProps={{
                isBlocking: false,
                styles: {main: {maxWidth: 450}},
            }}
        >
            <NormalPeoplePicker
                onChange={(items) => setSelectedPerson(items?.[0])}
                onEmptyInputFocus={() => personas.slice(0, 5)}
                onResolveSuggestions={onFilterChanged}
                getTextFromItem={item => item.text}
                className={'ms-PeoplePicker'}
                pickerSuggestionsProps={peoplePickerSuggestionProps}
                key={personas}
            />
            <DialogFooter>
                <PrimaryButton onClick={() => props.onSelect(selectedPerson)} text="OK"/>
            </DialogFooter>
        </Dialog>
    );
};

const NewRecordModal = (props) => {
    const theme = getTheme();
    const [notification, setNotification] = useState([null, null]);

    const contentStyles = mergeStyleSets({
        header: [
            theme.fonts.xLarge,
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

    const registerRecord = () => {
        const record = {
            investigations: document.getElementById("field-investigations").value,
            diagnosis: document.getElementById("field-diagnosis").value,
            prescription: document.getElementById("field-prescription").value,
            doctor_user_id: props.doctor.id,
            owner_id: props.patient.id
        };

        bridge.registerRecord(props.patient.id, record).then(() => {
            setNotification([MessageBarType.success, 'The record was successfully registered']);
            props.updateCallback();
        }).catch(() => {
            setNotification([MessageBarType.severeWarning, 'There was an error processing your request']);
        });
    };

    return (
        <Modal isOpen={props.open}
               onDismiss={props.onDismiss}
               isBlocking={false}
               containerClassName={style.modal}
               allowTouchBodyScroll={true}
        >
            <div className={contentStyles.header}>
                <span>Register a new record for the current patient</span>
                <IconButton styles={iconButtonStyles}
                            iconProps={{iconName: "Cancel"}}
                            ariaLabel="Close popup modal"
                            onClick={props.onDismiss}/>
            </div>
            <div className={style.body}>
                <Stack tokens={{childrenGap: 10}}>
                    <TextField id="field-investigations" label="Investigations:"
                               multiline autoAdjustHeight resizable={false} underlined/>
                    <TextField id="field-diagnosis" label="Diagnosis:"
                               multiline autoAdjustHeight resizable={false} underlined/>
                    <TextField id="field-prescription" label="Prescription:"
                               multiline autoAdjustHeight resizable={false} underlined/>
                </Stack>
                <div style={{paddingBottom: 15}}/>
                <PrimaryButton iconProps={{iconName: "Save"}} onClick={registerRecord} text="Save record"/>
                {
                    notification[0] &&
                    <div style={{marginTop: 10}}>
                        <MessageBar messageBarType={notification[0]} isMultiline={true}>
                            {notification[1]}
                        </MessageBar>
                    </div>
                }
            </div>
        </Modal>
    );
};

const Record = (props) => {
    const {palette} = getTheme();

    return (
        <div className={style.recordCard} style={{boxShadow: Depths.depth8}}>
            <div>
                <Label style={{color: palette.neutralSecondary, display: "inline"}}>Date: </Label>
                <Text variant={"medium"} style={{display: "inline"}}>{props.info.create_date}</Text>
            </div>
            <div>
                <Label style={{color: palette.themeSecondary}}>Investigations: </Label>
                <div style={{border: "1px solid #edebe9", padding: 5}}>
                    <Text variant={"medium"}>{props.info.investigations}</Text>
                </div>
            </div>
            <div>
                <Label style={{color: palette.themeSecondary}}>Diagnosis: </Label>
                <div style={{border: "1px solid #edebe9", padding: 5}}>
                    <Text variant={"medium"}>{props.info.diagnosis}</Text>
                </div>
            </div>
            <div>
                <Label style={{color: palette.themeSecondary}}>Prescription: </Label>
                <div style={{border: "1px solid #edebe9", padding: 5}}>
                    <Text variant={"medium"}>{props.info.prescription}</Text>
                </div>
            </div>
            <div>
                <Label style={{color: palette.neutralDark}}>Doctor: </Label>
                <Persona imageUrl={props.info.doctor.photo}
                         imageInitials={props.info.doctor.name
                             .split(' ')
                             .slice(-2)
                             .map(token => token[0])
                             .join('')
                             .substr(0, 2)
                             .toUpperCase()}
                         text={props.info.doctor.name}
                         secondaryText={props.info.doctor.hospital}
                         size={PersonaSize.size40}
                />
            </div>
        </div>
    );
};

const SearchBar = memo((props) => (
    <div className={style.fullHeight}>
        <SearchBox
            styles={{root: {width: "100%"}}}
            placeholder="Search"
            underlined
            onClear={ev => props.onChange(null)}
            onChange={(e, newValue) => props.onChange(newValue)}
        />
    </div>
));

const PeoplePicker = (props) => {
    const [teachingBubbleVisible, {toggle: toggleTeachingBubbleVisible}] = useBoolean(false);
    const picker = React.useRef(null);
    let selectedPersonas = props.selectedPersonas;

    const peoplePickerSuggestionProps = {
        suggestionsHeaderText: 'Suggested Doctors',
        mostRecentlyUsedHeaderText: 'Suggested Doctors',
        noResultsFoundText: 'No results found',
        loadingText: 'Loading',
    };

    const onFilterChanged = (filterText, currentPersonas, limitResults) => {
        if (filterText) {
            const filteredPersonas = props.personas.filter(item => item.text.includes(filterText));
            return limitResults ? filteredPersonas.slice(0, limitResults) : filteredPersonas;
        }
        return [];
    };

    const changeAccessGrants = (items) => {
        for (const item of items)
            if (!selectedPersonas.includes(item.id))
                bridge.grantAccess(props.user.id, item.id);
        for (const selectedItem of selectedPersonas)
            if (!items.map(item => item.id).includes(selectedItem))
                bridge.revokeAccess(props.user.id, selectedItem);
        selectedPersonas = items.map(item => item.id);
    };

    return (
        <div style={{display: "flex"}}>
            <div className={style.vertCenterFullWidth}>
                <Label className={style.inlineLabel}>Provide access:</Label>
                <NormalPeoplePicker
                    onChange={changeAccessGrants}
                    onEmptyInputFocus={() => props.personas.slice(0, 5)}
                    onResolveSuggestions={onFilterChanged}
                    defaultSelectedItems={props.personas.filter(pers => props.selectedPersonas.includes(pers.id))}
                    getTextFromItem={item => item.text}
                    className={'ms-PeoplePicker'}
                    pickerSuggestionsProps={peoplePickerSuggestionProps}
                    componentRef={picker}
                    key={props.selectedPersonas}
                    styles={{root: {flexGrow: 1}}}
                />
                <IconButton id="infoBtn" iconProps={{iconName: "Info"}} ariaLabel={'Info'}
                            onClick={toggleTeachingBubbleVisible}/>
            </div>
            {
                teachingBubbleVisible &&
                <TeachingBubble target="#infoBtn"
                                hasCondensedHeadline={true}
                                onDismiss={toggleTeachingBubbleVisible}
                                headline="Provide access to your medical history"
                >
                    Allow a doctor to view and add medical records to your medical history
                </TeachingBubble>
            }
        </div>
    )
};

const MedicalRecords = (props) => {
    const {palette} = getTheme();
    const [doctors, setDoctors] = useState([]);
    const [accessGrants, setAccessGrants] = useState([]);
    const [accessiblePatients, setAccessiblePatients] = useState([]);
    const [patientSelectModalOpen, setPatientSelectModalOpen] = useState(props.user.role_id === 3);
    const [patient, setPatient] = useState(null);
    const [showNewRecordModal, setShowNewRecordModal] = useState(false);

    const recordsReducer = ([records, allRecords], newValue) => {
        if (!newValue)
            return [allRecords, allRecords];
        if (Array.isArray(newValue))
            return [newValue, newValue];

        return [allRecords.filter(rec =>
            rec.investigations.toLowerCase().includes(newValue) ||
            rec.diagnosis.toLowerCase().includes(newValue) ||
            rec.prescription.toLowerCase().includes(newValue)),
            allRecords
        ]
    };
    const [[records, allRecords], dispatchRecords] = useReducer(recordsReducer, [[], []]);

    async function fetchData() {
        if (props.user.role_id === 3) {
            // doctor access to a patient's medical history
            const grants = await bridge.getDoctorAccessGrants(props.user.id);
            setAccessiblePatients(grants);
        } else {
            await loadPatientRecords(props.user.id);
        }
    }

    const loadPatientRecords = async (userId, loadGrants = true) => {
        const records = await bridge.getRecords(userId);
        dispatchRecords(records);

        if (loadGrants) {
            const [doctors, ,] = await bridge.getDoctors();
            const personas = doctors.map(doctor => ({
                imageUrl: doctor.picture_url,
                imageInitials: doctor.name
                    .split(' ')
                    .slice(-2)
                    .map(token => token[0])
                    .join('')
                    .substr(0, 2)
                    .toUpperCase(),
                text: doctor.name,
                secondaryText: doctor.workplace,
                size: PersonaSize.size24,
                id: doctor.id
            }));

            setDoctors(personas);

            const grants = await bridge.getAccessGrants(userId);
            setAccessGrants(grants);
        }
    };

    useEffect(() => {
        fetchData().catch(err => console.error(err));
    }, []);

    return (
        <div className={style.flexContainerScreenHeight}>
            <div className={style.cardGridContainer} style={{backgroundColor: palette.neutralLighter}}>
                {props.user.role_id === 3
                    ?
                    <div className={style.actionBarTight} style={{boxShadow: Depths.depth8}}>
                        <Stack tokens={{childrenGap: 10}}>
                            <SearchBar onChange={dispatchRecords}/>
                            <div className={style.cmdBar}>
                                <CommandBarButton className={style.fullHeight} iconProps={{iconName: "Add"}}
                                                  text="New" onClick={() => setShowNewRecordModal(true)}/>
                                {
                                    patient &&
                                    <div className={style.alignRight}>
                                        <Persona {...patient}/>
                                    </div>
                                }
                            </div>
                        </Stack>
                    </div>
                    :
                    <div className={style.actionBar} style={{boxShadow: Depths.depth8}}>
                        <Stack tokens={{childrenGap: 10}}>
                            <SearchBar onChange={dispatchRecords}/>
                            {
                                props.user.role_id === 2 &&
                                <PeoplePicker personas={doctors} selectedPersonas={accessGrants} user={props.user}/>
                            }
                        </Stack>
                    </div>
                }

                <div className={style.scrollablePane}>
                    {records.map(record => <Record info={record} key={record.id}/>)}
                </div>

                <PatientSelectionDialog doctor={props.user} patients={accessiblePatients}
                                        open={patientSelectModalOpen}
                                        onDismiss={() => setPatientSelectModalOpen(false)}
                                        onSelect={patient => {
                                            setPatient(patient);
                                            setPatientSelectModalOpen(false);
                                            loadPatientRecords(patient.id, false);
                                        }}
                />
                <NewRecordModal patient={patient} doctor={props.user} open={showNewRecordModal}
                                updateCallback={() => loadPatientRecords(patient.id, false)}
                                onDismiss={() => setShowNewRecordModal(false)}
                />
            </div>
        </div>
    );
};

export default MedicalRecords;