

import React from 'react'
import {Platform,Dimensions} from 'react-native'
import {createDrawerNavigator,createAppContainer} from 'react-navigation'
import HomeScreen from '../screens/homescreen'
import OthersScreen from '../screens/other'
import SettingsScreen from '../screens/setting'
import MenuDrawer from '../components/MenuDrawerComp'

const Width = Dimensions.get('window').width
const drawerConfig={
    drawerWidth:Width*0.83,
    contentComponent:({navigation})=>{
        return <MenuDrawer navigation={navigation} /> 
    }
}
const DrawerNavigatior= createDrawerNavigator({
    HomeScreen:{
        screen:HomeScreen
    },
    Others:{
        screen:OthersScreen
    },
    Settings:{
        screen:SettingsScreen
    }
},drawerConfig
)
export default createAppContainer(DrawerNavigatior)