import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()

 // start writing firebase functions
 // https://firebase.google.com/docs/functions/typescript

export const NewLikeNotification =  functions.database.ref('/posts/{owner_id}/{post_it}/likes/{user_id}')
    .onCreate((snapshot, context) => {
        const ownerId = context.params.owner_id
        const userId = context.params.user_id
        const payload = {
            notification: {
                title: 'Some one likes your posts',
                body: userId + ' dianzan'
            }
        }

        getFcmtoken(ownerId).then(function (val) {
            console.log(val + ' should recive message')
            return admin.messaging().sendToDevice(val,payload)
        }).catch(function (err) {
            console.error(err)
            })
    
        return null
    });

//return temp promise and should work in .then(function(val) {...})
 function getFcmtoken(uid:string) {
    return admin.database()
        .ref(`/users/${uid}/fcmtoken`)
        .once('value')
        .then(snapshot => {
            const temp = snapshot.val()
            return temp
        })
}
