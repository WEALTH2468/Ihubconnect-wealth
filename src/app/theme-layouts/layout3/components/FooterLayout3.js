import AppBar from '@mui/material/AppBar';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectFooterTheme } from 'app/store/fuse/settingsSlice';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import QuizIcon from '@mui/icons-material/Quiz';
import { Button, Input, TextField } from '@mui/material';
import { Label } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { showMessage } from 'app/store/fuse/messageSlice';

import axios from 'axios';

function FooterLayout3(props) {
    const footerTheme = useSelector(selectFooterTheme);
    const [showPopup, setShowPopup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    console.log(name, description, email, category);
    const dispatch = useDispatch();

    const isValid = () => {
        return !(
            name === '' ||
            email === '' ||
            description === '' ||
            category === ''
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            name,
            email,
            description,
            category,
        };

        dispatch(
            showMessage({
                message: 'Feedback Sent Successfully',
                variant: 'success',
            })
        );
        setShowPopup(false);
        setName('');
        setEmail('');
        setDescription('');
        setCategory('');

        // Add the task to the store
        dispatch(addFeedback(data)).then((action) => {
            const payload = action.payload.data.task;
            console.log('payload: ', payload);
            // Add the task to the group
            dispatch(
                addTaskToGroup({
                    groupId: payload.groupId,
                    _id: payload._id,
                    ...payload,
                })
            );
        });
    };
    return (
        <ThemeProvider theme={footerTheme}>
            <AppBar
                id="fuse-footer"
                className={clsx('relative z-20 shadow-md', props.className)}
                color="default"
                style={{
                    backgroundColor: footerTheme.palette.background.paper,
                }}
            >
                <Box
                    sx={{ '& > :not(style)': { m: 1 } }}
                    className="absolute -top-[7rem] right-0"
                >
                    {/* <Fab color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                    <Fab color="secondary" aria-label="edit">
                        <EditIcon />
                    </Fab> */}
                    <Fab
                        variant="extended"
                        color="secondary"
                        onClick={() => setShowPopup(!showPopup)}
                    >
                        <QuizIcon sx={{ mr: 1 }} />
                        Feedback
                    </Fab>
                    <Fab disabled aria-label="like">
                        <FavoriteIcon />
                    </Fab>
                </Box>
                <Toolbar
                    className="container min-h-48 md:min-h-64 px-8 sm:px-12 lg:px-20 py-0 flex items-center overflow-x-auto text-11 font-medium capitalize"
                    color="text.secondary"
                >
                    iHub Connect 1.0.0.3 - MVP Release : Octorber 29th 24 
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}

export default memo(FooterLayout3);
