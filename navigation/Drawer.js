/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React from 'react'
import {createAppContainer,createStackNavigator,createSwitchNavigator,createDrawerNavigator} from 'react-navigation'
import Earnings from '../components/earnings'
import OrderList from '../components/orderlist'
import Profile from '../components/Profile'
import EditProfile from '../components/EditProfile'
import OrderDetails from '../components/orderdetails'
import InfoMap from '../components/infomap'
import RateList from '../components/RateList'
import Splash from '../components/Splash'
import CustomerDocument from '../components/CustomerDocument'
import OrderCompletion from '../components/orderCompletion'
import Tasker from '../components/taskerHome'
import Login from '../components/LoginandVer'
import Register from '../components/registrationForm'
import MenuDrawer from '../components/MenuDrawerComp'
import { Dimensions } from "react-native";
import Language from '../components/languageSelection'
import Chat from '../src/components/chat'
const Width = Dimensions.get('window').width

const profileStack = createStackNavigator({
  Profile:Profile,
  EditProfile:{
    screen:EditProfile,
  }
},{initialRouteName:'Profile',headerMode:'none'})
const orderStack =createStackNavigator({
  OrderList:OrderList,
  OrderDetails:{
    screen:OrderDetails,
  }
},{initialRouteName:'OrderList',headerMode:'none'})
const homeStack =createStackNavigator({
      Home:Tasker,
      InfoMap:{
        screen:InfoMap,
      },
      OrderCompletion:{
        screen:OrderCompletion,
      },
      Chat:{
        screen:Chat
      },
      CustomerDocument:{
        screen:CustomerDocument
      },
      RateList:{
        screen:RateList
      }
  
},{initialRouteName:'Home',headerMode:'none'})
const drawerConfig={
  drawerWidth:Width*0.73,
  drawerPosition:'right',
  contentComponent:({navigation})=>{
      return <MenuDrawer navigation={navigation} /> 
  }
}

const drawerNavigator = createDrawerNavigator({
  Home:homeStack,
  Earnings:Earnings,
 OrderList:orderStack,
 MyProfile:profileStack
},drawerConfig)
const LoginStack=createStackNavigator({
  Language:Language,
  SignUP:{
    screen:Register,
  },
  Login:{
    screen:Login,
  },
  Splash:{
    screen:Splash
  }


},{initialRouteName:'Splash',headerMode:'none'
})
const rootSwitch = createSwitchNavigator({
  Login:LoginStack,
  DrawerNavigator:drawerNavigator,
  
})
export default createAppContainer(rootSwitch)
