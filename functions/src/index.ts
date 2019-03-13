import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()
var name:string
 // start writing firebase functions
 // https://firebase.google.com/docs/functions/typescript

export const NewLikeNotification = functions.database.ref('/posts/{owner_id}/{post_it}/likes/{user_id}')
    .onCreate(async (snapshot, context) => {

        name = ""
        const ownerId = context.params.owner_id
        const userId = context.params.user_id
        if (ownerId === userId) {
            console.log('some like himself')
            return null
        }

        await getUsername(userId).then(function (val) {
            console.log(val+' should be the liker')
            name = val
            console.log('after name = val, name is ' + name)
            return null
        }).catch (function (err) {
            console.error(err)
        })


        const payload = {
            notification: {
                title: 'Post Notification',
                body: name + ' likes your posts'
            }
        }

        await getFcmtoken(ownerId).then(function (val) {
            console.log(val + ' should recive message')
            return admin.messaging().sendToDevice(val,payload)
        }).catch(function (err) {
            console.error(err)
            })
    
        return null
    });

//return temp promise and should work in .then(function(val) {...})
 async function getFcmtoken(uid:string) {
    return admin.database()
        .ref(`/users/${uid}/fcmtoken`)
        .once('value')
        .then(snapshot => {
            const temp = snapshot.val()
            return temp
        })
}

async function getUsername(uid: string) {
    return admin.database()
        .ref(`/users/${uid}/username`)
        .once('value')
        .then(snapshot => {
            const temp = snapshot.val()
            return temp
        })
}