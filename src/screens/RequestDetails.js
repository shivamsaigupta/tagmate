import React, {Component} from 'react';
import {Card, ListItem, Button} from 'react-native-elements';
import {View, ActivityIndicator, StyleSheet, Text, TextInput} from 'react-native';
import firebase from 'react-native-firebase'
import {postServiceRequest,canRequestMore} from "../lib/firebaseUtils";

class RequestDetails extends Component{
  	constructor(props) {
        super(props);
        this.state = {
            disabledBtn:false,
            when:'',
            details:'',
        }
    }

  	sendRequest = () =>
    {
        if(this.state.disabledBtn == true) return;
        else
        {
            this.setState({disabledBtn:true});
            const {currentUser: {uid} = {}} = firebase.auth();
            const {when, details} = this.state;
            if(when.length == 0) return this.erred('Please input when.');
            if(when.length > 20) return this.erred('When should not exceed 20 characters.');
            if(details.length > 60) return this.erred('Details should not exceed 60 characters.');
            canRequestMore(uid).then(requestMore => {
                if(requestMore) postServiceRequest({serviceId:this.props.navigation.state.params.item.id,when:when,details:details}).then(res => {
                this.props.navigation.navigate('RequestScreen');
            });
                else
                {
                    return this.erred('Sorry, you have as many ongoing requests as your Adour coin balance.');
                }
            });
        }
    }

    erred = (msg) => {
        this.setState({disabledBtn:false});
        return alert(msg);
    }

  render(){
  	const { title } = this.props.navigation.state.params.item;
    return(
      	<View style={styles.backgroundContainer}>
	        <Card title='Request Service'>
	            <Text style={styles.requestTitle}>{title}</Text>
	            <Text>When?</Text>
	            <TextInput
	            placeholder="Required"
	            style={styles.textInput}
	            onChangeText={when => this.setState({ when: when })} />
	            <Text>Details?</Text>
	            <TextInput
	            placeholder="Optional"
	            style={styles.textInput}
	            onChangeText={details => this.setState({ details: details })} />
	            <Button title="Request"  disabled={this.state.disabledBtn} onPress={() => {this.sendRequest()}}/>
	        </Card>
	    </View>
    )
  }
}
/*
<View>
    <Text>Provide additional details</Text>
</View>
*/
export {RequestDetails};

const styles = StyleSheet.create({
		backgroundContainer: {
		flex: 1,
		paddingLeft: 15,
		paddingRight: 8
	},
    mainContainer: {
        flex: 1,
    },
    progressContainer: {
        left: '50%',
        top: '50%',
        width: 100,
        height: 100,
        backgroundColor: 'transparent',
        marginLeft: -50,
        marginTop: -50

    },
    requestTitle: {
        fontWeight: 'bold',
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 8,
    },
})