import admin from "firebase-admin"

const serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_CONFIG_BASE64, "base64").toString("ascii"));

export const verifyIdToken = async (token) => {
	if(!admin.apps.length){
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: "https://distwitchchat-db.firebaseio.com",
		});
	}

	return admin.auth().verifyIdToken(token).catch(err => false)
}