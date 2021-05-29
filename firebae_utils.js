const firebase = require("firebase/app");
require("firebase/firestore");

var firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
  };
  // Initialize Firebase
  if(!firebase.apps.length)  firebase.initializeApp(firebaseConfig);

  function initiateFirestore() {
    let db = firebase.firestore();
    return db;
  }

let self = (module.exports = {
    getDataFromFirestore: async ({ id }) => {
        try {
          const db = initiateFirestore();
          let data;
          await db.collection("queries").doc(id).get().then((doc) => {
            if (doc.exists) {
                data = doc.data();
            } else {
                data = null;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

          return data;
        } catch (e) {
          console.log(e);
        }
      }
});
