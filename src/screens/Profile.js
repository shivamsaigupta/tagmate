import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Linking, Image, ScrollView} from 'react-native';
import { ListItem, Card, Divider, Avatar, CheckBox, Icon as IconElements } from 'react-native-elements';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'react-native-uuid';
import AddDetails from './auth/AddDetails';
import {getCoins, getBio, listenForChange, getNetworkId, isVerified, getFullName, updateAvatar} from '../lib/firebaseUtils.js';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import {adourStyle, BRAND_COLOR_TWO, BRAND_COLOR_ONE} from './style/AdourStyle';
import OfflineNotice from './OfflineNotice';

const { width: WIDTH } = Dimensions.get('window')
const PLACEHOLDER_AVATAR = "https://firebasestorage.googleapis.com/v0/b/chillmate-241a3.appspot.com/o/general%2Favatar.jpg?alt=media&token=4dcdfa81-fea1-4106-9306-26d67f55d62c";
let uid;

class ProfileScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      coins: 'Loading...',
      displayName: '_____ _____',
      networkId: '',
      isVerified: false,
      dmAllow: true,
      bio: '_____ _____ _____ ___ ______',
      photoURL: PLACEHOLDER_AVATAR
    }; // Message to show while Adour coins are being loaded
    this.firebaseListeners = this.firebaseListeners.bind(this);
  }

  handleSignout = () => {
      firebase
        .auth()
        .signOut().then(
          this.props.navigation.navigate('Login')
        )
  }

  componentDidMount(){
    this._isMounted = true;
    firebase.analytics().setCurrentScreen('Profile');
    //Fetching name and photo URL
    let user = firebase.auth().currentUser;
    if (user != null) {
      uid = user.uid;

      getNetworkId(user.uid).then(networkId => {
        getFullName(user.uid).then(displayName => {
          getBio(user.uid).then(bio => {
            isVerified(user.uid).then(isVerified => {
              this.setState({displayName, bio, networkId, isVerified, loading: false});
            })
          })
        })
      })

    } else {
      this.props.navigation.navigate('Login')
    }

    /* Cloud Function Test
    const httpsCallable = firebase.functions().httpsCallable('cloudFuncTest');

    httpsCallable({ some: 'args' })
    .then(({ data }) => {
        console.log(data.someResponse); // hello world
    })
    .catch(httpsError => {
        console.log(httpsError.code); // invalid-argument
    })
    */

    this.firebaseListeners();

    GoogleSignin.configure({
      //It is mandatory to call this method before attempting to call signIn()
      /*
      Scope used earlier:
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      */
      scopes: [],
      // Repleace with your webClientId generated from Firebase console
      webClientId:
        'REPLACE_ME',//'',
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
    });
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  loadWhatsapp = () =>
  {
    // Triggering the app to open whatsapp with a preloaded message.
    Linking.openURL('whatsapp://send?text=Hey, checkout Tagmate. I use it know what\'s happening on campus - https://tagmateapp.com')
  }

  /**
 * Select image method
 */
  pickImage() {
    ImagePicker.openPicker({
      mediaType: 'photo',
      width: 500,
      height: 500,
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      compressImageQuality: 0.5,
      cropping: true
    }).then(image => {
      this.setState({
        loading: true
      })
      //console.log('selected image.path: ', image.path)
      this.uploadImage(image);
    }).catch(e => {
      console.log(e);
      //alert(e.message ? e.message : e);
    });
  }

  dmAllowToggle = () => {
    firebase.database().ref(`/users/${uid}`).update({dmAllow: !this.state.dmAllow})
    //this.setState({dmAllow: !this.state.dmAllow})

  }

  //For Image picking
  uploadImage(image) {
    //console.log("FirebaseStorageService :: image.path ", image.path );
    const imageId = uuid.v4();

    var firebaseStorageRef = firebase.storage().ref(`${this.state.networkId}/imgs`);
    const imageRef = firebaseStorageRef.child(imageId + ".jpeg");

    //A thumbnail is created for any image created with thumb_NAME.jpeg. This is done on the cloud.
    const thumbRef = firebaseStorageRef.child("thumb_" + imageId + ".jpeg");

    //console.log("FirebaseStorageService :: imageRef ", imageRef);


    imageRef.putFile(image.path, {contentType: 'image/jpeg'}).then(function(){
        return imageRef.getDownloadURL();
    }).then(function(url){
        console.log("Image url", url);
        thumbRef.getDownloadURL().then(thumbURL => {
          console.log("thumbURL: ", thumbURL);
          updateAvatar(uid, url, thumbURL)
        })
    }).catch(function(error){
        console.log("Error while saving the image.. ", error);
        //onError(error);
    });
  }

  // This functions expects the user to be logged in.
  // It, in real-time, updates the Adour coin balance of the user.
  firebaseListeners = () =>
  {
    if(this._isMounted)
    {
      let user = firebase.auth().currentUser;
      if (user != null) {
        uid = user.uid;
        //Get profile picture
        firebase.database().ref(`/users/${uid}/profilePicture`).on("value", function(snapshot)
        {
          if(this._isMounted) this.setState({photoURL: snapshot.val() || PLACEHOLDER_AVATAR, loading: false});
        }.bind(this));
        //Get Reputation
        firebase.database().ref(`/users/${uid}/coins`).on("value", function(snapshot)
        {
          if(this._isMounted) this.setState({coins: snapshot.val() || "0"});
        }.bind(this));
        //Get Bio
        firebase.database().ref(`/users/${uid}/bio`).on("value", function(snapshot)
        {
          if(this._isMounted) this.setState({bio: snapshot.val() || ""});
        }.bind(this));

        //Get DM Allow
        firebase.database().ref(`/users/${uid}/dmAllow`).on("value", function(snapshot)
        {
          if(this._isMounted) this.setState({dmAllow: snapshot.val()});
        }.bind(this));

      }




    }
  }


  render(){
    return(
      <View>
      <OfflineNotice />
      <ScrollView>
      <View style={styles.backgroundContainer}>
            <Card>
              <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8
              }}
            >
              {this.state.loading ? (
                <ActivityIndicator />
              ) : (
                <Avatar
                  size="xlarge"
                  rounded
                  onPress={() =>
                    this.props.navigation.navigate("ViewImage", {
                      imgURL: this.state.photoURL
                    })
                  }
                  editButton={{ onPress: this.pickImage.bind(this) }}
                  showEditButton
                  source={{ uri: this.state.photoURL }}
                  activeOpacity={0.7}
                />
              )}
            </View>
              <View style={{flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}><Text style={adourStyle.titleTextCenter}>{this.state.displayName}</Text>{this.state.isVerified ? <MaterialComIcon name={'check-circle'} size={25} color={'#5C7AFF'} style={{marginLeft: 3}} /> : null}</View>
              <View style={{flex:2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <IconElements name="star-border" type="material" color='grey' />
              <Text style={adourStyle.reputationText}> {this.state.coins}</Text>
              </View>

              <View style={{marginTop: 15}}>
              <Divider style={{marginBottom: 4}} />
                <Text style={adourStyle.cardTitleSmall}>Bio</Text>
              <Divider style={{marginTop: 4}} />
                <Text style={adourStyle.defaultText}>{this.state.bio}</Text>
              </View>

              <View style={{alignItems: 'flex-end', justifyContent: 'flex-end'}} >
                <IconElements
                  name="edit"
                  type="material"
                  color={BRAND_COLOR_TWO}
                  onPress={() => this.props.navigation.navigate('EditBio')}
                  raised
                  />
              </View>

            </Card>

        <Card title="Account" titleStyle={adourStyle.cardTitleSmall}>
          <ListItem
            title='Invite A Friend'
            titleStyle={adourStyle.listItemText}
            leftIcon={{ name: 'person-add' }}
            containerStyle={{borderBottomColor: '#e6e6e6'}}
            onPress={()=>{this.loadWhatsapp()}}
          />
          <ListItem
            title='Blocked Users'
            titleStyle={adourStyle.listItemText}
            leftIcon={{ name: 'block' }}
            containerStyle={{borderBottomColor: '#e6e6e6'}}
            onPress={() => this.props.navigation.navigate('BlockList')}
          />
          <ListItem
            title='Customer Support'
            titleStyle={adourStyle.listItemText}
            leftIcon={{ name: 'help-outline' }}
            containerStyle={{borderBottomColor: '#e6e6e6'}}
            onPress={() => this.props.navigation.navigate('SupportScreen')}
          />

          </Card>

          <Card>
          <CheckBox
            title='Allow Private Messages'
            containerStyle={{backgroundColor: 'white'}}
            fontFamily='OpenSans'
            titleProps={adourStyle.listItemText}
            checked={this.state.dmAllow}
            onPress={() => this.dmAllowToggle()}
          />
          </Card>

          <Card title="Legal" titleStyle={adourStyle.cardTitleSmall}>
          <ListItem
            title='Privacy Policy'
            titleStyle={adourStyle.listItemText}
            leftIcon={{ name: 'https' }}
            containerStyle={{borderBottomColor: '#e6e6e6'}}
            onPress={() => this.props.navigation.navigate('PrivacyPolicyScreen')}
          />
          <ListItem
            title='Terms of Service'
            titleStyle={adourStyle.listItemText}
            leftIcon={{ name: 'info-outline' }}
            containerStyle={{borderBottomColor: '#e6e6e6'}}
            onPress={() => this.props.navigation.navigate('ToS')}
          />

          </Card>

          <Card>
          <ListItem
            title='Logout'
            titleStyle={adourStyle.listItemText}
            leftIcon={{ name: 'exit-to-app' }}
            containerStyle={{borderBottomColor: '#e6e6e6'}}
            onPress={async () => {
              try {
                const isSignedIn = await GoogleSignin.isSignedIn();
                if(isSignedIn == true){
                  await GoogleSignin.signOut();
                  this.props.navigation.navigate('Login')
                }
                firebase.auth().signOut().then(res => {
                  this.props.navigation.navigate('Login')
                });
              }
              catch (error) {
                console.log(error);
              }
            }}
          />
        </Card>
        <View style={{marginTop: 25}} />
      </View>
      </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 8,
    backgroundColor: '#eceff1'
  },
  btn: {
    width: WIDTH - 20,
    height: 45,
    borderRadius: 25,
    backgroundColor: 'darkgrey',
    justifyContent: 'center',
    marginTop: 20
  },
  titleText: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'left'
  },
  subtitleText: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 20,
    fontWeight: '200',
    textAlign: 'left'
  },
  btnText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 16,
    textAlign: 'center'
  }
})


export {ProfileScreen};
