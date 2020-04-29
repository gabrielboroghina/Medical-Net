import * as React from 'react';
import {useState, useEffect} from 'react';
import '../App.scss';
import style from "../style.module.scss";
import bridge from "../bridge";

import {
    PrimaryButton,
    GroupedList,
    MessageBar,
    Text,
    Stack,
    TextField,
    MessageBarType,
    getTheme, mergeStyleSets
} from 'office-ui-fabric-react';


const Faq = () => {
    const {palette} = getTheme();

    return (
        <div className={style.content} style={{backgroundColor: palette.white}}>
            <Stack tokens={{childrenGap: 10}}>
                <QuestionForm/>
                <FaqGroupedList/>
            </Stack>
        </div>
    );
};

export default Faq;

const QuestionForm = () => {
    const [sendingResult, setSendingResult] = useState(null);

    const sendQuestion = () => {
        const data = {
            subject: document.getElementById("field-subject").value,
            message: document.getElementById("field-message").value,
        };

        bridge.sendMessage(data)
            .then(() => {
                setSendingResult(MessageBarType.success);
            }).catch(err => {
            setSendingResult(MessageBarType.severeWarning);
        });
    };

    return (
        <div className={style.questionFormBox}>
            <Stack tokens={{childrenGap: 20}}>
                <h2>Contact us</h2>
                <Text variant={"medium"} block>
                    Send us your questions and we will reply you on the email as soon as possibile.
                </Text>

                <form>
                    <Stack tokens={{childrenGap: 20}}>
                        <TextField id="field-subject" label="Subject:" required
                                   autoComplete="username"/>
                        <TextField id="field-message" label="Message:" multiline resizable={false} required/>

                        {
                            sendingResult &&
                            <MessageBar messageBarType={sendingResult} isMultiline={true}>
                                {
                                    sendingResult === MessageBarType.success
                                        ? "Your message was sent. We will respond to your questions as soon as possible."
                                        : "There was an error processing your request."
                                }
                            </MessageBar>
                        }

                        <Stack horizontal horizontalAlign="end" tokens={{childrenGap: 20}}>
                            <PrimaryButton text="Send" onClick={sendQuestion} allowDisabledFocus/>
                        </Stack>
                    </Stack>
                </form>
            </Stack>
        </div>
    );
};

const theme = getTheme();
const headerAndFooterStyles = {
    minHeight: 40,
    lineHeight: 40,
};
const classNames = mergeStyleSets({
    header: [headerAndFooterStyles, theme.fonts.xLarge],
});

const FaqGroupedList = () => {
    const [data, setData] = useState({items: [], groups: []});

    async function fetchData() {
        // fetch messages data from server
        const messages = (await bridge.getMessages()).data;

        setData({
            items: messages,
            groups: messages.map(msg => ({
                key: `group${msg.id}`,
                name: `group${msg.id}`,
                startIndex: msg.id - 1,
                count: 1,
                level: 0,
                isCollapsed: false,
                children: [],
            }))
        });
    }

    useEffect(() => {
        fetchData().catch(err => console.error(err));
    }, []);

    function _onRenderCell(nestingDepth, item, itemIndex) {
        return (
            <p style={{padding: "0 20px"}}>
                {item.response}
            </p>
        );
    }

    function _onRenderHeader(props) {
        const toggleCollapse = () => {
            props.onToggleCollapse(props.group);
        };

        return (
            <div className={classNames.header} onClick={toggleCollapse}>
                <div className={style.groupListHeader}>
                    {data.items[props.group.startIndex].subject}
                </div>
            </div>
        );
    }

    return (
        <Stack tokens={{childrenGap: 20}}>
            <h2>Frequently Asked Questions</h2>

            <GroupedList
                items={data.items}
                onRenderCell={_onRenderCell}
                groupProps={{onRenderHeader: _onRenderHeader}}
                groups={data.groups}
            />
        </Stack>
    );
};
