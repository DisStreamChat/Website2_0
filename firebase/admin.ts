import admin from "firebase-admin";

const serviceAccount = require("../serviceAccount.json");

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: "https://distwitchchat-db.firebaseio.com",
	});
}
export default admin;

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
		.catch(err => {
			console.log(err);
			return false;
		});
};
