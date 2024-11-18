import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogContent, DialogContentText } from '@mui/material';

function SimpleDialog(props) {
    const { onClose, open } = props;

    const handleClose = () => {
        onClose();
    };

    const handleConfirm = () => {
        props.handleClick();
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open} fullWidth={300}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{props.description}</DialogContentText>
                <div className="flex justify-end items-center gap-4 pt-12">
                    <Button variant="contained" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        color="secondary"
                        variant="contained"
                    >
                        {props.ButtonText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export function useConfirmationDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return { open, handleClickOpen, handleClose };
}

export default function ConfirmationDialog({
    title,
    description,
    open,
    handleClose,
    ButtonText,
    handleClick,
}) {
    return (
        <div>
            <br />
            <SimpleDialog
                title={title}
                description={description}
                handleClick={handleClick}
                open={open}
                ButtonText={ButtonText}
                onClose={handleClose}
            />
        </div>
    );
}
