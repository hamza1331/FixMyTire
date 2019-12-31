
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { Text, View, TouchableHighlight,FlatList,Modal} from 'react-native'
 
// Import { RTLView, RTLText } from react-native-rtl-layout
import {Header,Icon,Button,Avatar,Rating,Overlay} from 'react-native-elements'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

 
class App extends Component {
 
  constructor(props) {
    super(props)
    this.state = {
      isRTL:false,
      modalInfo:false
    }
  }
 
  toggleLocale = () => {
    this.setState({
      locale: (this.state.locale == 'ar' ? 'en' : 'ar')
    })
  }
 openModalinfo=()=>{
   this.setState({
     modalInfo:true
   })
 }
  render() {
    return (
      <View style={{ flex: 1,backgroundColor:'white'}}>
         <Header  placement="left"
                  leftComponent={
                <Icon  containerStyle={{marginBottom:10,marginLeft:10}}
                name="ios-menu"
                type="ionicon"
                color="white"
                size={40}
                />
                  }
                  centerComponent={<Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>Map & Info</Text>}
                  containerStyle={{backgroundColor:'purple',
                  height: Platform.OS === 'ios' ? 70 :  70 - 10}}
                  />
                  <View style={{backgroundColor:'gray',height:hp('75%'),width:wp('100%')}}>
                    
                  </View>
                
                  <Overlay isVisible={this.state.modalInfo} animation='slide-down' borderRadius={30} overlayStyle={{height:hp('30%'),position:'absolute',bottom:10,width:wp('90%')}} containeStyle={{flexDirection:'row',alignItems:'flex-end'}}>
    <View style={{flexDirection:'row',justifyContent:'space-around'}}>
    <Avatar
                  size='large'
  rounded
  source={{
    uri:
      'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
  }}
/>
<Text style={{textAlign:'center',marginLeft:25,marginTop:20,fontSize:20}}>M.Rafique</Text>
<Text style={{textAlign:'center',marginTop:20,fontSize:20}}>Rating(3.5)</Text>
    </View>
    <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:50}}>
   
<Button title='Chat with Tasker'  />
<Button title='Call(03251585784)'  />
    </View>

        
</Overlay>
<View style={{justifyContent:'center',alignItems:'center',height:hp('13%'),width:wp('100%')}}>
<Button title='View Info' buttonStyle={{width:wp('50%')}} onPress={this.openModalinfo}  />
</View>

              

       </View>
    )
  }
}
 
export default App;
