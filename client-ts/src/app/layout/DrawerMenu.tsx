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
import { NavLink } from 'react-router-dom';
import Login from '../login/Login'

export function DrawerMenu(props: { classes: any; }) {
    const classes = props.classes;
    const menuItems = [
        { text: 'Bookingkalender', icon: <TodayIcon />, to: '/bookingcalendar' },
        { text: 'Mine bookinger', icon: <EventNoteIcon />, to: '/mybookings' },
        { text: 'Handleliste', icon: <ListIcon />, to: '/shoppinglist' },
        { text: 'Om hytten', icon: <FilterHdrIcon />, to: '/about' }
    ];

    return (
        <div>
            <div className={classes.toolbar} />
            <Divider />
            <List>
                {menuItems.map(item => (
                    <ListItem button key={item.text} component={NavLink} to={item.to}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <Login />
        </div >
    );
}