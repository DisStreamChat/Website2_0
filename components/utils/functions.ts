import firebaseClient from "../../firebase/client";

export const isPremiumServer = async (guild) => {
    return (
        await firebaseClient.db.collection("premiumServers").doc(guild.id).get()
    ).exists;
};
