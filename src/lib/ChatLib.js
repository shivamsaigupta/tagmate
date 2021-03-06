import firebase from "react-native-firebase";
import {getUserThumbnail, getFullName, resetUnreadCount} from './firebaseUtils'

class ChatLib {
  uid = "";
  name = "";
  taskId = "";
  avatar = "";
  messagesRef = null;
  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setUid(user.uid);
        getUserThumbnail(user.uid).then(avatarURL => {
          this.avatar = avatarURL;
          console.log('got avatar: ', avatarURL)
        })
        getFullName(user.uid).then(fullName => {
          this.name = fullName;
          console.log('got fullName: ', fullName)
        })
      } else {
        console.log('user not logged in: ChatLib');
      }
    });
  }
  setUid(value) {
    this.uid = value;
  }

  setTaskId(value) {
    this.taskId = value;
    console.log('setTaskId');
  }

  getUid() {
    return this.uid;
  }

  getName() {
    return this.name;
  }

  getAvatar() {
    return this.avatar;
  }

  networkCheck = (userId, bio) => new Promise((resolve, reject) => {
      try {
            setTimeout(() => {
              return fetch('https://www.google.com')
                .then((response) => {
                  resolve(true)
                })
                .catch((err) => {
                  resolve(false)
                });
            }, 150);
      } catch (e) {
          reject(false)
      }
  })


  // retrieve the messages from the Backend
  loadMessages(callback) {
    console.log(this.taskId);
    this.messagesRef = firebase.database().ref('/messages/' + this.taskId);
    this.messagesRef.off();
    const onReceive = data => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.user._id,
          name: message.user.name,
          avatar: message.user.avatar
        }
      });
    };
    this.messagesRef.limitToLast(20).on("child_added", onReceive);
  }
  // send the message to the Backend
  sendMessage(message, userList) {
    this.networkCheck().then(online =>{
      if(online){
        for (let i = 0; i < message.length; i++) {
          this.messagesRef.push({
            text: message[i].text,
            user: message[i].user,
            createdAt: firebase.database.ServerValue.TIMESTAMP
          });
        }
        const incrementUnread = firebase.functions().httpsCallable('incrementUnread');
        incrementUnread({userList: userList, taskId: this.taskId})
        .then(({ data }) => {
          console.log('[Client] Server successfully posted')
        })
        .catch(HttpsError => {
            console.log(HttpsError.code); // invalid-argument
        })

        //this.incrementUnread(userList); //local function not using. Using cloud function instead
      }else{
        alert('Please check your internet connection and try again')
      }
    })

  }

  //Reset unread msg count for this user
  resetUnread(taskId){
    const {currentUser: {uid} = {}} = firebase.auth()
    resetUnreadCount(uid, taskId);
  }

/*
  //Increment unread msg count for all users
  incrementUnread(userList){

    //TODO: Only do this if the user has not opted out
    //Should move this to cloud function
    for(let i = 0; i< userList.length; i++){
      console.log('I have incremented unread counts for these users: ', userList[i]);
      firebase.database().ref(`/users/${userList[i]}/messages/${this.taskId}/unreadCount`).transaction(function(unreadCount){
        return (unreadCount || 0) + 1;
      });
    }
  }
  */


  // close the connection to the Backend
  closeChat() {
    if (this.messagesRef) {
      this.messagesRef.off();
    }
  }
}

export default new ChatLib();
