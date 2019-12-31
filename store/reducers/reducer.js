/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import { 
    login,
    logout,
    setUID,
    setUserInfo,
    setUserType,
    createChat,
    setOrderDetails,
    setORderData
} from "../actions/actionNames";
const initialState = {
    isLoggedIn:false,
    userName:'',
    UID:'',
    userInfo:null,
    isCustomer:false,
    userID:null,
    chat:"",
    orderDetails:null,
    orderData:null
}

export default (state = initialState,action)=>{
    switch(action.type){
        case login:
        return{
            ...state,
            isLoggedIn:true,
            userInfo:action.payload,
            UID:action.payload.userdata.firebaseUID,
            isCustomer:action.payload.userdata.type==='Customer'?true:false,
            userID:action.payload.userdata._id
        }
        case logout:
        return {
            ...state,
            isLoggedIn:false,
            userName:''
        }
        case setUID:
        return{
            ...state,
            UID:action.payload
        }
        case setUserInfo:
            return{
                ...state,
                userInfo:action.payload,
                isLoggedIn:true,
                UID:action.payload.uid,
                isCustomer:action.payload.type==='Customer'?true:false,
                userID:action.payload._id
            }
        case setUserType:
            return{
                ...state,
                isCustomer:action.payload
            }
        case createChat:
            return{
                ...state,
                chat:action.payload
            }
        case setOrderDetails:
            return{
                ...state,
                orderDetails:action.payload
            }
        case setORderData:
            return{
                ...state,
                orderData:action.payload
            }
        default:
        return state
    }
}