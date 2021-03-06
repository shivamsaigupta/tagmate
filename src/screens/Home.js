import React, {Component} from 'react';
import {FlatList, View, Text, ActivityIndicator, Alert, StyleSheet, TouchableOpacity, Share, ScrollView, Linking, Platform, Dimensions} from 'react-native';
import {serverExists, getNetworkId, getBlockedList, undoRejects, saveDeviceToken, addServer, appendHiddenPosts, alreadyAccepted, addAcceptor, removeSelfHostedPosts, getAcceptors, getHiddenPosts} from "../lib/firebaseUtils";
import firebase from 'react-native-firebase';
import Notification from '../lib/Notification';
import AsyncStorage from '@react-native-community/async-storage';
import { Button, Badge, ListItem, Card, Icon as IconElements } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet'
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from "react-redux";
import * as _ from 'lodash';
import TimeAgo from 'react-native-timeago';
import {adourStyle, BRAND_COLOR_ONE, BRAND_COLOR_THREE, BRAND_COLOR_TWO, BRAND_COLOR_FOUR} from './style/AdourStyle';
import CardStack, { Card as SwipableCard } from 'react-native-card-stack-swiper';
import OfflineNotice from './OfflineNotice';

const CUSTOM_IMG = "https://tagmateapp.com/assets/item_img/custom.jpg";

//Test commit: Google Play Release

