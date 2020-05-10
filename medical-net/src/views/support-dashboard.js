import * as React from 'react';
import {useState, useEffect} from 'react';
import '../App.scss';
import style from "../style.module.scss";
import * as bridge from "../bridge";

import {
    Text,
    CommandBar, Icon, List,
    MessageBarType, MessageBar,
    TextField, Stack, PrimaryButton, IconButton, Toggle,
    getTheme, mergeStyleSets, getFocusStyle, TeachingBubble,
} from 'office-ui-fabric-react';
import {Depths} from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import {useBoolean} from "@uifabric/react-hooks";

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
    let isImportant = props.item.important;

    const setMessageResponse = () => {
        const newProps = {
            response: document.getElementById("field-response").value,
            important: isImportant,
        };
        bridge.updateMessage(props.item.id, newProps)
            .then(() => {
                // return to the messages list (updated)
                props.doneCallback(true);
            })
            .catch(() => {
                setSendingError(MessageBarType.severeWarning);
            });
    };

    return (
        <div className="slideLeft">
            <div className={style.leftRight}>
                <IconButton iconProps={{iconName: "ChromeBack"}} title="Back" ariaLabel="Back"
                            onClick={() => {
                                setSendingError(null);
                                props.doneCallback(false);
                            }}
                            style={{float: "left"}}
                />
                <div style={{float: "right"}}>
                    <Toggle label="Important question" inlineLabel
                            defaultChecked={props.item.important}
                            onChange={(e, checked) => isImportant = checked}
                    />
                </div>
                <div style={{clear: "both"}}/>
            </div>
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
    const [[editing, editingItem], setEditMode] = useState([false, null]);
    const [teachingBubbleVisible, {toggle: toggleTeachingBubbleVisible}] = useBoolean(false);

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
    ];

    const cmdBarFarItems = [
        {
            id: 'infoBtn',
            key: 'info',
            text: 'Info',
            ariaLabel: 'Info',
            iconOnly: true,
            iconProps: {iconName: 'Info'},
            onClick: toggleTeachingBubbleVisible,
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
                {
                    item.important &&
                    <Icon className={style.icon} iconName={'Important'} aria-label={'Important question'}/>
                }
            </div>
        );
    };

    return (
        <div className={style.flexContainer}>
            <div className={style.cardGridContainer} style={{backgroundColor: palette.white}}>
                <div className={style.msgMgmtHeader}>
                    <h3>Messages Management</h3>
                </div>

                <CommandBar style={{boxShadow: Depths.depth8}}
                            items={cmdBarItems}
                            farItems={cmdBarFarItems}
                />
                {
                    teachingBubbleVisible &&
                    <TeachingBubble target="#infoBtn"
                                    hasCondensedHeadline={true}
                                    onDismiss={toggleTeachingBubbleVisible}
                                    headline="Manage all the messages from here"
                    >
                        Click a message, and you'll be redirected to an edit page from where you may edit the message's
                        response and importance
                    </TeachingBubble>
                }

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