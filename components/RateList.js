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
import { Text, View,Platform,Image,ScrollView} from 'react-native'

import {Header,Icon} from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from "react-redux";
class RateList extends Component {
 constructor(props){
     super(props)
     this.state={
         locale:"en",
         isRTL:true,
         orientation:"portrait"
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
                name="ios-menu"
                type="ionicon"
                onPress={()=>this.props.navigation.toggleDrawer()}

                color="white"
                size={40}
                />
                  }
                  centerComponent={this.state.isRTL?
                  <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>Service Charges</Text>
                  :
                  <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>کام کا معاوضہ
                  </Text>
                  }
                  containerStyle={{backgroundColor:'gray',
                  height: Platform.OS === 'ios' ? 70 :  70 - 10}}
                  />
                  <ScrollView style={{flex:1}}>

                   <View style={{alignItems:'center',marginTop:2,width:wp('100%'),height:(this.state.orientation==="portrait")?hp('45%'):hp('88.5%')}}>
          <Image 
          source={require('./icon.jpeg')}
          style={{width:wp('80%'),height:(this.state.orientation==="portrait")?hp('45%'):hp('89%')}}
          />
          </View>
                  <View style={{alignItems:'center'}}>
  
<View style={{flexDirection:'row',marginTop:20,justifyContent:'space-between',width:wp('65%')}}>
<Text style={{fontSize:20,marginLeft:8}}>Per KM Charges</Text>
<Text style={{fontSize:20,marginLeft:8,fontWeight:"bold"}}>Rs. 50</Text>
</View>
<View style={{flexDirection:'row',marginTop:20,justifyContent:'space-between',width:wp('65%')}}>
<Text style={{fontSize:20,marginLeft:8}}>Puncture Charges</Text>
<Text style={{fontSize:20,marginLeft:8,fontWeight:"bold"}}>Rs. 70</Text>
</View>
<View style={{flexDirection:'row',marginTop:20,justifyContent:'space-between',width:wp('65%')}}>
<Text style={{fontSize:20,marginLeft:8}}>Tube Change (70 CC)</Text>
<Text style={{fontSize:20,marginLeft:8,fontWeight:"bold"}}>Rs. 250</Text>
</View>
<View style={{flexDirection:'row',marginTop:20,justifyContent:'space-between',width:wp('65%')}}>
<Text style={{fontSize:20,marginLeft:8}}>Tube Change (125 CC)</Text>
<Text style={{fontSize:20,marginLeft:8,fontWeight:"bold"}}>Rs. 300</Text>
</View>

                  </View>
          </ScrollView>
              

                
              

       </View>
    )
  }
}
 function mapStateToProps(state){
  return({
      UID:state.rootReducer.UID
  })
}
function mapActionsToProps(dispatch){
  return({
     
  })
}
export default connect(mapStateToProps,mapActionsToProps)(RateList)
