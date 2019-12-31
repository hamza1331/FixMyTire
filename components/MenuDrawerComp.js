/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React from 'react'
import {View,Text,TouchableOpacity,AsyncStorage,Linking} from'react-native'
import {Avatar,Button,SocialIcon} from 'react-native-elements'
import { connect } from "react-redux";
import firebase from 'react-native-firebase'
import { url } from "./Proxy";
import { setUserInfoAction,LoginAction } from "../store/actions/actions";
class MenuDrawer extends React.Component{
    state={
        data:[{text:"category 1",iconname:'artist-outline'},{text:"category 1",iconname:'artist-outline'},{text:"category 1",iconname:'artist-outline'},{text:"category 1",iconname:'artist-outline'},{text:"category 1",iconname:'artist-outline'},{text:"category 1",iconname:'artist-outline'}],
        ismodalVisible:false,
        isRTL:true
    }
    Openmodal=()=>{
        this.setState({
            ismodalVisible:true
        })
    }
    Closemodal=()=>{
        this.setState({
            ismodalVisible:false
        })
    }
    navLink(nav,text){
     return(
         <TouchableOpacity onPress={()=>{this.props.navigation.navigate(nav)}}>
             <Text style={{fontSize:15,fontWeight:'bold',marginLeft:20,marginTop:20}}>{text}</Text>
         </TouchableOpacity>
     )
    }
    componentDidMount(){
        if(this.props.userInfo!==null){
            console.log('drawer => ',this.props.userInfo)
        }
    }
render(){
    return(  
    <View style={{flex:1}}>
     <View style={{backgroundColor:'black',height:160,width:'100%',flexDirection:'row'}}>
     <Avatar containerStyle={{marginLeft:30,marginTop:40}} onPress={()=>{this.props.navigation.navigate('Profile')}}
       size="large"
       rounded
       source={{
         uri:
        'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
       }}
     />  
     <Text style={{fontSize:20,fontWeight:'bold',color:'white',marginLeft:10,marginTop:60}}>Hamza Ali</Text>
     </View>
     {this.state.isRTL?
      <View style={{marginTop:20,marginRight:8,alignItems:'flex-end'}}>
      {this.navLink('Home','مرکزی')}
      {this.navLink('Profile','میری پروفائل')}
      {this.props.isCustomer===true &&this.navLink('CustomerDocument','کسٹمر دستاویز')}
      {this.props.isCustomer===false && this.navLink('Earnings','کمایا۔')}
      {this.navLink('RateList','کام کا معاوضہ')}
      {this.navLink('OrderList','آرڈر لسٹ۔')}
     
      </View>
      :
      <View style={{marginTop:20,marginLeft:5}}>
       {this.navLink('Home','Home')}
      {this.navLink('Profile','My Profile')}
      {this.navLink('Earnings','Earning')}
      {this.navLink('OrderList','OrderList')}
     
      </View>
     }
    
     <View style={{alignItems:'center',justifyContent:'flex-end'}}>
          <View style={{position: 'absolute',
      width:180,
      height:40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#d66933',
      borderRadius:10,
      marginTop:50,
      top:'50%',
      bottom:'10%',
      marginBottom:15
      }}>
          {this.state.isRTL?
                      <Button title="ایپ سے سائن آؤٹ کریں۔" onPress={()=>{
                        firebase.auth().signOut().then(()=>{
                            fetch(url+'/api/logout'+this.props.UID)
                            .then(res=>res.json())
                            .then(data=>{
                                if(data.message=='Success'){
                                    AsyncStorage.removeItem('userData')
                                    this.props.navigation.toggleDrawer()
                                    this.props.navigation.navigate("Language")
                                }
                            })
                          }).catch(function(error) {
                            console.log(error)
                          });
                      }} buttonStyle={{backgroundColor:'#d66933',height:40}}/>
 :
                    <Button title="Sign Out"  buttonStyle={{backgroundColor:'#d66933',height:40}}/>

        }
          </View>
          </View>
         
                <View style={{
position: 'absolute',
width:180,
height:40,
backgroundColor:'transparent',
borderRadius:10,
marginTop:50,
top:'70%',
bottom:'10%',
marginBottom:15,
alignSelf:"center"
                }}>

<View style={{flex:1,flexDirection:'row',justifyContent:'space-evenly'}}>
<SocialIcon
  title='Youtube Channel'
  onPress={()=>{
      Linking.openURL('https://youtube.com/channel/UCGCbEi3c9Cie71MVJp9QPog/featured')
  }}
  type='youtube'
  iconSize={40}

  style={{height:55}}
/>
<SocialIcon
  title='Visit Facebook Page'
  onPress={()=>{
      Linking.openURL('https://www.facebook.com/Sokhay-Painday-110042267098405/')
  }}
  type='facebook'
  iconSize={40}
  style={{height:55}}
/>
</View>
                </View>
    </View>
    )
}
}

function mapStateToProps(state){
    return({
      isCustomer:state.rootReducer.isCustomer,
      userInfo:state.rootReducer.userInfo,
      UID:state.rootReducer.UID
    })
  }
  function mapActionsToProps(dispatch){
    return({
       setUserData:(userData)=>{
          dispatch(setUserInfoAction(userData))
       },
       login:(data)=>{
        dispatch(LoginAction(data))
       },
       setType:(data)=>{
        dispatch(setUserTypeAction(data))
       }
    })
  }
  export default connect(mapStateToProps,mapActionsToProps)(MenuDrawer)
