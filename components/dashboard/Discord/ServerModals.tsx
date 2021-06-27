import { isEqual } from "lodash";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

import firebaseClient from "../../../firebase/client";
import {
    parseSelectValue,
    transformObjectToSelectValue,
} from "../../../utils/functions";
import Modal from "../../shared/ui-components/Modal";
import SaveBar from "../../shared/ui-components/SaveBar";
import { TextInput } from "../../shared/ui-components/TextField";
import { useDiscordContext } from "./discordContext";
import RoleItem, { RoleOption } from "./RoleItem";
import Select from "./Select";
import {
    InfoModal,
    ModalInfo,
    ModalSubTitle,
    ModalTitle,
    SettingsModal,
} from "./styles";

const ServerModals = ({
    infoModalOpen,
    setInfoModalOpen,
    settingsModalOpen,
    setSettingsModalOpen,
    serverId,
}) => {
    const [adminRoles, setAdminRoles] = useState([]);
    const [localPrefix, setLocalPrefix] = useState("");
    const [localNickname, setLocalNickname] = useState("");

    const {
        roles,
        adminRoles: defaultAdminRoles,
        serverSettings: { prefix, nickname, adminRoles: dbAdminRoles },
        setServerSettings,
    } = useDiscordContext();

    const reset = () => {
        setLocalNickname(nickname);
        setLocalPrefix(prefix);
        setAdminRoles(dbAdminRoles);
    };

    const save = () => {
        firebaseClient.updateDoc(`DiscordSettings/${serverId}`, {
            prefix: localPrefix,
            nickname: localNickname,
            adminRoles,
        });
        setServerSettings((prev) => ({
            ...prev,
            prefix: localPrefix,
            nickname: localNickname,
            adminRoles,
        }));
    };

    useEffect(() => {
        reset();
    }, [nickname, prefix, dbAdminRoles]);

    const { data } = useQuery("server-data", () =>
        fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/v2/discord/resolveguild?id=${serverId}`
        ).then((res) => res.json())
    );

    const mappedRoles = adminRoles.map((role) => ({
        value: transformObjectToSelectValue(role),
        label: (
            <RoleItem
                onClick={(id) =>
                    setAdminRoles((prev) =>
                        prev.filter((role) => role.id !== id)
                    )
                }
                {...role}
            ></RoleItem>
        ),
    }));

    const mappedDefaultRoles = defaultAdminRoles.map(
        (role: { color: string; name: string; id: string }) => ({
            value: transformObjectToSelectValue(role),
            label: <RoleItem disabled {...role} />,
        })
    );

    const changed =
        localNickname !== nickname ||
        localPrefix !== prefix ||
        !isEqual(adminRoles, dbAdminRoles);

    return (
        <>
            <Modal
                open={settingsModalOpen}
                onClose={() => setSettingsModalOpen(false)}
            >
                <SettingsModal>
                    <div>
                        <ModalTitle>Bot Nickname</ModalTitle>
                        <TextInput
                            placeholder="DisStreamBot"
                            value={localNickname}
                            onChange={(e) => setLocalNickname(e.target.value)}
                        />
                    </div>
                    <div>
                        <ModalTitle>Command Prefix</ModalTitle>
                        <TextInput
                            value={localPrefix}
                            onChange={(e) => setLocalPrefix(e.target.value)}
                        />
                    </div>
                    <div>
                        <ModalTitle>Bot Admins</ModalTitle>
                        <ModalSubTitle>Default Admins</ModalSubTitle>
                        <ModalInfo>
                            These are the roles that have permission to manage
                            your server.
                        </ModalInfo>
                        {roles && (
                            <Select
                                onChange={(value) => {
                                    const parsedValue = parseSelectValue(value);
                                    setAdminRoles((prev) => [
                                        ...prev,
                                        roles.find(
                                            (role) => role.id === parsedValue
                                        ),
                                    ]);
                                }}
                                value={[...mappedDefaultRoles, ...mappedRoles]}
                                options={roles.map((role) => ({
                                    value: transformObjectToSelectValue(role),
                                    label: (
                                        <RoleOption {...role}>
                                            {role.name}
                                        </RoleOption>
                                    ),
                                }))}
                            />
                        )}
                    </div>
                    <SaveBar changed={changed} save={save} reset={reset} />
                </SettingsModal>
            </Modal>
            <Modal open={infoModalOpen} onClose={() => setInfoModalOpen(false)}>
                <InfoModal>
                    {!!data && (
                        <>
                            <div>
                                <ModalSubTitle>Region</ModalSubTitle>
                                <ModalInfo>{data?.region}</ModalInfo>
                            </div>
                            <div>
                                <ModalSubTitle>Channels</ModalSubTitle>
                                <ModalInfo>{data?.channels?.length}</ModalInfo>
                            </div>
                            <div>
                                <ModalSubTitle>Roles</ModalSubTitle>
                                <ModalInfo>{data?.roles?.length}</ModalInfo>
                            </div>
                            <div>
                                <ModalSubTitle>Members</ModalSubTitle>
                                <ModalInfo>{data?.members?.length}</ModalInfo>
                            </div>
                            <div>
                                <ModalSubTitle>Custom Emojis</ModalSubTitle>
                                <ModalInfo>{data?.emojis?.length}</ModalInfo>
                            </div>
                        </>
                    )}
                </InfoModal>
            </Modal>
        </>
    );
};

export default ServerModals;
