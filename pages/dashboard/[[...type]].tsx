import nookies from "nookies";
import { verifyIdToken } from "../../firebase/admin";
import {
    DashboardContainer,
    ContentArea,
} from "../../components/dashboard/styles";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import DashboardHeader from "../../components/header/dashboard";
import React, { useContext, useEffect } from "react";
import { HeaderContextProvider } from "../../components/header/context";
import admin from "firebase-admin";
import { useRouter } from "next/router";
const Discord = dynamic(
    () => import("../../components/dashboard/Discord/Discord")
);
const App = dynamic(() => import("../../components/dashboard/App"));
import {
    discordContext,
    DiscordContextProvider,
} from "../../components/dashboard/Discord/discordContext";
import Head from "next/head";
import { PremiumModal } from "../../components/dashboard/premiumModal";

const Dashboard = ({ type, session, settings, categories }) => {
    const router = useRouter();

    const [, serverId, pluginName] = router.query.type as string[];
    const { premiumModalOpen } = useContext(discordContext);

    useEffect(() => {
        if (!type?.[0]) {
            router.push("/dashboard/discord");
        }
    }, [type]);

    return (
        <>
            <PremiumModal></PremiumModal>
            {session && (
                <HeaderContextProvider>
                    <DashboardHeader user={session.user} />
                </HeaderContextProvider>
            )}
            <Head>
                <title>
                    DisStreamChat | Dashboard {pluginName && "-"} {pluginName}
                </title>
            </Head>
            <DashboardContainer>
                <ContentArea>
                    {type?.[0] === "discord" && <Discord session={session} />}
                    {type?.[0] === "app" && (
                        <App
                            settings={settings}
                            categories={categories}
                            session={session}
                        />
                    )}
                </ContentArea>
            </DashboardContainer>
        </>
    );
};

const DashboardContextContainer = (props) => {
    return (
        <DiscordContextProvider>
            <Dashboard {...props}></Dashboard>
        </DiscordContextProvider>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req, res, params } = context;
    let session = null;
    // const cookies = parseCookies(req.headers.cookie);
    const cookies = nookies.get(context);
    try {
        const token = await verifyIdToken(cookies["auth-token"]);
        if (!token) throw new Error("no token");
        if (typeof token === "boolean") session = token;
        else {
            const { uid } = token;
            session = { uid };
            const userRef = admin.firestore().collection("Streamers").doc(uid);
            const userDisordRef = userRef.collection("discord").doc("data");
            const userDoc = await userRef.get();
            const userDiscordDoc = await userDisordRef.get();
            const userData = userDoc.data();
            const userDiscordData = userDiscordDoc.data();
            session.user = {
                ...userData,
                ...(userDiscordData || {}),
                discordConnected: !!userDiscordData,
            };
        }
    } catch (err) {
        console.log("error: ", err.message);
        res.writeHead(307, { location: "/" }).end();
        return { props: {} };
    }

    if (!params.type) {
        if (session.user?.discordConnected) {
            res.writeHead(307, { location: "/dashboard/discord" }).end();
        } else {
            res.writeHead(307, { location: "/dashboard/app" }).end();
        }
        return { props: {} };
    }

    const [first, second] = params.type as string[];
    let settings = {};
    let categories = [];
    if (first === "app") {
        if (!second) {
            res.writeHead(307, { location: "/dashboard/app/all" }).end();
            return { props: {} };
        }
        const settingsRef = await admin
            .firestore()
            .collection("defaults")
            .doc("settings16")
            .get();
        settings = settingsRef.data()?.settings;
        categories = [
            //@ts-ignore
            ...new Set(
                Object.values(settings || {}).map((val: any) => val.category)
            ),
        ]
            .filter(Boolean)
            .sort();
    }
    if (params.type && !["app", "discord"].includes(params.type[0])) {
        return { notFound: true };
    }
    return {
        props: {
            type: params.type || null,
            session,
            settings,
            categories: ["all", "discord", ...categories],
        },
    };
};

export default DashboardContextContainer;
