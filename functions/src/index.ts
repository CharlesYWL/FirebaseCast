import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()

 // start writing firebase functions
 // https://firebase.google.com/docs/functions/typescript

export const NewLikeNotification = functions.database.ref('/posts/{owner_id}/{post_it}/likes/{user_id}')
    .onCreate((snapshot, context) => {
        const ownerId = context.params.owner_id
        const userId = context.params.user_id

        const fcmtoken = getFcmtoken(ownerId)
        console.log(`${fcmtoken} likes your posts`)
        console.log(`${userId} likes your posts`)

        return null
    });

function getFcmtoken(uid:string) {
    return admin.database()
        .ref(`/users/${uid}/username`)
        .once('value')
        .then(snapshot => {
            return snapshot.val()
        })
}
