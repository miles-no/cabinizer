import React from 'react';
import Divider from '@material-ui/core/Divider';
import TodayIcon from '@material-ui/icons/Today';
import EventNoteIcon from '@material-ui/icons/EventNote';
import ListIcon from '@material-ui/icons/List';
import FilterHdrIcon from '@material-ui/icons/FilterHdr';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

export function DrawerMenu(props: { classes: any; }) {
    const classes = props.classes;
    const menuItems = [
        { text: 'Bookingkalender', icon: <TodayIcon /> },
        { text: 'Mine bookinger', icon: <EventNoteIcon /> },
        { text: 'Handleliste', icon: <ListIcon /> },
        { text: 'Om hytten', icon: <FilterHdrIcon /> }
    ];

    return (
        <div>
            <div className={classes.toolbar} />
            <Divider />
            <List>
                {menuItems.map(item => (
                    <ListItem button key={item.text}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </div >
    );
}