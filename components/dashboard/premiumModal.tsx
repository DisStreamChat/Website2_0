import Link from "next/link";
import React, { useContext } from "react";
import styled from "styled-components";
import { EmptyButton, OrangeButton } from "../shared/ui-components/Button";

import Modal from "../shared/ui-components/Modal";

import { discordContext } from "./Discord/discordContext";
import { ServerModal } from "./Discord/styles";

const PremiumModalBody = styled(ServerModal)`
    height: 50vh;
    display: flex;
    padding: 0;
`;

const PremiumModalSection = styled.div`
    flex: 1;
`;

const PremiumModalRight = styled(PremiumModalSection)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const RightContent = styled.div`
    display: flex;
    flex-direction: column;
`;

const PremiumModalLeft = styled(PremiumModalSection)`
    background: var(--disstreamchat-blue);
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        max-width: 70%;
    }
`;

const PremiumTitle = styled.h1`
    font-size: 1.25rem;
`;

const PremiumList = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem 0 !important;
    li {
        &:before {
            content: "✔";
            color: green;
            margin-right: 1ch;
        }
    }
`;

const PremiumButtons = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`;

export const PremiumModal = () => {
    const { premiumModalOpen, setPremiumModalOpen } =
        useContext(discordContext);

    return (
        <Modal
            open={premiumModalOpen}
            onClose={() => setPremiumModalOpen(false)}
        >
            <PremiumModalBody>
                <PremiumModalLeft>
                    <img src="/logo.png"></img>
                </PremiumModalLeft>
                <PremiumModalRight>
                    <RightContent>
                        <PremiumTitle>
                            You discovered a Premium feature!
                            <br />
                            Upgrade to unlock it
                        </PremiumTitle>
                        <PremiumList>
                            <li>Many affordable options</li>
                            <li>Fully refundable for 7 days</li>
                            <li>Transferable to other servers</li>
                            <li>
                                Many features to bring the best out of your
                                server
                            </li>
                        </PremiumList>
                        <PremiumButtons>
                            <Link href="/premium">
                                <a>
                                    <OrangeButton>
                                        Upgrade to Premium
                                    </OrangeButton>
                                </a>
                            </Link>
                            <EmptyButton>Not now</EmptyButton>
                        </PremiumButtons>
                    </RightContent>
                </PremiumModalRight>
            </PremiumModalBody>
        </Modal>
    );
};
