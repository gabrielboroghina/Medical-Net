import * as React from 'react';
import style from '../style.module.scss';
import {useState, useEffect, useReducer, memo} from "react";
import bridge from "../bridge";
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import {
    getTheme,
    Text,
    Label,
    Persona,
    PersonaSize,
    SearchBox,
    NormalPeoplePicker, Stack, IconButton, TeachingBubble,
} from "office-ui-fabric-react";
import {useBoolean} from "@uifabric/react-hooks";

const {palette} = getTheme();

const Record = (props) => {
    const {palette} = getTheme();

    return (
        <div className={style.recordCard} style={{boxShadow: Depths.depth8}}>
            <div className={style.columnWide}>
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
                    <Persona
                        imageUrl={props.info.doctor.photo}
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
        </div>
    );
};

const RecordsContainer = (props) => {
    return (
        <div className={style.scrollablePane}>
            {
                props.records.map(record =>
                    <div className={style.recordsContainer} key={record.id}>
                        <Record info={record}/>
                    </div>)
            }
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
    const suggestionProps = {
        suggestionsHeaderText: 'Suggested Doctors',
        mostRecentlyUsedHeaderText: 'Suggested Doctors',
        noResultsFoundText: 'No results found',
        loadingText: 'Loading',
        showRemoveButtons: true,
        suggestionsAvailableAlertText: 'People Picker Suggestions available',
        suggestionsContainerAriaLabel: 'Suggested contacts',
    };

    const [teachingBubbleVisible, {toggle: toggleTeachingBubbleVisible}] = useBoolean(false);
    const picker = React.useRef(null);
    let selectedPersonas = props.selectedPersonas;

    const onFilterChanged = (filterText, currentPersonas, limitResults) => {
        if (filterText) {
            let filteredPersonas = props.personas.filter(item => item.text.includes(filterText));

            filteredPersonas = limitResults ? filteredPersonas.slice(0, limitResults) : filteredPersonas;
            return filteredPersonas;
        } else {
            return [];
        }
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
                    pickerSuggestionsProps={suggestionProps}
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
    const [doctors, setDoctors] = useState([]);
    const [accessGrants, setAccessGrants] = useState([]);

    async function fetchData() {
        const records = await bridge.getRecords(props.user.id);
        const [doctors, ,] = await bridge.getDoctors();
        const grants = await bridge.getAccessGrants(props.user.id);

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
        dispatchRecords(records);
        setAccessGrants(grants);
    }

    useEffect(() => {
        fetchData().catch(err => console.error(err));
    }, []);

    return (
        <div className={style.flexContainerScreenHeight}>
            <div className={style.cardGridContainer} style={{backgroundColor: palette.neutralLighter}}>
                <div className={style.actionBar} style={{boxShadow: Depths.depth8}}>
                    <Stack tokens={{childrenGap: 10}}>
                        <div style={{width: "100%"}}>
                            <SearchBar onChange={dispatchRecords}/>
                        </div>
                        <PeoplePicker personas={doctors} selectedPersonas={accessGrants} user={props.user}/>
                    </Stack>
                </div>
                <RecordsContainer records={records}/>
            </div>
        </div>
    );
};

export default MedicalRecords;