import React from 'react';
import {View} from 'react-native';
import { Badge } from 'react-native-elements';
import {connect} from 'react-redux';
import {getTotalUnread, getTotalInterested} from "../lib/firebaseUtils";
import firebase from 'react-native-firebase';

let uid;

class IconWithBadge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unreadNotifs: 0,
      totalInterestCount: 0,
    }
  }
  componentDidMount(){
    this._isMounted = true;
    let user = firebase.auth().currentUser;
    if (user != null) {
      uid = user.uid;
    }

    getTotalUnread(uid).then(result => {
      if(this._isMounted) this.setState({unreadNotifs: result})
    });
    getTotalInterested(uid).then(result => {
      if(this._isMounted) this.setState({totalInterestCount: result})
    })

    this.liveUpdates();
  }

  componentWillUnmount()
  {
      this._isMounted = false;
  }

  liveUpdates = () => {

    //Live update for unread chat count
    let ref = firebase.database().ref(`users/${uid}/messages/`);
    ref.on('value', (snapshot) => {
      getTotalUnread(uid).then(result => {
        if(this._isMounted) this.setState({unreadNotifs: result})
      });
    })

    //Live update for interested people count
    let interestRef = firebase.database().ref(`users/${uid}/totalInterested/`);
    interestRef.on('value', (snapshot) => {
      getTotalInterested(uid).then(result => {
        if(this._isMounted) this.setState({totalInterestCount: result})
      });
    })

  }

  render() {

    return (
      <View>
        {(this.state.unreadNotifs > 0 && !this.props.chatScreenActive) && <Badge status="success" value={this.state.unreadNotifs} containerStyle={{ position: 'absolute', top: -34, right: -18 }} />}
        {(this.state.totalInterestCount > 0 && this.state.unreadNotifs == 0) && <Badge status="primary" containerStyle={{ position: 'absolute', top: -34, right: -5 }} />}
        </View>
    );
  }
}

const mapStateToProps = state => {
  /* only return the property that we care about */
  return{
    chatScreenActive: state.general.chatScreenActive,
  };
};

export default connect(mapStateToProps)(IconWithBadge);
