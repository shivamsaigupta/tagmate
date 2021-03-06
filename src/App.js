import React, {Component} from 'react';
import {View} from 'react-native';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import {RootNav, AppContainer} from './Router';
import * as _ from 'lodash'
import firebase from 'react-native-firebase';
import { NavigationActions } from 'react-navigation';
import {getTotalUnread} from "./lib/firebaseUtils";
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

class App extends Component {
    async componentDidMount()
    {
        // Listeners for push notifications below:

        // When app was open
        this.notificationOpenListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            this.handlePushNotification(notificationOpen.notification, false)
        })

        // in case app was closed and opened by
        const notificationOpen = await firebase.notifications().getInitialNotification()
        if (notificationOpen) {
            const action = notificationOpen.action
            // Get information about the notification that was opened
            this.handlePushNotification(notificationOpen.notification, true)
        }

	}

	handlePushNotification = (notification, wasAppClosed) => {
		var notifData = notification._data;
        setTimeout(() => {
            const {authToken = ''} = this.props
            const {currentUser} = firebase.auth()
            const {notifType} = notifData
            if(!_.isEmpty(currentUser)) {
                // If the notification informed about a new available task:
                if(notifType == 'SERVICE_REQUEST')
                {
                	this.navigator.dispatch(
        				NavigationActions.navigate({ routeName: 'Home' })
      					);
                }
                // If the notification asked to open Dashboard Details screen:
                else if(notifType == 'OPEN_DASHBOARD_DETAILS')
                {
                    this.navigator.dispatch(
        				NavigationActions.navigate({ routeName: 'DashboardDetails', params: {taskId: notifData.taskId}})
      					);
                }
                // If the notification asked to open Chat screen:
                else if(notifType == 'OPEN_CHAT')
                {
                    this.navigator.dispatch(
        				NavigationActions.navigate({ routeName: 'Chat', params: {taskId: notifData.taskId}})
      					);
                }
                else if(notifType == 'OPEN_CHAT_DIRECT')
                {
                    this.navigator.dispatch(
        				NavigationActions.navigate({ routeName: 'ChatDirect', params: {targetUid: notifData.targetUid}})
      					);
                }
            }
        }, 1000)
    }

	  render(){
	    return(
	      <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
          <AppContainer ref={nav => { this.navigator = nav; }} />
	         {/*<RootNav  />*/}
	        { /* <AddDetails /> */}
	      </Provider>
	    )
  }
}

export default App;
