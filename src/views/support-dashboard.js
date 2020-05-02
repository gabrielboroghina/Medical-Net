import * as React from 'react';
import {useState, useEffect} from 'react';
import '../App.scss';
import style from "../style.module.scss";
import bridge from "../bridge";

import {
    Text,
    CommandBar, Icon, List,
    MessageBarType, MessageBar,
    getTheme, mergeStyleSets, getFocusStyle, TextField, Stack, PrimaryButton, IconButton,
} from 'office-ui-fabric-react';
import {Depths} from "@uifabric/fluent-theme/lib/fluent/FluentDepths";


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

const theme = getTheme();
const {palette, semanticColors, fonts} = theme;

const classNames = mergeStyleSets({
    itemCell: [
        getFocusStyle(theme, {inset: -1}),
        {
            minHeight: 54,
            padding: 10,
            boxSizing: 'border-box',
            borderBottom: `1px solid ${semanticColors.bodyDivider}`,
            display: 'flex',
            selectors: {
                '&:hover': {background: palette.neutralLight},
            },
            cursor: 'pointer'
        },
    ],
    itemContent: {
        marginLeft: 10,
        overflow: 'hidden',
        flexGrow: 1,
        width: "100%"
    },
    itemName: [
        fonts.xLarge,
        {
            whiteSpace: 'wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },
    ],
    itemIndex: {
        fontSize: fonts.small.fontSize,
        color: palette.neutralTertiary,
        marginBottom: 10,
    },
});

const EditBox = props => {
    const [sendingError, setSendingError] = useState(null);

    const setMessageResponse = () => {
        const response = document.getElementById("field-response").value;
        bridge.setMessageResponse(props.item.id, response)
            .then(() => {
                // return to the messages list (updated)
                props.doneCallback(true);
            })
            .catch(() => {
                setSendingError(MessageBarType.severeWarning);
            });
    };

    return (
        <div className="slide" style={{}}>
            <IconButton iconProps={{iconName: "ChromeBack"}} title="Back" ariaLabel="Back"
                        onClick={() => props.doneCallback(false)}
                        style={{marginTop: 15, marginLeft: 5}}
            />
            <Stack className={style.msgEditBox} tokens={{childrenGap: 15}}>
                <div>
                    <h3>Edit the response to the user's question</h3>
                    <h5>Subject:</h5>
                    <Text variant={"medium"}>{props.item.subject}</Text>
                    <h5>Description:</h5>
                    <Text variant={"medium"}>{props.item.message}</Text>
                </div>

                <TextField id="field-response" className={style.widthLimit}
                           label="Response:" placeholder="Enter the response here"
                           defaultValue={props.item.response || ""}
                           multiline resizable={false} required
                />
                {
                    sendingError &&
                    <MessageBar className={style.widthLimit} messageBarType={MessageBarType.severeWarning}>
                        There was an error processing your request.
                    </MessageBar>
                }
                <div>
                    <PrimaryButton text="Save" onClick={setMessageResponse} allowDisabledFocus/>
                </div>
            </Stack>
        </div>
    );
};

const MessagesManagementBoard = () => {
    const {palette} = getTheme();
    const [[items, allItems], setItems] = useState([[], []]);
    const [filterText, setFilterText] = useState('');
    const [[editing, editingItem], setEditMode] = useState([false, null]);

    const cmdBarItems = [
        {
            key: 'filter',
            text: 'Filter',
            iconProps: {iconName: 'Filter'},
            subMenuProps: {
                items: [
                    {
                        key: 'allMessages',
                        text: 'All messages',
                        onClick: () => setItems([allItems, allItems])
                    },
                    {
                        key: 'unsolvedMessages',
                        text: 'Unsolved messages',
                        onClick: () => setItems([allItems.filter(item => !item.response), allItems])
                    },
                    {
                        key: "solvedMessages",
                        text: "Solved messages",
                        onClick: () => setItems([allItems.filter(item => item.response), allItems])
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
    ];

    async function fetchData() {
        // fetch messages data from server
        const messages = (await bridge.getMessages()).data;
        setItems([messages, messages]);
    }

    const editDoneCallback = (modified) => {
        setEditMode([false, null]);
        if (modified)
            fetchData();
    };

    useEffect(() => {
        // get messages from database
        fetchData().catch(err => console.error(err));
    }, []);

    const _onFilterChanged = (_: any, text: string) => {
        this.setState({
            filterText: text,
            items: text
                ? this._originalItems.filter(item => item.name.toLowerCase().indexOf(text.toLowerCase()) >= 0)
                : this._originalItems,
        });
    };

    const _onRenderCell = (item, index) => {
        return (
            <div className={classNames.itemCell} data-is-focusable={true}
                 onClick={() => setEditMode([true, item])}
            >
                <Icon className={style.icon}
                      style={{color: item.response ? 'green' : 'red'}}
                      iconName={item.response ? 'CheckboxCompositeReversed' : 'CheckboxFill'}
                />

                <div className={classNames.itemContent}>
                    <div className={classNames.itemName}>{item.subject}</div>
                    <div className={classNames.itemIndex}>{item.create_date}</div>
                    <div className={style.description}>{item.message}</div>
                </div>

                <Icon className={style.icon} iconName={'Edit'}/>
            </div>
        );
    };

    return (
        <div className={style.container}>
            <div className={style.cardGridContainer} style={{backgroundColor: palette.white}}>
                <div className={style.msgMgmtHeader}>
                    <h3>Messages Management</h3>
                </div>

                <CommandBar style={{boxShadow: Depths.depth8}}
                            items={cmdBarItems}
                            farItems={_farItems}
                />

                <MessageBar messageBarType={MessageBarType.warning} isMultiline={false}>
                    {allItems.filter(item => !item.response).length} unresolved messages
                </MessageBar>
                <div className={style.scrollablePane}>
                    {editing
                        ? <EditBox item={editingItem} doneCallback={editDoneCallback}/>
                        : <List className={style.msgList} items={items} onRenderCell={_onRenderCell}/>
                    }
                </div>
            </div>
        </div>
    );
};

export default MessagesManagementBoard;