import firebase from 'react-native-firebase'
import uuid from 'react-native-uuid'
import {Alert} from 'react-native'
import * as _ from 'lodash'
/*
* method to post the service request.
* */
export const postServiceRequest = (serviceId) => new Promise((resolve, reject) => {
    try {
        console.log('inside posting Req')
        const {currentUser: {uid} = {}} = firebase.auth()
        firebaseReferences.SERVICES_REQUESTS.once('value', (snapshot) => {
            let servicesRequests = snapshot.val()
            if (_.isEmpty(servicesRequests)) {
                servicesRequests = {}
            }
            const id = uuid.v4()
            servicesRequests[id] = {id, serviceId, clientId: uid}
            firebaseReferences.SERVICES_REQUESTS.update(servicesRequests).then(res => {
                Alert.alert('succesfully requested.')
                resolve(true)
            })
        })
    } catch (e) {
        reject(e)
    }
})

/*
* method toget all the task that user with userId can perform
* */
export const getMyTasks = (userId) => new Promise((resolve, reject) => {
    try {
        getMyServices(userId).then(myServices => {
            console.log('myServices: ', myServices)
            if (!Array.isArray(myServices) || !myServices.length) {
                resolve([])
                return
            }
            firebase.database().ref('servicesRequests')
                .once('value', (snapshot) => {
                    let myTasks = []
                    const allRequests = snapshot.val() || {}
                    console.log('allRequests: ', allRequests)
                    const keys = Object.keys(allRequests)
                    for (let key of keys) {
                        if (_.includes(myServices, allRequests[key].serviceId)) {
                            myTasks.push(allRequests[key])
                        }
                    }
                    console.log('myTasks: ', myTasks)
                    resolve(myTasks)
                    return
                })
        })
    } catch (e) {
        reject(e)
    }
})

/*
* get all the services that user with userId can perform
* */
export const getMyServices = (userId) => new Promise((resolve, reject) => {
    try {
        firebase.database().ref(`users/${userId}`).once('value', (snapshot) => {
            const user = snapshot.val() || []
            resolve(user.services)
        })
    } catch (e) {
        reject(e)
    }
})


/*
* kept firebase reference in one place
* */
export const firebaseReferences = {
    USERS: firebase.database().ref('/users'),
    SERVICES: firebase.database().ref('/services'),
    SERVICES_REQUESTS: firebase.database().ref('/servicesRequests')
}