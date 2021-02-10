import app from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/performance";

const firebaseConfig = {
	apiKey: "AIzaSyBYf5_N6811jS6vRSeakY4atZnoOJKwfq8",
	authDomain: "distwitchchat-db.firebaseapp.com",
	databaseURL: "https://distwitchchat-db.firebaseio.com",
	projectId: "distwitchchat-db",
	storageBucket: "distwitchchat-db.appspot.com",
	messagingSenderId: "559894947762",
	appId: "1:559894947762:web:afbe4455a38d6189eae6ab",
	measurementId: "G-TB4BJR7W7Q",
};

class Firebase {
	db: app.firestore.Firestore;
	auth: app.auth.Auth;
	app: typeof app;
	perf: app.performance.Performance;

	constructor() {
		if (!app.apps.length) {
			app.initializeApp(firebaseConfig);
		}
		if (typeof window !== "undefined") {
			app.analytics();
			this.perf = app.performance();
		}
		this.auth = app.auth();
		this.db = app.firestore();
		this.app = app;
	}

	get documentId() {
		return app.firestore.FieldPath.documentId();
	}

	logout() {
		return this.auth.signOut();
	}

	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve);
		});
	}

	getCurrentUsername() {
		return this.auth.currentUser.displayName;
	}

	delete() {
		return this.app.firestore.FieldValue.delete();
	}

	updateDoc(path: string, data: any) {
		return this.db.doc(path).update(data);
	}

	async setDoc(path: string, data: any) {
		try {
			await this.db.doc(path).set(data);
		} catch (err) {
			this.updateDoc(path, data);
		}
	}
}

export default new Firebase();
