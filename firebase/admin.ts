import admin from "firebase-admin";

const serviceAccount = require("../serviceAccount.json");

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: "https://distwitchchat-db.firebaseio.com",
	});
}
export default admin

export const verifyIdToken = async token => {

	return admin
		.auth()
		.verifyIdToken(token)
		.catch(err => false);
};

