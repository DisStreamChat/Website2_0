import { isEqual } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Avatar, useMediaQuery } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

import firebaseClient from "../../../firebase/client";
import { getServerIconUrl } from "../../../utils/functions";
import plugins from "../../../utils/plugins.json";
import { NoIcon } from "../../shared/styles/guildIcon";
import Select from "../../shared/styles/styled-select";
import { BlueButton } from "../../shared/ui-components/Button";
import SaveBar from "../../shared/ui-components/SaveBar";
import { ContentArea } from "../styles";
import { useDiscordContext } from "./discordContext";
import { FlexSection } from "./EmbedEditor.style";
import PluginItem from "./PluginItem";
import { Plugins as PluginPage } from "./pluginPages/styles";
import Plugins from "./Plugins";
import ServerModals from "./ServerModals";
import { PluginBody, ServerHeader, ServerHeaderItem } from "./styles";

const ServerName = styled.div`
    h2 {
        display: flex;
        align-items: center;
        img {
            margin-right: 0.75ch;
        }
    }
`;

const ServerContainer = styled.div`
    display: flex;
    max-height: calc(100vh - 80px);
`;

const PluginArea = styled(ContentArea)`
    --width: 82%;
    flex: 1;
    align-items: center;
    max-height: calc(100vh - 80px);
    overflow: auto;
    padding-bottom: 2rem;
    padding-top: 2rem;
`;

const InnerServerSidebar = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    .header-top {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
`;

const PluginListItem = styled.a`
    display: inline-flex;
    align-items: center;
    color: ${(props: any) => (props.disabled ? "grey" : "")};
	cursor: ${(props: any) => props.disabled ? "not-allowed" : "pointer"};
    &:hover {
        text-decoration: ${(props: any) =>
            !props.disabled ? "underline" : "none"};
        text-underline-offset: 0.25rem;
    }
`;

const Server = ({ server, servers }) => {
    const router = useRouter();

    const [, serverId, pluginName] = router.query.type as string[];

    const iconImage = getServerIconUrl(server.icon, server.id);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [localActivePlugins, setLocalActivePlugins] = useState({});

    const { activePlugins, setActivePlugins } = useDiscordContext();

    useEffect(() => {
        setLocalActivePlugins(activePlugins || {});
    }, [activePlugins]);

    const verySmall = useMediaQuery("(max-width: 400px)");

    const changed = !isEqual(activePlugins, localActivePlugins);

    const reset = () => setLocalActivePlugins(activePlugins);

    const save = () => {
        firebaseClient.updateDoc(`DiscordSettings/${serverId}`, {
            activePlugins: localActivePlugins,
        });
        setActivePlugins(localActivePlugins);
    };

    const currentPlugin = plugins.find((plugin) => plugin.id === pluginName);

    return (
        <ServerContainer>
            <ServerModals
                serverId={serverId}
                infoModalOpen={infoModalOpen}
                setInfoModalOpen={setInfoModalOpen}
                settingsModalOpen={settingsModalOpen}
                setSettingsModalOpen={setSettingsModalOpen}
            />
            <ServerHeader>
                <InnerServerSidebar>
                    <div className="header-top">
                        <ServerHeaderItem>
                            <Select
                                width="100%"
                                onChange={(change) => {
                                    const value = change.value;
                                    const [id, name] = value.split("-");
                                    console.log(id, name);
                                    router.push(
                                        `/dashboard/discord/${id}/${
                                            currentPlugin?.id || ""
                                        }`
                                    );
                                }}
                                value={{
                                    value: `${server.id}-${server.name}`,
                                    label: (
                                        <FlexSection>
                                            <Avatar src={iconImage}>
                                                <NoIcon
                                                    name={server.name
                                                        .split(" ")
                                                        .map((w) => w[0])
                                                        .join("")}
                                                    size={50}
                                                    style={{
                                                        maxWidth: 100,
                                                        minWidth: 100,
                                                        height: 100,
                                                        borderRadius: "50%",
                                                        marginRight: "1rem",
                                                        // backgroundColor: "#36393f",
                                                        color: "white",
                                                        margin: 0,
                                                    }}
                                                >
                                                    {server.name
                                                        ?.split?.(" ")
                                                        ?.map((w) => w[0])}
                                                </NoIcon>
                                            </Avatar>
                                            <ServerName>
                                                <h1>{server.name}</h1>
                                            </ServerName>
                                        </FlexSection>
                                    ),
                                }}
                                options={servers.map((item) => {
                                    return {
                                        value: `${item.id}-${item.name}`,
                                        label: (
                                            <FlexSection>
                                                <Avatar
                                                    src={getServerIconUrl(
                                                        item.icon,
                                                        item.id
                                                    )}
                                                >
                                                    <NoIcon
                                                        name={item.name
                                                            .split(" ")
                                                            .map((w) => w[0])
                                                            .join("")}
                                                        size={50}
                                                        style={{
                                                            maxWidth: 100,
                                                            minWidth: 100,
                                                            height: 100,
                                                            borderRadius: "50%",
                                                            marginRight: "1rem",
                                                            color: "white",
                                                            margin: 0,
                                                        }}
                                                    >
                                                        {item.name
                                                            ?.split?.(" ")
                                                            ?.map((w) => w[0])}
                                                    </NoIcon>
                                                </Avatar>
                                                <ServerName>
                                                    <h1>{item.name}</h1>
                                                </ServerName>
                                            </FlexSection>
                                        ),
                                    };
                                })}
                            ></Select>
                        </ServerHeaderItem>
                        <ServerHeaderItem className="buttons">
                            <BlueButton onClick={() => setInfoModalOpen(true)}>
                                Server Info
                            </BlueButton>
                            <BlueButton
                                onClick={() => setSettingsModalOpen(true)}
                            >
                                <SettingsIcon /> Settings
                            </BlueButton>
                        </ServerHeaderItem>
                    </div>
                    <ServerHeaderItem className="column">
                        {plugins.map((plugin) => (
                            <div>
                                <Link
                                    href={
                                        activePlugins[plugin.id] &&
                                        !plugin.comingSoon
                                            ? `/dashboard/discord/${serverId}/${plugin.id}`
                                            : serverId
                                    }
                                    passHref
                                >
                                    <PluginListItem
										// @ts-ignore
                                        disabled={
                                            !activePlugins[plugin.id] ||
                                            plugin.comingSoon
                                        }
                                    >
                                        <img
                                            src={`/${plugin.image}`}
                                            width="25"
                                            height="25"
                                            style={{
                                                display: "inline-block",
                                                marginRight: "1ch",
                                            }}
                                        ></img>
                                        {plugin.id}
                                    </PluginListItem>
                                </Link>
                            </div>
                        ))}
                    </ServerHeaderItem>
                </InnerServerSidebar>
            </ServerHeader>
            <PluginArea>
                {!pluginName ? (
                    <PluginBody>
                        {plugins.map((plugin) => (
                            <PluginItem
                                {...plugin}
                                key={plugin.id}
                                serverId={serverId}
                                active={!!localActivePlugins[plugin.id]}
                                setActive={(val) =>
                                    setLocalActivePlugins((prev) => ({
                                        ...prev,
                                        [plugin.id]: val,
                                    }))
                                }
                            />
                        ))}
                    </PluginBody>
                ) : (
                    <PluginPage>
                        <Plugins />
                    </PluginPage>
                )}
            </PluginArea>
            <SaveBar changed={changed} save={save} reset={reset} />
        </ServerContainer>
    );
};

export default Server;
