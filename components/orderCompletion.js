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
import { Text, View} from 'react-native'
import {Header,Icon,Button,CheckBox} from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Dropdown } from 'react-native-material-dropdown';
import { connect } from "react-redux";
import { url } from "./Proxy";
import SocketIOClient from 'socket.io-client'
const socket = SocketIOClient(url);
class Ordercomplete extends Component {
 
  constructor(props) {
    super(props)
    this.state = {
      locale: 'ar',
      selectedIndex: 0,
      cd70:false,
      cd125:false,
      checking:false,
      tubeChange:false,
      Puncture:false,
      isRTL:true,
      data:[{
        value: 1,
      }, {
        value: 2,
      }, {
        value: 3,
      }],
      distanceCost:"",
      distance:"",
      punctureCost:"",
      tubeCost:"",
      totalCost:"0",
      serviceType:"Checking"
    }
    this.updateIndex = this.updateIndex.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
    
  }
  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }
  componentDidMount(){
    if(this.props.UID&&this.props.orderDetails!==null){
      // console.log('orderDetails => ',this.props.orderDetails.distanceValue)
      let distance = parseFloat(this.props.orderDetails.distanceValue)/1000
      distance = distance.toFixed(2)
      if(distance<=1){
        this.setState({
            distanceCost:50,
            distance,
            totalCost:50
        })
      }
      else if(distance>1){
        let cost = distance*50
        this.setState({
          distanceCost:cost,
          totalCost:cost,
          distance
        })
      }
    }
    socket.on('order_completed',data=>{
      console.log(data)
      this.props.navigation.navigate('Home')
    })
  }
  toggleLocale = () => {
    this.setState({
      locale: (this.state.locale == 'ar' ? 'en' : 'ar')
    })
  }
  handleSubmit(){
   /*
   taskerFirebaseUID,
   amount
   taskerId
   userId
   */
  let data = {
    taskerFirebaseUID:this.props.UID,
    amount:this.state.totalCost,
    taskerId:this.props.orderDetails.taskerData._id,
    userID:this.props.orderDetails.customerData._id,
    distance:this.state.distance,
    serviceType:this.state.serviceType,
    _id:this.props.orderDetails.orderData._id
  }
  socket.emit('completeorder',data)
  }
 ChangeChoice = ()=>{
   this.setState({
     cd70:true,
     cd125:false
   })
 }
 ChangeChoice125=()=>{
  this.setState({
    cd125:true,
    cd70:false
  })
 }
 ChangeChoiceSERP=()=>{
  this.setState({
   checking:false,
     tubeChange:false,
     Puncture:true,
     serviceType:'Puncture'
  })

 }
 ChangeChoieCHECK=()=>{
  this.setState({
    checking:true,
    tubeChange:false,
    Puncture:false,
    serviceType:'Checking'
  })
 
 }
 ChangeChoiceTube=()=>{
  this.setState({
    checking:false,
    tubeChange:true,
    Puncture:false,
    serviceType:'Tube Change'
  })
  if(this.state.cd70){
    this.setState({
      totalCost:this.state.distanceCost+250
    })
  }
  else if(this.state.cd125){
    this.setState({
      totalCost:this.state.distanceCost+300
    })
  }
 }
  render() {
    return (
      <View style={{ flex: 1,backgroundColor:'white'}}>
         <Header  placement="left"
                  rightComponent={
                <Icon  containerStyle={{marginBottom:10,marginLeft:10}}
                name="ios-arrow-forward"
                type="ionicon"
                color="white"
                onPress={()=>this.props.navigation.goBack()}
                size={40}
                />
                  }
                  centerComponent={
                  this.state.isRTL?
                  <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>تقاضے</Text>
                :
                <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>Requirements</Text>

              }
                  containerStyle={{backgroundColor:'gray',
                  height: Platform.OS === 'ios' ? 70 :  70 - 10}}
                  />
                  <View style={{backgroundColor:'white',height:hp('2%'),width:wp('100%')}}>
                  
                  </View>
                  
                  <View style={{backgroundColor:'white',height:hp('48%'),width:wp('100%'),paddingTop:20}}>
                   {this.state.isRTL?
                   <Text style={{marginRight:20,fontSize:18}}>موٹر سائیکل منتخب کریں۔</Text>
                   :
                   <Text style={{marginLeft:20,fontSize:18}}>Select Bike</Text>

}
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                    {this.state.isRTL?
                                    <CheckBox
                                    iconRight={true}
                                    center
                                    title='CD 70'
                                    checkedColor='darkorange'
                                    uncheckedColor='darkorange'
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.cd70}
                                    onPress={this.ChangeChoice}
                                  
                                  />:
                                  <CheckBox
                                  center
                                  title='CD 70'
                                  checkedColor='darkorange'
                                  uncheckedColor='darkorange'
                                  checkedIcon='dot-circle-o'
                                  uncheckedIcon='circle-o'
                                  checked={this.state.cd70}
                                  onPress={this.ChangeChoice}
                                
                                />
                                
                  }
      {this.state.isRTL?
        <CheckBox
        iconRight={true}
  title='CD 125'
  checkedIcon='dot-circle-o'
  uncheckedIcon='circle-o'
  checkedColor='darkorange'
  uncheckedColor='darkorange'
  checked={this.state.cd125}
  onPress={this.ChangeChoice125}
/>
:
<CheckBox
  title='CD 125'
  checkedIcon='dot-circle-o'
  uncheckedIcon='circle-o'
  checkedColor='darkorange'
  uncheckedColor='darkorange'
  checked={this.state.cd125}
  onPress={this.ChangeChoice125}
/>
        }

</View>
{(this.state.cd70===true||this.state.cd125===true)&&
  <View>
    {this.state.isRTL?
<View style={{alignItems:'flex-end'}}>
<Text style={{marginRight:20,fontSize:18}}>خدمت منتخب کریں۔</Text>

                  <CheckBox
                  right={true}
                  iconRight={true}
  containerStyle={{width:wp('50%')}}
  title='چیک کیا گیا۔'
  checkedIcon='dot-circle-o'
  checkedColor='darkorange'
  uncheckedColor='darkorange'
  uncheckedIcon='circle-o'
  checked={this.state.checking}
  onPress={this.ChangeChoieCHECK}

/>
<CheckBox
                  iconRight={true}
                  right={true}

containerStyle={{width:wp('50%')}}
  title='پنچر'
  checkedIcon='dot-circle-o'
  checkedColor='darkorange'
  uncheckedColor='darkorange'
  uncheckedIcon='circle-o'
  checked={this.state.Puncture}
  onPress={this.ChangeChoiceSERP}
/>
<CheckBox
                  iconRight={true}
                  right={true}

containerStyle={{width:wp('50%')}}
  title='ٹیوب بدل گئی۔'
  checkedIcon='dot-circle-o'
  checkedColor='darkorange'
  uncheckedColor='darkorange'
  uncheckedIcon='circle-o'
  checked={this.state.tubeChange}
  onPress={this.ChangeChoiceTube}
/>

  </View>:
  <View >
  <Text style={{marginLeft:20,fontSize:18}}>Select Service</Text>
  
                    <CheckBox
    containerStyle={{width:wp('50%')}}
    title='Checking'
    checkedIcon='dot-circle-o'
    checkedColor='darkorange'
    uncheckedColor='darkorange'
    uncheckedIcon='circle-o'
    checked={this.state.checking}
    onPress={this.ChangeChoieCHECK}
  
  />
  <CheckBox
  containerStyle={{width:wp('50%')}}
    title='Puncture'
    checkedIcon='dot-circle-o'
    checkedColor='darkorange'
    uncheckedColor='darkorange'
    uncheckedIcon='circle-o'
    checked={this.state.Puncture}
    onPress={this.ChangeChoiceSERP}
  />
  <CheckBox
  containerStyle={{width:wp('50%')}}
    title='Tube Change'
    checkedIcon='dot-circle-o'
    checkedColor='darkorange'
    uncheckedColor='darkorange'
    uncheckedIcon='circle-o'
    checked={this.state.tubeChange}
    onPress={() =>{
      if(this.state.cd70){
        let totalCost = this.state.distanceCost+250
        this.setState({
          totalCost
        })
      }
      else if(this.state.cd125){
        let totalCost = this.state.distanceCost+300
        this.setState({
          totalCost
        })
      }
    }}
    onPress={this.ChangeChoiceTube}
  />
  
    </View>

}

    </View>
}


{this.state.Puncture && <Dropdown
        label='Select Punctures'
        data={this.state.data}
        textColor='red'
        baseColor='red'
        onChangeText={value=>{
          let cost = value*70
          let totalCost = cost+this.state.distanceCost
          this.setState({
            punctureCost:cost,
            totalCost
          })
        }}
          fontSize={15}
          containerStyle={{width:wp('50%'),height:hp('25%')}}
      />
}
      
                  </View>
                  <View style={{backgroundColor:'white',height:hp('20%'),width:wp('100%'),paddingTop:20,alignItems:'center',justifyContent:'center',marginTop:20}}>
                    <Text style={{fontSize:30,color:'darkorange',marginBottom:5}}>Distance: {this.state.distance} KM</Text>
                    <Text style={{fontSize:30,color:'darkorange',marginBottom:5}}>Rs.{this.state.totalCost}</Text>
                    {this.state.isRTL?
                <Button title='آرڈر مکمل ہوا۔' onPress={this.handleSubmit} buttonStyle={{width:wp('50%'),backgroundColor:"darkorange"}}/>

                  :
                  <Button title='Complete Order' onPress={this.handleSubmit} buttonStyle={{width:wp('50%')}}/>

                  }
                  </View>
       </View>
      
    )
  }
}
function mapStateToProps(state){
  return({
    isCustomer:state.rootReducer.isCustomer,
    userInfo:state.rootReducer.userInfo,
    userID:state.rootReducer.userID,
    UID:state.rootReducer.UID,
    orderDetails:state.rootReducer.orderDetails
  })
}
function mapActionsToProps(dispatch){
  return({
     
  })
}
export default connect(mapStateToProps,mapActionsToProps)(Ordercomplete);
