import * as functions from 'firebase-functions';

 // start writing firebase functions
 // https://firebase.google.com/docs/functions/typescript

export const helloworld = functions.https.onRequest((request, response) => {
    console.log('Hello');
    response.send("hello firebase!");
 });
