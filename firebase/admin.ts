import admin from "firebase-admin";

const serviceAccount = require("../serviceAccount.json");

export default admin

export const verifyIdToken = async token => {
	if (!admin.apps.length) {
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: "https://distwitchchat-db.firebaseio.com",
		});
	}

	return admin
		.auth()
		.verifyIdToken(token)
		.catch(err => false);
};

