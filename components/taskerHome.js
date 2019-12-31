/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Text, View,PermissionsAndroid,Platform,Linking,Alert} from 'react-native'
 import { connect } from 'react-redux';
import {Header,Icon,Button,Avatar,Overlay} from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Spinner from 'react-native-spinkit'
import Geolocation from '@react-native-community/geolocation';
import MapView from 'react-native-maps'
import SocketIOClient from 'socket.io-client'
import { url } from "./Proxy";
import Polyline from '@mapbox/polyline';
import { createChatAction,setOrderDetailsAction } from "../store/actions/actions";
navigator.geolocation = Geolocation
const socket = SocketIOClient(url);
class TaskerHome extends Component {
 
  constructor(props) {
    super(props)
    this.state = {
      isRTL:true,
      modalInfo:false,
      isCustomer:false,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      acceptModal:false,
      customerPosition:null,
      cuustomerFirebaseUID:null,
      taskerData:null,
      customerData:null,
      orderData:null,
      coords:null,
      distance:"",
      requested:false,
      distanceValue:""
    }
    this.requestOrder=this.requestOrder.bind(this)
    this.acceptOrder=this.acceptOrder.bind(this)
    this.handleCall=this.handleCall.bind(this)
  }
  watchID= null;

  toggleLocale = () => {
    this.setState({
      locale: (this.state.locale == 'ar' ? 'en' : 'ar')
    })
  }
  handleCall(){
    if(this.props.isCustomer===true && this.state.taskerData!==null){
    Linking.openURL(`tel:${this.state.taskerData.mobile}`)
    }
    else if(this.props.isCustomer===false &&this.state.customerData!==null){
    Linking.openURL(`tel:${this.state.customerData.mobile}`)
    }
  }
 openModalinfo=()=>{
   this.setState({
     modalInfo:true
   })
 }
 requestOrder(){
  if(this.props.isCustomer){
    let position = this.state.initialPosition
    if(position.coords!==undefined){
      let data = {
        latitude:position.coords.latitude,
        longitude:position.coords.longitude,
        firebaseUID:this.props.UID
      }
      if(data.firebaseUID!==undefined){
        socket.emit('request',data)
        this.setState({
          requested:true
        })
      }
    }
  }
 }
 async componentDidMount() {
  let coord = {
    coords:{
      latitude:31.8024737,
      longitude:74.2590148
    },
  }
  this.setState({
    initialPosition:coord
  })
  var that =this;
  //Checking for the permission just after component loaded
  if(Platform.OS === 'ios'){
      this.callLocation(that);
  }else{
      async function requestCameraPermission() {
          try {
              const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,{
                      'title': 'Location Access Required',
                      'message': 'This App needs to Access your location'
                  }
              )
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  //To Check, If Permission is granted
                  that.callLocation(that);
              } else {
                Alert.alert("Failed","Permission Denied")
              }
          } catch (err) {
            Alert.alert("Failed",JSON.stringify(err))
          }
      }
     await requestCameraPermission();
  }    
  // Geolocation.getCurrentPosition(
  //   position => {
  //     console.log(position)
  //     this.setState({initialPosition:position});
  //   },
  //   error => {
  //     // let coord = {
  //     //   coords:{
  //     //     latitude:31.8024737,
  //     //     longitude:74.2590148
  //     //   },
  //     // }
  //     // this.setState({
  //     //   position:coord
  //     // })
  //     console.log(error)
  //   },
  //   {enableHighAccuracy: true},
  // );
  this.watchID = Geolocation.watchPosition(position => {
    
    this.setState({lastPosition:position});
    if(this.state.lastPosition!=='unknown' &&this.props.isCustomer===false){

      let data = {
        latitude:position.coords.latitude,
        longitude:position.coords.longitude,
        firebaseUID:this.props.UID
      }
      socket.emit('location',data)
    }
  });
  // setTimeout(()=>{
  //   this.openModalinfo()
  // },3000)
  if(this.props.userID!==null){
    socket.emit('connected',this.props.userID)
  }
  socket.on('order_created',data=>{
    let response = JSON.parse(data)
    let chatID = response.orderData._id
    this.props.createChat(chatID)
    let order = {
      ...response,
      distanceValue:this.state.distanceValue,
      distance:this.state.distance
    }
    this.props.setOrderDetails(order)
    this.setState({
      acceptModal:false,
      customerData:response.customerData,
      taskerData:response.taskerData,
      orderData:response.orderData,
      requested:false,
      modalInfo:true
    })
  })
  socket.on('locationupdated',data=>{

  })
  socket.on('order_completed',data=>{
    this.props.navigation.navigate('Home')
    this.setState({
      modalInfo:false
    })
  })
  socket.on('requested',data=>{
    let request = JSON.parse(data)
    if(request.latitude!==undefined){
      let customerPosition= {
        longitude:request.longitude,
        latitude:request.latitude
      }
      this.setState({
        customerPosition,
        acceptModal:true,
        cuustomerFirebaseUID:request.firebaseUID
      })
      this.getDirections(`${this.state.initialPosition.coords.latitude},${this.state.initialPosition.coords.longitude}`,`${request.latitude}, ${request.longitude}`)
  }
  })
}
callLocation(that){
  //alert("callLocation Called");
  navigator.geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
          const currentLongitude = JSON.stringify(position.coords.longitude);
          //getting the Longitude from the location json
          const currentLatitude = JSON.stringify(position.coords.latitude);
          this.setState({initialPosition:position})
          //getting the Latitude from the location json
          that.setState({ currentLongitude:currentLongitude });
          //Setting state Longitude to re re-render the Longitude Text
          that.setState({ currentLatitude:currentLatitude });
          //Setting state Latitude to re re-render the Longitude Text
      },
      (error) => alert(error.message)
  );
  that.watchID = navigator.geolocation.watchPosition((position) => {
      //Will give you the location on location change
      this.setState({lastPosition:position})
      const currentLongitude = JSON.stringify(position.coords.longitude);
      //getting the Longitude from the location json
      const currentLatitude = JSON.stringify(position.coords.latitude);
      //getting the Latitude from the location json
      that.setState({ currentLongitude:currentLongitude });
      //Setting state Longitude to re re-render the Longitude Text
      that.setState({ currentLatitude:currentLatitude });
      //Setting state Latitude to re re-render the Longitude Text
  });
}
componentWillUnmount = () => {
  navigator.geolocation.clearWatch(this.watchID);
}
async getDirections(startLoc, destinationLoc) {
  try {
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=AIzaSyD8DFmgyvYcEyrtPcx3kAhGh5s0wWYTSq4`)
      let respJson = await resp.json();
      let distance = respJson.routes[0].legs[0].distance.text
      let distanceValue = respJson.routes[0].legs[0].distance.value
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return  {
              latitude : point[0],
              longitude : point[1]
            }
          })
          this.setState({coords: coords,distance,distanceValue})
      return coords
  } catch(error) {
      alert(error)
      return error
  }
}
acceptOrder(){
  if(this.state.cuustomerFirebaseUID!==null && this.props.UID!==''){
    let data = {
      userFirebaseUID:this.state.cuustomerFirebaseUID,
      taskerFirebaseUID:this.props.UID
    }
    socket.emit('acceptrequest',data)
  }
}
componentWillUnmount() {
  this.watchID != null && Geolocation.clearWatch(this.watchID);
}

  render() {
    return (
      <View style={{ flex: 1,backgroundColor:'white'}}>
        {this.state.isRTL?
        <Header  
        rightComponent={
     <Icon  containerStyle={{marginBottom:10,marginRight:10}}
     name="ios-menu"
     type="ionicon"
     color="white"
     size={40}
     onPress={()=>this.props.navigation.toggleDrawer()}
     />
       }
       centerComponent={this.state.isRTL?
         <Text style={{fontSize:30,color:'white',marginBottom:10}}>آپ کی جگہ
         </Text>
         :
         <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>Your Location
         </Text>
         }                  containerStyle={{backgroundColor:'gray',
       height: Platform.OS === 'ios' ? 70 :  70 - 10}}
       />
       :
       <Header  placement="left"
       leftComponent={
    <Icon  containerStyle={{marginBottom:10,marginLeft:10}}
    name="ios-menu"
    type="ionicon"
    color="white"
    size={40}
    onPress={()=>this.props.navigation.toggleDrawer()}
    />
      }
      centerComponent={this.state.isRTL?
        <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>آپ کی جگہ
        </Text>
        :
        <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>Your Location
        </Text>
        }                  containerStyle={{backgroundColor:'gray',
      height: Platform.OS === 'ios' ? 70 :  70 - 10}}
      />
       
        }
      

                {this.state.initialPosition!=='unknown' &&<MapView style={{height:hp('75%'),width:wp('100%')}}  initialRegion={{
                    latitude: this.state.initialPosition.coords.latitude,
                    longitude: this.state.initialPosition.coords.longitude,
                    latitudeDelta: 0.0015,
                    longitudeDelta: 0.0051,
                  }}>
                     <MapView.Marker
                    coordinate={{
                      latitude: this.state.initialPosition.coords.latitude,
                      longitude: this.state.initialPosition.coords.longitude,
                      latitudeDelta: 0.0122,
                      longitudeDelta: 0.0421,
                    }}
                    />
                  </MapView>}
                
          {this.props.isCustomer===true &&this.state.taskerData!==null&&<Overlay isVisible={this.state.modalInfo} animation='slide-down' borderRadius={30} overlayStyle={{height:hp('30%'),position:'absolute',bottom:10,width:wp('90%')}} containeStyle={{flexDirection:'row',alignItems:'flex-end'}}>
    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
    <Avatar
                  size='large'
  rounded
  source={{
    uri:
     this.state.taskerData.profilePic!==undefined?this.state.taskerData.profilePic:'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
  }}
/>
<Text style={{textAlign:'center',marginLeft:25,marginTop:20,fontSize:20}}>{this.state.taskerData.fName}</Text>
    </View>
    <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:50}}>
   
<Button onPress={()=>{
  this.setState({
    modalInfo:false
  })
  
  this.props.navigation.navigate('Chat')
}} title='Chat with Tasker'  />
<Button onPress={this.handleCall} title={`Call(${this.state.taskerData.mobile})`}  />
    </View>
</Overlay>}
{this.props.isCustomer===false &&this.state.customerData!==null&&<Overlay isVisible={this.state.modalInfo} animation='slide-down' borderRadius={30} overlayStyle={{height:hp('30%'),position:'absolute',bottom:10,width:wp('90%')}} containeStyle={{flexDirection:'row',alignItems:'flex-end'}}>
<View style={{flexDirection:'row',justifyContent:'space-around'}}>
<Avatar
              size='large'
rounded
source={{
uri:
 this.state.customerData.profilePic!==undefined?this.state.customerData.profilePic:'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
}}
/>
<Text style={{textAlign:'center',marginLeft:25,marginTop:20,fontSize:20}}>{this.state.customerData.fName}</Text>
</View>
<View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:50}}>

<Button onPress={()=>{
this.setState({
modalInfo:false
})
this.props.navigation.navigate('Chat')
}} title='Chat with Client'  />
<Button onPress={this.handleCall} title={`Call(${this.state.customerData.mobile})`}  />
</View>
<View style={{flex:1,justifyContent:"center",alignItems:"center",marginTop:10}}>
<Button  buttonStyle={{backgroundColor:"darkorange",width:"60%",alignSelf:"center",justifyContent:"center",borderRadius:20}} titleStyle={{textAlign:"center",alignSelf:"center"}} onPress={()=>{
  this.setState({modalInfo:false})
  this.props.navigation.navigate('OrderCompletion')}} title='Complete Order'  />
  </View>
</Overlay>}
<Overlay isVisible={this.state.acceptModal&&this.props.isCustomer==false} animation='slide-down' fullScreen={true} borderRadius={30} >
<Header  
    style={{width:wp('100%')}}
    centerComponent={{text:this.state.distance,style:{fontSize:20,fontWeight:"bold"}}}
        rightComponent={
     <Icon  containerStyle={{marginBottom:30}}
     name="close"
     type="ant-design"
     color="black"
     size={50}
     onPress={()=>this.setState({
       acceptModal:false
     })}
    
     />
       }
      
                         containerStyle={{backgroundColor:'white',
       height: Platform.OS === 'ios' ? 70 :  70 - 10}}
       />
       {/* <View style={{backgroundColor:'lightgray',width:wp('95%'),height:hp('70%'),}}>

       </View> */}
       <MapView style={{height:hp('75%'),width:wp('100%')}}  initialRegion={{
                    latitude: this.state.customerPosition!==null?this.state.customerPosition.latitude: 31.8024737,
                    longitude: this.state.customerPosition!==null?this.state.customerPosition.longitude:74.2590148,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}>
       <MapView.Marker
                    coordinate={{
                      latitude: this.state.customerPosition!==null?this.state.customerPosition.latitude: 31.8024737,
                      longitude: this.state.customerPosition!==null?this.state.customerPosition.longitude:74.2590148,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    />
                    {this.state.coords!==null && 
                          <MapView.Polyline 
            coordinates={this.state.coords}
            
            strokeWidth={6}
            strokeColor="red"/>}
                  </MapView>
                  
        <Button onPress={this.acceptOrder} title='Accept' buttonStyle={{width:wp('70%'),marginTop:30}} containerStyle={{alignItems:'center',justifyContent:'center'}} />
</Overlay>
{this.props.isCustomer?
<View style={{justifyContent:'center',alignItems:'center',height:hp('13%'),width:wp('100%')}}>
{(this.state.isRTL && this.state.requested===false)&&<Button onPress={this.requestOrder} title='درخواست کریں۔' buttonStyle={{width:wp('50%'),backgroundColor:"darkorange"}}>درخواست کریں۔</Button>}
{this.state.requested===true && this.state.isRTL &&
  <View style={{flex:1,justifyContent:'center'}}>
    <Text style={{fontSize:18,fontWeight:"bold"}}>برائے مہربانی انتظار کریں</Text>
<Spinner style={{alignSelf:"center"}}  isVisible={true} color='red' size={35} type='Pulse'></Spinner>
  </View>
}
{this.state.requested===false && this.state.isRTL==false && <Button title='Request' buttonStyle={{width:wp('50%')}} titleStyle={{textAlign:"center"}}>Request</Button>}
</View>

:
<View style={{justifyContent:'center',alignItems:'center',height:hp('13%'),width:wp('100%')}}>
<Spinner style={{position:'absolute',bottom:330}} isVisible={true} color='green' size={70} type='Pulse'></Spinner>
{this.state.isRTL?<Text style={{fontSize:30,color:'green'}}>آرڈر کے منتظر</Text>:<Text style={{fontSize:30,color:'green'}}>Awaiting For Order</Text>}
</View>
}
 </View>
    )
  }
}

function mapStateToProps(state){
  return({
    isCustomer:state.rootReducer.isCustomer,
    userInfo:state.rootReducer.userInfo,
    userID:state.rootReducer.userID,
    UID:state.rootReducer.UID
  })
}
function mapActionsToProps(dispatch){
  return({
     createChat:(chat)=>{
      dispatch(createChatAction(chat))
     },
     setOrderDetails:(order)=>{
      dispatch(setOrderDetailsAction(order))
     }
  })
}
 
export default connect(mapStateToProps,mapActionsToProps)(TaskerHome)
