import styled from "styled-components";

interface EmbedEditorBodyProps {
    color: string;
}

export const EmbedEditorBody = styled.div`
    position: relative;
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