const { width: WIDTH } = Dimensions.get('window')
let uid;

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myTasks: [],
            hiddenPosts: [],
            blockedList: [],
            networkId: '',
            isSoftBlocked: false,
            fetching: false,
        };
        this.getMyTasks = this.getMyTasks.bind(this);
    }

    componentDidMount(){
        this._isMounted = true;
        this.setState({fetching:true});
        let user = firebase.auth().currentUser;
        if (user != null) {
          uid = user.uid;
        } else {
          this.props.navigation.navigate('Login')
        }

        firebase.analytics().setCurrentScreen('Home');

        AsyncStorage.getItem("alreadyLaunchedHome").then(value => {
              if(user != null && value == null){
                   AsyncStorage.setItem('alreadyLaunchedHome', "true"); // No need to wait for `setItem` to finish, although you might want to handle errors
                   Alert.alert(
                   'How It Works',
                   'Swipe right to attend. Swipe left to decline.',
                   [
                     {text: 'COOL'}
                   ]
                 );
              }
              else{
                   console.log('Not showing directions alert since this is not the first launch')
              }}) // Add some error handling, also you can simply do this.setState({fistLaunch: value == null})


        // TEMPORARY
        //getAcceptors("testServiceRequest").then(response => {
        //  console.log("Returned from getAcceptors: ", response);
        //})
        //alreadyAccepted("ShivamGupta500", "testServiceRequest").then(accptBool => {
        //  console.log('Returned from alreadyAccepted (expected true): ', accptBool)
        //})
        //addAcceptor("VineetNand999", "testServiceRequest"); //TEMPORARY

        // Get the necessary lists to filter the posts
        getHiddenPosts(uid).then(hiddenPosts => {
          getBlockedList(uid).then(blockedList => {
            getNetworkId(uid).then(networkId => {
              this.setState({networkId, blockedList, hiddenPosts});
              this.getMyTasks();
              this.blockedListListener();
              this.checkAppVersion();
              this.remotePopups();
              //this.rewindListener();
            })
          })
        })
        this.tokenFunc(uid);


    }
    componentWillUnmount()
    {
        this._isMounted = false;
        clearTimeout(this.timeoutHandle);
    }

    async tokenFunc(uid) {
      // configure push notification capability & get deviceToken
      Notification.configure((token) => {
        saveDeviceToken(uid, token)
      })

      //listener to listen token refresh
      this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(token => {
          Notification.onTokenRefresh(token)
          saveDeviceToken(uid, token)
      })
    }

    onShare = (postTitle) => {
    Share.share({
      message: `Hey, I think you\'ll be interested in attending this meetup: ${postTitle}. RSVP Here: https://tagmateapp.com`,
      url: 'https://tagmateapp.com',
      title: `${postTitle}`
    }, {
      // Android only:
      dialogTitle: 'Share this meetup',
    })
    }

    // Open Post Details screen for the task the user has tapped.
    openInfo = (item) =>
    {
      this.props.navigation.navigate('PostDetails',{taskId: item.id})
    }

    showScopeInfo = (publicPost) => {
        if(publicPost){
            Alert.alert(
            'Info',
            'This is a public event. If you swipe right, you will be immediately added to the guest list.',
            [
              {text: 'Cool'}
            ]
          );
        }else{
          Alert.alert(
          'Info',
          'This is a private event. When you swipe right, the host will have to first approve you before you can join the guest list.',
          [
            {text: 'Cool'}
          ]
        );
        }

    }

    openProfile = (uid) =>
    {
      this.props.navigation.navigate('ViewProfileHome',{profileUid: uid})
    }

    userGuideContainer = () =>
    {
      if(this.state.myTasks.length == 0) {
          return <View style={{marginLeft: 20, marginRight: 18, marginTop: 20}}>
                <Text style={adourStyle.guideText}>
                You will see other people's Instajude meetup posts here. Your posts are on your Dashboard. {"\n"} {"\n"}
                </Text>
                <Button title="Create an Instajude Meetup" titleStyle={adourStyle.buttonTextBold} buttonStyle={adourStyle.btnGeneral} disabled={this.state.disabledBtn} onPress={() => {this.props.navigation.navigate('Create')}}/>
                </View>
          }
    }

    openAppStore = () => {
      if(Platform.OS === 'android'){
        Linking.openURL('https://play.google.com/store/apps/details?id=com.chillmate')
      }else if (Platform.OS === 'ios'){
        Linking.openURL('https://apps.apple.com/ca/app/instajude/id1468743902')
      }else{
        console.log('error updating app')
        Alert.alert(
        'Error',
        'Error updating. Please go to Google Play Store and update the app manually.',
        [
          {text: 'Exit', onPress: () => this.props.navigation.navigate('BlockAccess', {reason: 'You are using an outdated version of the app. Please update it by going to Google Play Store or Apple App Store.'})}
        ]
      );
      }
    }

    //If there is a change in blocked list while the user is on this screen, update the blockedList state
    checkAppVersion = () => {
      let installedVersion = '1.59.1';
      //Currently only taking care of when the user blocks someone new. Does not work when user unblocks. S/he must reload the app in that case.
      let ref = firebase.database().ref(`specs/versionName`);
      //When the user blocks someone new
      ref.on('value', (snapshot) => {
        //If there is a change, use the function getBlockedList to create the updated combined blockedList
          //Remove any posts hosted by the blockedUid
          let versionName = snapshot.val();
          if(installedVersion != versionName){
            Alert.alert(
            'Outdated version',
            'Please update the app.',
            [
              {text: 'Exit', onPress: () => this.props.navigation.navigate('BlockAccess', {reason: 'You are using an outdated version of the app. Please update it by going to Google Play Store or Apple App Store.'})},
              {text: 'Update', onPress: () => this.openAppStore()}
            ]
          );
          this.props.navigation.navigate('BlockAccess', {reason: 'You are using an outdated version of the app. Please update it by going to Google Play Store or Apple App Store.'});
          }
      })
    }

    userHappy = () => {

      //Save metrics
      firebase.database().ref(`users/${uid}`).update({userHappy: true}).then(res => {
        firebase.database().ref(`admin/happyUsers`).transaction(function(happyUsers){
          return (happyUsers || 0) + 1;
        });
      })

      Alert.alert(
      'Rate Us',
      'Would you mind rating us? It will help us a lot.',
      [
        {text: 'Not Now', onPress: () => AsyncStorage.setItem('feedbackProvided', "false")},
        {text: 'Sure', onPress: () => {
          AsyncStorage.setItem('feedbackProvided', "true");
          this.openAppStore();
        }}
      ]
    );

  }

  sendFeedback = () => {
      AsyncStorage.setItem('feedbackProvided', "true");
      Linking.openURL('mailto:support@tagmateapp.com?subject=Feedback');
  }

  userUnhappy = () => {
    //Save metrics
    firebase.database().ref(`users/${uid}`).update({userHappy: false}).then(res => {
      firebase.database().ref(`admin/unhappyUsers`).transaction(function(unhappyUsers){
        return (unhappyUsers || 0) + 1;
      });
    })

    Alert.alert(
    'Send Us Feedback',
    'Tell us where we went wrong. Let us know how we can fix this.',
    [
      {text: 'Not Now', onPress: () => AsyncStorage.setItem('feedbackProvided', "false")},
      {text: 'Send Feedback', onPress: () => this.sendFeedback()}
    ]
  );
  }

    remotePopups = () => {

      //REMOTE FEEDBACK START
      this.timeoutHandle = setTimeout(()=>{
        //Check if the user has already provided feedback
            AsyncStorage.getItem("feedbackProvided").then(value => {
              if(value == null || value == "false"){
                 let ref = firebase.database().ref(`admin/requestFeedback`);
                 ref.on('value', (snapshot) => {
                     let requestFeedback = snapshot.val();
                     if(requestFeedback == true){
                       Alert.alert(
                       'Feedback',
                       'Do you enjoy using Tagmate?',
                       [
                         {text: 'No', onPress: () => this.userUnhappy()},
                         {text: 'Yes', onPress: () => this.userHappy()}
                       ]
                     );
                     }
                 })
            }})
         }, 3000);
      //REMOTE FEEDBACK END

    }

    //If there is a change in blocked list while the user is on this screen, update the blockedList state
    blockedListListener = () => {
      //Currently only taking care of when the user blocks someone new. Does not work when user unblocks. S/he must reload the app in that case.
      let blockedRef = firebase.database().ref(`users/${uid}/block/`);
      //When the user blocks someone new
      blockedRef.child('blocked').on('child_added', (snapshot) => {
        //If there is a change, use the function getBlockedList to create the updated combined blockedList
          //Remove any posts hosted by the blockedUid
          let blockedUid = snapshot.val();
          this.setState({myTasks: this.state.myTasks.filter(item => item.hostId !== snapshot.key)});
      })
      //Listen for changes in the list of users that has blocked the current user
      blockedRef.child('blockedBy').on('child_added', (snapshot) => {
        //Remove any posts hosted by the blockedUid
        let blockedUid = snapshot.val();
        this.setState({myTasks: this.state.myTasks.filter(item => item.hostId !== snapshot.key)});
      })
      //listen for changes in the list of users that the admin has soft blocked
      firebase.database().ref('admin/softBlockedUids').on('child_added', (snapshot) => {
        //Remove any posts hosted by the blockedUid
        let blockedUid = snapshot.val();
        this.setState({myTasks: this.state.myTasks.filter(item => item.hostId !== snapshot.key)});
      })

      //Check if the current user is softBlocked
      firebase.database().ref(`users/${uid}/isSoftBlocked`).on('value', (snapshot) => {
        if(snapshot.val() != undefined){
          if(snapshot.val() === true){
            this.setState({isSoftBlocked: true});
          }
        }
      })

      //Check if the current user is hardBlocked
      firebase.database().ref(`users/${uid}/isHardBlocked`).on('value', (snapshot) => {
        if(snapshot.val() != undefined){
          if(snapshot.val() === true){
            this.props.navigation.navigate('BlockAccess', {reason: 'Your account has been temporarily suspended. This may happen when you violate our Terms of Use. Please email support@tagmateapp.com for queries.'})
          }
        }
      })

    }

    rewindListener = () => {
      //Currently only taking care of when the user blocks someone new. Does not work when user unblocks. S/he must reload the app in that case.
      let ref = firebase.database().ref(`users/${uid}/hiddenPosts/`);
      //When the user blocks someone new
      let postId;
      ref.child('rejected').on('child_removed', (snapshot) => {
        //If there is a change, use the function getBlockedList to create the updated combined blockedList
          //Remove any posts hosted by the blockedUid
          postId = snapshot.val();
      }).then(res=> {
          let networkId = this.state.networkId;
          let livePostsRef = firebase.database().ref(`networks/${networkId}/livePosts/${postId}`)
          livePostsRef.once('value', (snapshot) => {
            let postIsLive = snapshot.exists();
            if(postIsLive){
              let request = snapshot.val()
              // Check if this request is not made by same user, it is not by a host who has blocked this user or vice versa and it is not already decided upon by this user
              if(request.hostId != uid && !_.includes(this.state.blockedList, request.hostId) && !_.includes(this.state.hiddenPosts, request.id))
              {
                this.setState({myTasks:[request].concat(this.state.myTasks) , fetching: false});
              }
              if(this.state.fetching) this.setState({fetching:false});
            }
          })
          if(this._isMounted) this.setState({fetching:false});
      })

    }

    /*
    * get all the task requests that this user can perform
    * */
    getMyTasks = () => {
        let networkId = this.state.networkId;
        let livePostsRef = firebase.database().ref(`networks/${networkId}/livePosts`)
        livePostsRef.on('child_added', (snapshot) => {

          let request  = snapshot.val()
          console.log('this.state.hiddenPosts: ', this.state.hiddenPosts);
          // Check if this request is not made by same user, it is not by a host who has blocked this user or vice versa and it is not already decided upon by this user
          if(request.hostId != uid && !_.includes(this.state.blockedList, request.hostId) && !_.includes(this.state.hiddenPosts, request.id))
          {
            this.setState({myTasks:[request].concat(this.state.myTasks) , fetching: false});
          }
          if(this.state.fetching) this.setState({fetching:false});
        })
        if(this._isMounted) this.setState({fetching:false});

        livePostsRef.on('child_removed', (snapshot) => {
          //console.log('child_removed, snapshot key is ', snapshot.key)
          this.setState({myTasks: this.state.myTasks.filter(item => item.id !== snapshot.key)});
        })

        //TODO: child_changed - interested Count may change


    }


    // Locally hide task by removing it from myTasks object in the state
    hideTask = (id) =>
    {
        let allTasks = [...this.state.myTasks];
        let filteredTasks = allTasks.filter(item => item.id != id);
        this.setState({myTasks:filteredTasks})
    }

    // The user has decided on this card and hence add this card to the user's hidden tasks list so that the app won't show it again
    decideOnPost = (id) =>
    {
        //this.hideTask(id);
        this.setState({myTasks: this.state.myTasks.filter(taskItem => taskItem.id !== id)});
        if(uid) appendHiddenPosts(uid, id, false);
    }

    acceptTaskNew = (item) => new Promise((resolve, reject) => {
      try {
        const {isSoftBlocked} = this.state;
        //If this user is softBlocked, treat the right Swipe as a Left Swipe
        if(isSoftBlocked){
          //console.log('This user is softblocked, swipe right blocked')
          this.decideOnPost(item.id);
          return
        }
        console.log('acceptTaskNew try')

        if(uid)
        {
            //Info popups START
            if(item.publicPost === true){
              AsyncStorage.getItem("firstRightSwipePublic").then(value => {
                if(value == null){
                    AsyncStorage.setItem('firstRightSwipePublic', "true"); // No need to wait for `setItem` to finish, although you might want to handle errors
                     Alert.alert(
                     'Added to Dashboard',
                     'You can find the event on your dashboard.',
                     [
                       {text: 'Dismiss'},
                       {text: 'Go To Dashboard', onPress: () => this.props.navigation.navigate('DashboardScreen')}
                     ]
                   );
                 }})
            }else{
              //its a private event
              AsyncStorage.getItem("firstRightSwipePrivate").then(value => {
                if(value == null){
                         AsyncStorage.setItem('firstRightSwipePrivate', "true"); // No need to wait for `setItem` to finish, although you might want to handle errors
                         Alert.alert(
                         'Pending Approval',
                         'This is a private event. Once the host approves your participation, we will notify you.',
                         [
                           {text: 'Cool'}
                         ]
                       );
                    }})
            }
            //Info popups END

            alreadyAccepted(uid, item.id).then(alreadyAcc => // Check if someone has already accepted the task {id}.
            {
              console.log('Inside acceptTaskNew alreadyAccepted')
              console.log('**** alreadyAcc value is: ', alreadyAcc)
                //this.hideTask(item.id);
                if(!alreadyAcc) // If the task is still not accepted by this user, add this user to the uid
                {
                  console.log('Inside acceptTaskNew right before addAcceptor')
                    //the addAcceptor function basically writes to the firebase database
                    // try adding appendHiddenPosts here and removing everything else below, check if the function is run
                    addAcceptor(uid, item.id, item.hostId, item.publicPost).then(o =>
                    {
                      //console.log('Inside acceptTaskNew addAcceptor then')
                      this.setState({myTasks: this.state.myTasks.filter(taskItem => taskItem.id !== item.id)});
                      //appendHiddenPosts(userId, serviceId);
                      console.log('done with: ', item.customTitle)
                      resolve(true)
                      //this will remove this item from state.myTasks
                        //this.hideTask(item.id);
                    });
                }
            });
        }

      } catch(e) {
        reject(e)
      }
    })

    // This function takes service request ID as parameter.
    // It first checks whether the service request is still up to be accepted.
    // If yes, it assigns it to the user and navigates him/her to the DashboardDetails screen.
    acceptTask = (item) =>
    {
        if(uid)
        {
            alreadyAccepted(uid, item.id).then(alreadyAcc => // Check if someone has already accepted the task {id}.
            {
                //this.hideTask(item.id);
                if(!alreadyAcc) // If the task is still not accepted by this user, add this user to the uid
                {
                    //the addAcceptor function basically writes to the firebase database
                    // try adding appendHiddenPosts here and removing everything else below, check if the function is run
                    addAcceptor(uid, item.id, item.hostId).then(o =>
                    {
                      this.setState({myTasks: this.state.myTasks.filter(item => item.id !== item.id)});
                      //appendHiddenPosts(userId, serviceId);
                      console.log('added as acceptor item : ', item.customTitle)
                      return;
                      //this will remove this item from state.myTasks
                        //this.hideTask(item.id);
                    });
                }
            });
        }
    }

    _onRefresh = () => {
      this.setState({myTasks: [], hiddenPosts: [], blockedList: [], fetching: true}, function () {
              //START
              // Get the necessary lists to filter the posts
              getHiddenPosts(uid).then(hiddenPosts => {
                getBlockedList(uid).then(blockedList => {
                  getNetworkId(uid).then(networkId => {
                    this.setState({networkId, blockedList, hiddenPosts});
                    this.getMyTasks();
                    this.blockedListListener();
                    //this.rewindListener();
                  })
                })
              })
              //END
           }
        )
    }

    rewindPrompt = () => {
      Alert.alert(
      'Confirmation',
      'Are you sure you want to undo all your left swipes?',
      [
        {text: 'Cancel', onPress: () => console.log('Report Revoked')},
        {text: 'Undo', onPress: () => undoRejects(uid).then(res=> {
          this.setState({fetching:true});
          //START
          // Get the necessary lists to filter the posts
          getHiddenPosts(uid).then(hiddenPosts => {
            getBlockedList(uid).then(blockedList => {
              getNetworkId(uid).then(networkId => {
                this.setState({networkId, blockedList, hiddenPosts});
                this.getMyTasks();
                this.blockedListListener();
                //this.rewindListener();
              })
            })
          })
          //END
        })}
      ]
    );
    }

    showActionSheet = () => {
      this.ActionSheet.show()
    }


      onReportPress = (id) => {
        Alert.alert(
        'Confirmation',
        'You may report this post if you think it is inappropriate or it violates our Terms of Service',
        [
          {text: 'Cancel', onPress: () => console.log('Report Revoked')},
          {text: 'Report', onPress: () => this.onReportConfirm(id)}
        ]
      );
      }

      onReportConfirm = (id) => {
        let user = firebase.auth().currentUser;
        if (user != null) {
          let selfUid = user.uid;
          const report = firebase.functions().httpsCallable('report');
          report({uid: selfUid, reportID: id, contentType: 'post' , reportType: 'inappropriate'})
          .then(({ data }) => {
            console.log('[Client] Report Success')
            alert('This post has been reported as inappropriate. Our team will look into it.')
            this.props.navigation.goBack();
          })
          .catch(HttpsError => {
              console.log(HttpsError.code); // invalid-argument
          })
        } else {
          alert('Please signin')
          this.props.navigation.navigate('Login')
        }
      }

    swipableRender() {
      const {myTasks} = this.state;

      //console.log('swipableRender: myTasks is ', myTasks)

      return myTasks.map((item) => {
        const {id, when, details, anonymous, customTitle, publicPost, bgImage, created_at, hostName, verified, hostThumb, hostId, interestedCount} = item;
        //console.log('swipableRender return: item.customTitle is ', item.customTitle)
        var detailsAvailable = true;
        let detailsTrimmed = details;

        if(details == "" || typeof details == "undefined") detailsAvailable = false

        if(details.length > 140){
          let detailsB = details.substring(0, 140);
          detailsTrimmed = detailsB.concat('...');
        }

        let interestAvailable = false;
        let interestNumText = '';

        if(interestedCount > 0){
          interestNumText = `${interestedCount}+ interested`;
          interestAvailable = true;
        }

        let scheduledFor = "null"

        if(when != ""){
          scheduledFor = ("Scheduled for " + when);
        }

        let eventTypeText = 'Public';
        if(publicPost === false) eventTypeText = 'Private'

        return (
          <SwipableCard key={id} onSwipedLeft={() => this.decideOnPost(id)} onSwipedRight={() => this.acceptTaskNew(item)}>
          <View>
          {/*console.log('swipableRender return return: customTitle is ', customTitle)*/}


          <Card image={{uri: bgImage}} featuredTitle={customTitle} featuredTitleStyle={adourStyle.listItemText} >

          {/* Report Feature */}
          <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', left: WIDTH-115 , top: -152, position: 'absolute'}} >
            <IconElements
              name="dots-horizontal"
              type="material-community"
              color={'rgba(41, 89, 165, 0.2)'}
              onPress={this.showActionSheet}
              reverse
              raised
              />
              <ActionSheet
                ref={o => this.ActionSheet = o}
                options={['Report', 'Cancel']}
                cancelButtonIndex={1}
                destructiveButtonIndex={0}
                onPress={(index) => {
                  if(index === 0){
                    this.onReportPress(id)
                  }
              }}
              />
          </View>

          {/* <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', left: WIDTH-165 , top: -35, position: 'absolute'}} >
            <TimeAgo key={id} style={adourStyle.timeAgoText} time={created_at} />
          </View> */}

          <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', left: WIDTH-110 , top: -35, position: 'absolute'}} >
            <Badge value={eventTypeText} status="primary" onPress={() => this.showScopeInfo(publicPost)} textStyle={adourStyle.interestedText} badgeStyle={{marginTop: 5, marginBottom: 5}} />
          </View>

          <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', left: WIDTH-380 , top: -35, position: 'absolute'}} >
          {interestAvailable && <Badge value={interestNumText} status="primary" textStyle={adourStyle.interestedText} badgeStyle={{marginTop: 5, marginBottom: 5}} />}
          </View>

              <ListItem
                title={anonymous? "Anonymous": hostName}
                titleStyle={adourStyle.listItemText}
                subtitle="Host"
                subtitleStyle={adourStyle.listItemText}
                leftAvatar={{ source: { uri: hostThumb }, onPress: anonymous? () => alert('The host is anonymous. Can\'t open profile.') : () => this.openProfile(hostId)}}
                rightIcon={verified? <MaterialComIcon name={'check-circle'} size={25} color={'#5C7AFF'} /> : null}
                onPress={() => this.openInfo(item)}
                chevron={false}
                containerStyle={{borderBottomColor: 'transparent', borderBottomWidth: 0}}
              />


            {
                detailsAvailable && <Text style={adourStyle.cardText} onPress={() => this.openInfo(item)}>{detailsTrimmed}</Text>

            }

            { (scheduledFor != "null") && <Text style={adourStyle.cardText}>{scheduledFor}</Text> }

            <Button
            icon={{
                    name: "share",
                    size: 15,
                    color: "white"
                  }}
            onPress={() => this.onShare(customTitle)}
            buttonStyle={adourStyle.btnShare}
            titleStyle={adourStyle.btnTextSmall}
            title="Recommend A Friend" />

              <View>
              </View>
              <View style={styles.buttonsContainer}>
              <View>
                <TouchableOpacity style={styles.btnReject} onPress={() => { this.swiper.swipeLeft() }} >
                  <Icon name={'thumbs-o-down'} size={25} color={'rgba(255, 255, 255, 1)'} />
                </TouchableOpacity>
              </View>
                <View>
                  <TouchableOpacity style={styles.btnAccept} onPress={() => { this.swiper.swipeRight() }}>
                    <Icon name={'thumbs-o-up'} size={25} color={'rgba(255, 255, 255, 1)'} />
                  </TouchableOpacity>
                </View>
              </View>
              </Card>
              </View>
            </SwipableCard>
        )
      })

  }

    /*
    * render an item of the list
    * */
    renderItem = ({item}) => {
        //console.log('renderItem item.customTitle: ', item.customTitle);
        const {id, when, details, customTitle, bgImage, anonymous, created_at, hostName, interestedCount} = item;
        var detailsAvailable = true;
        if(details == "" || typeof details == "undefined") detailsAvailable = false

        let interestAvailable = false;
        let interestNumText = '';

        if(interestedCount > 0){
          interestNumText = `${interestedCount}+ interested`;
          interestAvailable = true;
        }

        let scheduledFor = "null"

        if(when != ""){
          scheduledFor = ("Scheduled for " + when);
        }

        return (
          <View key={id}>
          <Card image={{uri: bgImage}} featuredTitle={customTitle} featuredTitleStyle={adourStyle.listItemText} >
          <View>
              <ListItem
              title={anonymous? "Anonymous": hostName}
              titleStyle={adourStyle.listItemText}
              subtitle="Host"
              subtitleStyle={adourStyle.listItemText}
              chevron={false}
              containerStyle={{borderBottomColor: 'transparent', borderBottomWidth: 0}}
            />

            { (scheduledFor != "null") && <Text style={adourStyle.defaultText}>{scheduledFor}</Text> }
            {interestAvailable && <Text style={adourStyle.defaultText}>{interestNumText}</Text>}
            <TimeAgo key={id} style={adourStyle.timeAgoText} time={created_at} />

            {
                detailsAvailable && <ListItem
                  subtitle={ details }
                  subtitleStyle={adourStyle.listItemText}
                  chevron={false}
                  onPress={() => this.openInfo(item)}
                  containerStyle={{borderBottomColor: 'transparent', borderBottomWidth: 0}}
                  subtitleProps={{ numberOfLines: 2 }}
                />
            }

            </View>
              </Card>
            </View>
        )
    }

    render() {
        const {fetching, myTasks} = this.state
        //console.log('*** RENDERING *** MyTasks: ', myTasks)
        return (
            <View style={styles.mainContainer}>
            <OfflineNotice />
            <View style={{marginLeft: 20, marginRight: 20}}>
              <Button title="Host A Meetup" titleStyle={adourStyle.buttonTextBold} buttonStyle={adourStyle.btnHomeHost} disabled={this.state.disabledBtn} onPress={() => {this.props.navigation.navigate('CreatePost')}}/>
            </View>
            <CardStack
                renderNoMoreCards={() => <View style={{marginTop: 50}}>
                                                  {fetching && <ActivityIndicator color={BRAND_COLOR_ONE} size={'large'}/>}
                                                  {!fetching && <View style={{alignItems: 'center'}}>
                                                    <Text style={adourStyle.cardOverText}>Check back later</Text>
                                                    <View style={{marginTop: 45}}>
                                                    <IconElements
                                                      name='refresh'
                                                      raised
                                                      type='material'
                                                      onPress={() => this._onRefresh()}
                                                      color={BRAND_COLOR_ONE} />
                                                      <Text style={adourStyle.defaultTextSmallB}>Refresh</Text>
                                                      </View>

                                                      <View style={{marginTop: 45}}>
                                                      <IconElements
                                                        name='fast-rewind'
                                                        raised
                                                        type='material'
                                                        onPress={() => this.rewindPrompt()}
                                                        color={BRAND_COLOR_ONE} />
                                                        <Text style={adourStyle.defaultTextSmallB}>Rewind</Text>
                                                      </View>

                                                    </View>}
                                                  </View>}
                disableBottomSwipe={true}
                key={myTasks.length}
                disableTopSwipe={true}
                ref={swiper => {
                  this.swiper = swiper
                }}
              >
              {this.swipableRender()}
              </CardStack>



            </View>
        )
    }


}

export default HomeScreen;

/*
* Styles used in this screen
* */
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#eceff1'
    },
    progressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginTop: 100
    },
    rowItem: {
        alignSelf: 'stretch',
        justifyContent: 'flex-end',
        paddingHorizontal: 15,
        paddingVertical: 10
    },btnAccept:{
        width: ((WIDTH/2) - 35) ,
        height: 45,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BRAND_COLOR_TWO
    },
    btnReject:{
        width: ((WIDTH/2) - 35),
        height: 45,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BRAND_COLOR_FOUR
    },
    footer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
    },
    buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    flex: 2
    },
    listContainer: {
        flex: 1,
    },
    contentContainer: {
        width: '100%'
    }
})
