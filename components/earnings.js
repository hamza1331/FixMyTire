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
import { Text, View, TouchableHighlight,FlatList} from 'react-native'
 
// Import { RTLView, RTLText } from react-native-rtl-layout
import {Header,Icon,Button,Avatar,Rating} from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from "react-redux";
import { url } from "./Proxy";
 
class Earnings extends Component {
 
  constructor(props) {
    super(props)
    this.state = {
      locale: 'ar',
      lastWeekEarning:0,
      totalEarned:0,
      ordersLastWeek:0,
      totalOrders:0,
      isSat:true,
      payable:0
    }
  }
 
  toggleLocale = () => {
    this.setState({
      locale: (this.state.locale == 'ar' ? 'en' : 'ar')
    })
  }
  componentDidMount(){
    if(this.props.UID&&this.props.isCustomer===false){
      fetch(url+'/api/getEarnings'+this.props.UID)
      .then(res=>res.json())
      .then(data=>{
        if(data.message==='Success'){
          this.setState({
            lastWeekEarning:data.doc.earning.lastWeekEarning,
            totalEarned:data.doc.earning.totalEarned,
            ordersLastWeek:data.doc.activity.ordersLastWeek,
            totalOrders:data.doc.activity.totalOrders,
            payable:data.doc.activity.ordersLastWeek*10
          })
        }
      }).catch(err=>{
        console.log(err)
      })
      let date = new Date()
      if(date.getDay()===6){
        this.setState({isSat:false})
      }
    }
  }
  render() {
    return (
      <View style={{ flex: 1,backgroundColor:'white'}}>
         <Header  placement="left"
                  rightComponent={
                <Icon  containerStyle={{marginBottom:10,marginLeft:10}}
                name="ios-menu"
                type="ionicon"
                color="white"
                size={40}
                />
                  }
                  centerComponent={<Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>کمایا</Text>}
                  containerStyle={{backgroundColor:'gray',
                  height: Platform.OS === 'ios' ? 70 :  70 - 10}}
                  />
                  <View style={{backgroundColor:'white',height:hp('35%'),width:wp('100%'),justifyContent:'center'}}>
                    <Text style={{fontSize:20,textAlign:'center'}}>رقم جو آپ کو ادا کرنا ہوگی۔</Text>
                    <Text style={{fontSize:40,textAlign:'center',color:'darkorange'}}>Rs.{this.state.payable}</Text>
                  </View>
                  <View style={{justifyContent:'center'}}>
                   <View style={{flexDirection:'row',justifyContent:'space-between',marginRight:20,marginLeft:20,marginBottom:10}}>
                    <Text style={{fontSize:20}}>{this.state.totalOrders}</Text>
                    <Text  style={{fontSize:20}}>مجموعی طور پر کام</Text>
                   </View>
                   <View style={{flexDirection:'row',justifyContent:'space-between',marginRight:20,marginLeft:20,marginBottom:10}}>
                    <Text  style={{fontSize:20}}>Rs. {this.state.totalEarned}</Text>
                    <Text  style={{fontSize:20}}>کل کمائی</Text>
                   </View>
                   <View style={{flexDirection:'row',justifyContent:'space-between',marginRight:20,marginLeft:20,marginBottom:10}}>
                    <Text  style={{fontSize:20}}>{this.state.ordersLastWeek}</Text>
                    <Text style={{fontSize:20}}>پچھلے ہفتے مجموعی طور پر کام</Text>
                   </View>
                   <View style={{flexDirection:'row',justifyContent:'space-between',marginRight:20,marginLeft:20,marginBottom:10}}>
                    <Text style={{fontSize:20}}>Rs.{this.state.lastWeekEarning}</Text>
                    <Text style={{fontSize:20}}>پچھلے ہفتے کی آمدنی</Text>
                   </View>
                  </View>

                    <Text style={{fontSize:18,marginTop:10,textAlign:"center",fontWeight:"bold"}}>ایزی پیسہ یا جازکاش اکاؤنٹ
                     (0304-6092466 - عبد الشکور) کے ذریعے ہر ہفتہ کو اپنے واجبات ادا کریں۔</Text>

                  <View style={{backgroundColor:'white',height:hp('10%'),width:wp('100%')}}>
                    
                  </View>
                 <Button disabledStyle={{backgroundColor:"gray"}} disabled={this.state.isSat} title='ابھی جمع کروائیں' containerStyle={{alignItems:'center'}} buttonStyle={{width:wp('80%'),backgroundColor:"darkorange"}}/> 
                
       </View>
    )
  }
}
function mapStateToProps(state){
  return({
    isCustomer:state.rootReducer.isCustomer,
    UID:state.rootReducer.UID
  })
}
function mapActionsToProps(dispatch){
  return({
     
  })
}
export default connect(mapStateToProps,mapActionsToProps)(Earnings);
