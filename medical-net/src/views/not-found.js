import {getTheme, Stack, Text} from "office-ui-fabric-react";
import style from "../style.module.scss";
import {Depths} from "@uifabric/fluent-theme/lib/fluent/FluentDepths";
import {Link} from "react-router-dom";
import React from "react";

const NotFound = () => {
    const {palette} = getTheme();

    return (
        <div className={style.flexContainer}>
            <div className={style.box} style={{boxShadow: Depths.depth4}}>
                <Stack className="slide" tokens={{childrenGap: 20}}>
                    <h2>404 Not Found</h2>
                    <Text variant={'medium'} block>
                        The page you are trying to access cannot be found.
                    </Text>
                    <Link className={style.smallLink} to="/" style={{color: palette.themePrimary}}>
                        Go to home page
                    </Link>
                    <br/>
                </Stack>
            </div>
        </div>
    );
};

export default NotFound;