/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import { 
    login,
    logout,
    setUID,
    setFlagData,
    setUserInfo,
    setUserType,
    createChat,
    setOrderDetails,
    setORderData
} from "./actionNames";

export function LoginAction(data){
    return dispatch=>{
        dispatch({
            type:login,
            payload:data
        })
    }
}


export function LogoutAction(){
    return dispatch=>{
        dispatch({
            type:logout
        })
    }
}
export function setUIDAction(UID){
    return dispatch=>{
        dispatch({
            type:setUID,
            payload:UID
        })
    }
}

export function setFlagDataAction(data){
    return dispatch=>{
        dispatch({
            type:setFlagData,
            payload:data
        })
    }
}
export function setUserInfoAction(userdata){
    return dispatch=>{
        dispatch({
            type:setUserInfo,
            payload:userdata
        })
    }
}
export function setUserTypeAction(isCustomer){
    return dispatch=>{
        dispatch({
            type:setUserType,
            payload:isCustomer
        })
    }
}
export function createChatAction(chat){
    return dispatch=>{
        dispatch({
            type:createChat,
            payload:chat
        })
    }
}
export function setOrderDetailsAction(order){
    return dispatch=>{
        dispatch({
            type:setOrderDetails,
            payload:order
        })
    }
}
export function setOrderDataAction(order){
    return dispatch=>{
        dispatch({
            type:setORderData,
            payload:order
        })
    }
}