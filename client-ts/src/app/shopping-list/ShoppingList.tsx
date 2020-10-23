import { MergeTypeSharp } from '@material-ui/icons';
import React, { useState } from 'react';
import { ShoppingItem } from './types';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/HighlightOffRounded';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { v4 as uuid } from 'uuid';
import './ShoppingList.scss';
import { ListItemText } from '@material-ui/core';

const fakeList: ShoppingItem[] = [
  { id: uuid(), name: 'Toalettpapir' },
  { id: uuid(), name: 'kronelys' },
];

const ShoppingList: React.FC = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(fakeList);
  const [newItemText, setNewItemText] = useState<string>('');

  const handleAdd = () => {
    setShoppingList((prevList) => {
      return [...prevList, { id: uuid(), name: newItemText } as ShoppingItem];
    });
    setNewItemText('');
  };

  const handleDelete = (id: string) => {
    setShoppingList((prevList) => {
      return prevList.filter((item) => item.id !== id);
    });
  };

  const handleKeyPress = (e) => {
    ç;
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div>
      <h2>Shopping list</h2>
      <TextField
        id="newItem"
        label="Hva mangler?"
        value={newItemText}
        onChange={(ev) => setNewItemText(ev.target.value)}
        onKeyUp={handleKeyPress}
      />
      <IconButton aria-label="add" disabled={!newItemText} onClick={handleAdd}>
        <AddIcon />
      </IconButton>
      <List>
        {shoppingList.map(function (item) {
          return (
            <ListItem className="list-item" key={item.id}>
              <ListItemText primary={item.name} />
              <IconButton
                aria-label="delete"
                onClick={() => handleDelete(item.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default ShoppingList;
