import React from 'react';
import {Image, View, Button} from 'react-native';
import { Icon, Badge } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firebase from 'react-native-firebase';
import { createBottomTabNavigator, createSwitchNavigator, createAppContainer, createStackNavigator} from 'react-navigation';
import IconWithBadge from "./screens/IconWithBadge";
import {ProfileScreen, EditProfileDetails, ViewProfile, EditBio, NewUserSetProfile, ViewURLHome, SupportScreen, DirectMessages, PostDetails, ViewGuestList, ViewImage, PrivacyPolicyScreen, ToS, BlockAccess, RequestScreen, CreatePost, HomeScreen, BlockList, GuestList, DashboardScreen, DashboardDetails, Loading, Onboarding, OnboardingSplash, EditEvent} from './screens';
import Login from './screens/auth/Login';
import SignUp from './screens/auth/SignUp';
import EmailLogin from './screens/auth/EmailLogin';
import ActivityChat from './screens/ActivityChat';
import DirectChat from './screens/DirectChat';
import {routerStyle, BRAND_COLOR_TWO} from './screens/style/RouterStyle';


// Stack Navigator for Profile and Edit Profile screens:
export const ProfileStack = createStackNavigator(
  {
    ProfileScreen: {
      screen: ProfileScreen,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Profile',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    EditProfileDetails: {
      screen: EditProfileDetails,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'My Interests',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    BlockList: {
      screen: BlockList,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Blocked Users',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    EditBio: {
      screen: EditBio,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Edit Profile',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    SupportScreen: {
      screen: SupportScreen,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Support',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    PrivacyPolicyScreen: {
      screen: PrivacyPolicyScreen,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Privacy Policy',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    ToS: {
      screen: ToS,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Terms of Service',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
  }
)

// Stack Navigator for Request and Request Details screens:
export const RequestStack = createStackNavigator(
  {
    RequestScreen: {
      screen: RequestScreen,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: (<Image source={require('./img/logo_black.png')}/>),
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
  }
)

// Stack Navigator for Home screen:
export const HomeStack = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: (<Image source={require('./img/logo_black.png')}/>),
          headerRight: (
                        <View style={{marginRight: 18}}>
                        <Icon
                          name="ios-send"
                          size={26}
                          type='ionicon'
                          onPress={() => navigation.navigate('DirectMessages')}
                          color="grey"
                        />
                        </View>
                      ),
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    CreatePost: {
      screen: CreatePost,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Host A Meetup',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    ViewProfileHome: {
      screen: ViewProfile,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Host Details',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    PostDetails: {
      screen: PostDetails,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Post Details',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    ViewURLHome: {
      screen: ViewURLHome,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Website',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    DirectMessages: {
      screen: DirectMessages,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Direct Messages',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    DirectChat: {
      screen: DirectChat,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Direct Chat',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
  }
)

// Stack Navigator for Dashboard and Dashboard Details screens:
export const DashboardStack = createStackNavigator(
  {
    DashboardScreen: {
      screen: DashboardScreen,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Dashboard',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    DashboardDetails: {
      screen: DashboardDetails,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Activity Details',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    EditEvent: {
    screen: EditEvent,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: "Edit Event",
        headerTitleStyle: routerStyle.headerText
      };
    }
    },
    GuestList: {
      screen: GuestList,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Guest List',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    ViewGuestList: {
      screen: ViewGuestList,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Guest List',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    Chat: {
      screen: ActivityChat,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'Chat',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    ViewProfile: {
      screen: ViewProfile,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'View Profile',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
    ViewImage: {
      screen: ViewImage,
      navigationOptions: ({navigation}) => {
        return{
          headerTitle: 'View Image',
          headerTitleStyle: routerStyle.headerText
        }
      }
    },
  }
)

// Bottom Tab Navigator connecting all the above navigators as siblings:
export const MainTabNav = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        tabBarIcon: ({  focused, horizontal, tintColor  }) => (
          <Icon name='call-to-action' size={horizontal ? 20 : 25} color={tintColor} />
        ),
      },
    },
    Dashboard: {
      screen: DashboardStack,
      navigationOptions: {
        tabBarIcon: ({  focused, horizontal, tintColor  }) => (
          <View>
          <Icon name='dashboard' size={horizontal ? 20 : 25} color={tintColor} />
          <IconWithBadge />
          </View>
        ),
      },
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarIcon: ({  focused, horizontal, tintColor  }) => (
          <Icon name='account-circle' size={horizontal ? 20 : 25} color={tintColor} />
        ),
      },
    }
  },
  {
    navigationOptions: ({ navigation }) => {
      const {routeName} = navigation.state.routes[navigation.state.index]
      return {
        header: null,
        headerTitle: routeName
        }

    },
    tabBarOptions: {
      activeTintColor: BRAND_COLOR_TWO,
      inactiveTintColor: 'gray',
      labelStyle: routerStyle.bottomTabLabelStyle
    },
  }
);

export const MainStack = createStackNavigator(
  {
    MainTabNav: MainTabNav
  }
)
export const RootNav = createSwitchNavigator(
  {
    Loading,
    SignUp,
    Login,
    Onboarding,
    OnboardingSplash,
    NewUserSetProfile,
    MainStack,
    BlockAccess,
    EmailLogin,
  },
  {
    initialRouteName: 'Loading'
  }
)

export const AppContainer = createAppContainer(RootNav);
