import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp()
let name: string
let comment_text: string
const db = admin.database()
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
            name = val
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


export const NewCommentNotification = functions.database.ref('/posts/{owner_id}/{post_id}/comments/{comment_id}')
    .onCreate(async (snapshot, context) => {

        name = ""
        comment_text = ""
        const ownerId = context.params.owner_id
        const postId = context.params.post_id
        const commentId = context.params.comment_id
        let userId = "laaaaa"
        //let UserName:string
        await db.ref(`/posts/${ownerId}/${postId}/comments/${commentId}/user_id`).once('value')
            .then(function (doc) {
                userId = doc.val()
                console.log('get commenerID: ' + userId)
                return userId
            }).then(getUsername).then(function (val) {
                name = val
                return null
            }).catch(function (err) {
                console.error(err)
            });


         

        await getComment(ownerId, postId, commentId).then(function (val) {
            console.log("the comment is " + val)
            comment_text = val
            return null
        }).catch(function (err) {
            console.error(err)
        })


        const payload = {
            notification: {
                title: 'Post Notification',
                body: name + ' commented: ' + comment_text
            }
        }

        await getFcmtoken(ownerId).then(function (val) {
                return admin.messaging().sendToDevice(val, payload)
        }).catch(function (err) {
            console.error(err)
        })

        return null
    });

export const NewFollowNotification = functions.database.ref('/follows/{follower_id}/{TargetKey}')
    .onCreate(async (snapshot, context) => {
        console.log('snapshot.val() is: '+ snapshot.val())
        const followId = context.params.follower_id
        let followname = "123"
        await getUsername(followId).then(function (val) {
            followname = val
                return null
            }).catch(function (err) {
                console.error(err)
            });
           

        const payload = {
            notification: {
                title: 'Follow Notification',
                body: followname + ' just followed You!'
            }
        }
        await getFcmtoken(snapshot.val()).then(function (val) {
            return admin.messaging().sendToDevice(val, payload)
        }).catch(function (err) {
            console.error(err)
        })
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
            console.log('get Username: ' + temp + ' with val = ' + uid)
            return temp
        })
}

//function getCommenterId(owner_id: string, post_id: string, cid: string) : boolean {
//    return admin.database()
//        .ref(`/posts/{ownder_id}/{post_id}/comments/${cid}/user_id`)
//        .once('value')
//        .then(snapshot => {
//            const temp = snapshot.val()
//            if ()
//                return true
//            else
//                return false
//        })
//}

//async function getCommenter(owner_id:string,post_id:string,cid: string) { 
//    admin.database()
//        .ref(`/posts/${owner_id}/${post_id}/comments/${cid}/username`)
//        .once('value')
//        .then(snapshot => {
//            const temp = snapshot.val()
//            return temp
//        })
//}
async function getComment(owner_id: string, post_id: string, cid: string) {
    return admin.database()
        .ref(`/posts/${owner_id}/${post_id}/comments/${cid}/comment`)
        .once('value')
        .then(snapshot => {
            const temp = snapshot.val()
            return temp
        })
}

