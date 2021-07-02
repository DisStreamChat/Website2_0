import styled from "styled-components";
import InsertPhotoTwoToneIcon from "@material-ui/icons/InsertPhotoTwoTone";
import { useEffect, useRef, useState } from "react";
import firebaseClient from "../../../firebase/client";
import { uid } from "uid";
interface EmbedEditorBodyProps {
    color: string;
}

export const EmbedEditorBody = styled.div`
    position: relative;
    padding: 0.25rem 1rem;
    display: flex;
    gap: 3rem;
    &:before {
        position: absolute;
        right: 100%;
        bottom: 0px;
        top: 0px;
        width: 4px;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        background: ${(props: EmbedEditorBodyProps) => props.color};
        content: "";
    }
`;

export const EmbedHalf = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    &:first-child {
        min-width: 485px;
    }
`;

export const EmbedSection = styled.div``;

export const FlexSection = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

export const AddFieldSection = styled(FlexSection)`
    justify-content: space-between;
`;

export const EmbedSectionTitle = styled.span`
    display: inline-block;
    margin-bottom: 0.25rem;
    opacity: 0.7;
`;

export const ImageUploadContainer = styled.div`
    min-width: 48px;
    min-height: 48px;
    max-width: 48px;
    max-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${(props) => (props.hasImage ? "1" : ".7")};
    border-width: 2px;
    border-style: dashed;
    border-color: rgb(85, 87, 98);
    border-image: initial;
    border-radius: 50%;
    transition: 0.25s ease-in-out;
    cursor: pointer;
    overflow: hidden;
    border: ${(props: { hasImage: boolean }) => (props.hasImage ? "none" : "")};
    &:hover {
        border-color: var(--disstreamchat-blue);
        color: var(--disstreamchat-blue);
    }
`;

export const LargeImageUploadContainer = styled(ImageUploadContainer)`
    min-width: 185px;
    min-height: 185px;
    max-width: 185px;
    max-height: 185px;
    border-radius: 0.25rem;
`;

export const FieldContainer = styled.div`
    display: ${(props: { inline: boolean }) =>
        props.inline ? "inline-flex" : "flex"};
    gap: 0.25rem;
    flex-direction: column;
    &:not(:first-child) {
        margin-left: ${(props: { inline: boolean }) =>
            props.inline ? ".25rem" : "0"};
    }
`;

const ImageInput = styled.input`
    display: none;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
`;

interface ImageUploadProps {
    large?: boolean;
    onChange?: (url: string) => void;
	image: string
}

export const ImageUpload = ({ large, onChange, image: imageUrl }: ImageUploadProps) => {
    const [image, setImage] = useState(imageUrl);
    const inputRef = useRef<HTMLInputElement>();

    const Container = !large ? ImageUploadContainer : LargeImageUploadContainer;

	useEffect(() => {
		setImage(imageUrl);
	}, [imageUrl])

    return (
        <>
            <ImageInput
                ref={inputRef}
                type="file"
                onChange={async (event) => {
                    const file = event.target.files[0];
                    if (!file) return;
                    const fileUrl = URL.createObjectURL(file);
                    setImage(fileUrl);
                    const response = await firebaseClient.storage
                        .ref()
						.child(`${uid()}.png`)
                        .put(file);
					const url = await response.ref.getDownloadURL()
					onChange?.(url);
                }}
            />
            <Container
                hasImage={!!image}
                onClick={() => {
                    inputRef.current.click();
                }}
            >
                {!image ? <InsertPhotoTwoToneIcon /> : <Image src={image} />}
            </Container>
        </>
    );
};
