import * as React from 'react';
import style from '../style.module.scss';
import {useState, useEffect, useMemo} from "react";
import bridge from "../bridge";
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';
import {getTheme, CommandBar, Text, Label, Persona, PersonaSize, SearchBox} from "office-ui-fabric-react";
import {memo} from "react";
import {useConst} from "@uifabric/react-hooks";
import {useCallback} from "react";

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

            {/*<div className={style.columnSmall}>*/}
            {/*    Files*/}
            {/*</div>*/}
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

const MedicalRecords = (props) => {
    const [records, setRecords] = useState([]);
    const [cmdBarItems, setCmdBarItems] = useState([]);

    const addRecord = () => {

    };

    const cmdBarFarItems = [
        {
            key: 'info',
            text: 'Info',
            ariaLabel: 'Info',
            iconOnly: true,
            iconProps: {iconName: 'Info'},
        },
    ];

    async function fetchData() {
        const records = await bridge.getRecords(props.user.id);
        setRecords(records);

        const SearchBar = () => (
            <div className={style.fullHeight}>
                <SearchBox
                    styles={{root: {maxWidth: 400}}}
                    placeholder="Search"
                    underlined
                    onClear={ev => setRecords(records)}
                    onChange={(e, newValue) => {
                        setRecords(records.filter(rec =>
                            rec.investigations.toLowerCase().includes(newValue) ||
                            rec.diagnosis.toLowerCase().includes(newValue) ||
                            rec.prescription.toLowerCase().includes(newValue)),
                        )
                    }}
                />
            </div>
        );

        setCmdBarItems([
            ...(props.user.role_id === 3
                    ? [{
                        key: 'new',
                        text: 'New',
                        iconProps: {iconName: 'Add'},
                        onClick: addRecord
                    }]
                    : []
            ),
            {
                key: 'search',
                text: 'Search',
                commandBarButtonAs: SearchBar
            }
        ]);
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
                <RecordsContainer records={records}/>
            </div>
        </div>
    );
};

export default MedicalRecords;