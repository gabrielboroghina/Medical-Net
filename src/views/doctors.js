import * as React from 'react';
import style from '../style.module.scss';

import {
    DocumentCard,
    DocumentCardTitle,
    DocumentCardDetails,
    DocumentCardImage,
} from 'office-ui-fabric-react/lib/DocumentCard';

import {CommandBar, ImageFit, Rating, getTheme, List} from "office-ui-fabric-react";
import {Depths} from '@uifabric/fluent-theme/lib/fluent/FluentDepths';


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
    return (
        <DocumentCard
            className={style.card}
            styles={{width: props.width, boxShadow: Depths.depth4}}
            onClickHref="http://borodb.gear.host"
        >
            <DocumentCardImage height={150} imageFit={ImageFit.cover}
                               imageSrc="https://wallpapers.net/web/wallpapers/human-heart-hd-wallpaper/thumbnail/lg.jpg"/>
            <DocumentCardDetails>
                <DocumentCardTitle title={props.name} shouldTruncate/>
                <DocumentCardTitle
                    title="This is the email content preview. It has a second line."
                    shouldTruncate
                    showAsSecondaryTitle
                />
            </DocumentCardDetails>

            <Rating style={{textAlign: "right", marginRight: 10}} id="small"
                    min={1}
                    max={5}
                    rating={2.5}
                    readOnly
            />
        </DocumentCard>
    );
};


const ROWS_PER_PAGE = 3;

class ListGrid extends React.Component {
    constructor(props) {
        super(props);
        this._items = props.items;
        this.minCardWidth = 210;
    }

    _getItemCountForPage = (itemIndex, surfaceRect) => {
        if (itemIndex === 0) {
            this._columnCount = Math.floor(surfaceRect.width / this.minCardWidth);
            this._columnWidth = Math.floor(surfaceRect.width / this._columnCount);
            this._rowHeight = this._columnWidth;
        }

        return this._columnCount * ROWS_PER_PAGE;
    };

    _getPageHeight = () => {
        return this._rowHeight * ROWS_PER_PAGE;
    };

    _onRenderCell = (item, index) => {
        return (
            <div className={style.listGridTile}
                 style={{width: Math.floor(100 / this._columnCount) + '%'}}
            >
                <div className={style.pad}>
                    {item}
                </div>
            </div>
        );
    };

    render() {
        return (
            <List className={style.listGrid}
                  items={this._items}
                  getItemCountForPage={this._getItemCountForPage}
                  getPageHeight={this._getPageHeight}
                  renderedWindowsAhead={4}
                  onRenderCell={this._onRenderCell}
            />
        );
    }
}

const Doctors = () => {
    const cards = [];
    for (let i = 0; i < 5; i++) {
        const card = <Card name={`Card no ${i}`}/>;
        cards.push(card);
    }

    return (
        <div className={style.flexContainer}>
            <div className={style.cardGridContainer} style={{backgroundColor: palette.neutralLighter}}>
                <CommandBar
                    style={{boxShadow: Depths.depth8}}
                    items={_items}
                    overflowItems={_overflowItems}
                    farItems={_farItems}
                />
                <ListGrid items={cards}/>
            </div>
        </div>
    );
};

export default Doctors;