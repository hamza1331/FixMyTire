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
import {Header,Icon,Avatar,Rating} from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from "react-redux";
 
class OrderDetails extends Component {
 
  constructor(props) {
    super(props)
    this.state = {
      locale: 'ar',
    }
  }
  componentDidMount(){
    if(this.props.orderData!==null){
      console.log('order data =>',this.props.orderData)
    }
  }
  toggleLocale = () => {
    this.setState({
      locale: (this.state.locale == 'ar' ? 'en' : 'ar')
    })
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
                  centerComponent={<Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>Order Details</Text>}
                  containerStyle={{backgroundColor:'gray',
                  height: Platform.OS === 'ios' ? 70 :  70 - 10}}
                  />
                  <View style={{backgroundColor:'white',height:hp('12%'),width:wp('100%')}}>
                    
                  </View>
                  <View style={{alignItems:'center'}}>
                  <Avatar
                  size='xlarge'
  rounded
  source={{
    uri:
      'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
  }}
/>
<View style={{flexDirection:'row',marginTop:20}}>
<Rating
  type='star'
  ratingCount={5}
  imageSize={30}

  onFinishRating={this.ratingCompleted}
/>
<Text style={{fontSize:20,marginLeft:8}}>(3.5)</Text>
</View>
<View style={{flexDirection:'row',marginTop:20,justifyContent:'space-between',width:wp('65%')}}>
<Text style={{fontSize:20,marginLeft:8}}>Distance</Text>
<Text style={{fontSize:20,marginLeft:8}}>24KM</Text>
</View>
<View style={{flexDirection:'row',marginTop:20,justifyContent:'space-between',width:wp('65%')}}>
<Text style={{fontSize:20,marginLeft:8}}>Service Type</Text>
<Text style={{fontSize:20,marginLeft:8}}>Puncture</Text>
</View>
<View style={{flexDirection:'row',marginTop:20,justifyContent:'space-between',width:wp('65%')}}>
<Text style={{fontSize:20,marginLeft:8}}>Amount</Text>
<Text style={{fontSize:20,marginLeft:8}}>Rs.100</Text>
</View>
<View style={{flexDirection:'row',marginTop:20,justifyContent:'space-between',width:wp('65%')}}>
<Text style={{fontSize:20,marginLeft:8}}>Time</Text>
<Text style={{fontSize:20,marginLeft:8}}>8:30 PM</Text>
          </View>
      </View>
  </View>
    )
  }
}
 
function mapStateToProps(state){
  return({
    isCustomer:state.rootReducer.isCustomer,
    orderData:state.rootReducer.orderData,
    UID:state.rootReducer.UID
  })
}
function mapActionsToProps(dispatch){
  return({
  })
}
export default connect(mapStateToProps,mapActionsToProps)(OrderDetails)
