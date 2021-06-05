import { Backdrop, createStyles, makeStyles, Modal, ModalProps, Theme, Zoom } from "@material-ui/core";
import React, { ReactNode } from "react";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		modal: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		},
	})
);

export interface modalProps {
	open?: boolean;
	children: any;
	onClose: () => void;
	"aria-labelledby"?: string;
	"aria-describedby"?: string;
}

const CustomModal = (props: modalProps) => {
	const classes = useStyles();
	return (
		<Modal BackdropComponent={Backdrop} open={props.open} onClose={props.onClose} className={classes.modal}>
			<Zoom in={props.open}>{props.children}</Zoom>
		</Modal>
	);
};

export default CustomModal;
