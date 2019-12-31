/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React, { Component } from 'react'
import { Text, View,Platform } from 'react-native'
import PDFView from 'react-native-view-pdf';
import {Header,Icon} from 'react-native-elements'

const resources = {
  file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
  url: 'https://firebasestorage.googleapis.com/v0/b/sokhaypenday.appspot.com/o/Document%20(7).pdf?alt=media&token=cf7c51b9-2777-4bed-ab37-56680b94bc06',
  base64: 'JVBERi0xLjMKJcfs...',
};
export default class CustomerDocument extends Component {
    constructor(props){
        super(props)
        this.state={
            isRTL:true
        }
    }
    render() {
        return (
            <View style={{flex:1}}>
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
                  <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>کسٹمر دستاویز </Text>
                :
                <Text style={{fontSize:30,color:'white',alignSelf:'center',marginBottom:10}}>Edit Profile </Text>

                }
                 
                  containerStyle={{backgroundColor:'gray',
                  height: Platform.OS === 'ios' ? 70 :  70 - 10}}
                  />
                  <PDFView
                    fadeInDuration={250.0}
                    style={{ flex: 1 }}
                    resource={resources['url']}
                    resourceType='url'
                    onError={(error) => console.log('Cannot render PDF', error)}
                    />
            </View>
        )
    }
}
