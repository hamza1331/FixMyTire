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
import { Text, View,FlatList, Alert,ActivityIndicator,Platform} from 'react-native'
 
// Import { RTLView, RTLText } from react-native-rtl-layout
import {Header,Icon,Button} from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { connect } from "react-redux";
 import { url } from "./Proxy";
import { setOrderDataAction } from "../store/actions/actions";
class OrderList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locale: 'ar',
      isRTL:false,
      orders:null,
      loading:true
    }
  }
 
  toggleLocale = () => {
    this.setState({
      locale: (this.state.locale == 'ar' ? 'en' : 'ar')
    })
  }
  componentDidMount(){
    fetch(url+'/api/getOrdersByTasker'+this.props.UID)
    .then(res=>res.json())
    .then(data=>{
      if(data.message=='Success'){
        let orders = data.doc.doc
        this.setState({
          orders,
          loading:false
        })
      }
    }).catch(err=>{
      Alert.alert('Failed','Unknown Error')
      console.log(err)
    })
  }
  render() {
    if (this.state.loading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator
            size={Platform.OS === "android" ? 30 : 1}
            color="darkred"
            animating
          />
        </View>
      )}
    else return (
      <View style={{ flex: 1}}>
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
                  centerComponent={<Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>Orders</Text>}
                  containerStyle={{backgroundColor:'gray',
                  height: Platform.OS === 'ios' ? 70 :  70 - 10}}
                  />
                  <View style={{backgroundColor:'white',height:hp('2%'),width:wp('100%')}}>
                    
                  </View>
                {this.state.orders!==null &&  
                 <FlatList
                  data={this.state.orders}
                  renderItem={({ item })=> {
                    let orderDate = item.order.date.substring(0,10)
                    let date = orderDate.split('-')
  return (
    <View>
      {this.state.isRTL?
     <View style={{backgroundColor:'#DCE0E0',height:hp('10%'),width:wp('100%'),marginRight:10,flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginBottom:5}}>
     <Button title='تفصیلات دیکھیں' buttonStyle={{width:wp('25%')}} titleStyle={{fontSize:12}}></Button>
     <Text>{item.userdata.fName}</Text>
     <Text>{`${date[2]}/${date[1]}/${date[0]}`}</Text>
   </View>:
 <View style={{backgroundColor:'#DCE0E0',height:hp('10%'),width:wp('100%'),marginRight:10,flexDirection:'row',alignItems:'center',justifyContent:'space-around',marginBottom:5}}>
 <Text>{item.userdata.fName}</Text>
 <Text>{`${date[2]}/${date[1]}/${date[0]}`}</Text>
 <Button title='View Details' onPress={()=>{
   this.props.setOrderData(item)
   this.props.navigation.navigate('OrderDetails')
 }} buttonStyle={{width:wp('25%'),backgroundColor:"darkorange"}} titleStyle={{fontSize:12}}></Button>
</View>
    }
    </View>
   
  );
}

                  }
                  />}
       </View>
    )
  }
}
function mapStateToProps(state){
  return({
    isCustomer:state.rootReducer.isCustomer,
    UID:state.rootReducer.UID,

  })
}
function mapActionsToProps(dispatch){
  return({
     setOrderData:(order)=>{
      dispatch(setOrderDataAction(order))
     }
  })
}
export default connect(mapStateToProps,mapActionsToProps)(OrderList);
