import { StyleSheet } from "react-native";

export default StyleSheet.create({
    addBtnBox:{
        width: 55,
        height: 55,
        backgroundColor: '#30CF59',
        position: 'absolute',
        bottom: 15,
        right: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 300,
    },
    addBtn:{
        color: 'white',
        fontSize: 40,
    },
    modalBox:{
        width: '90%',
        backgroundColor: '#ccc',
        borderRadius: 10,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: '5%',
        marginTop: '30%',
    },
    modalTitle:{
        fontSize: 25,
        fontWeight: '600',
        color: '#30CF59'
    },
    inputBox:{
        width: 300,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: '#30CF59',
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 10,
    },
    inputText:{
        color: 'black',
        fontWeight: '600',
        fontSize: 18,
    },
    modalImgBox:{
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10, 
    },
    btnAddImg:{
        width: 250,
        height: 50,
        borderRadius: 15,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: 'black',
        borderStyle: 'dashed',
        paddingHorizontal: 25
    },
    btnAddImgText:{
        fontSize: 20,
        fontWeight: '500'
    },  
    modalBtnBox:{
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    modalBtn:{
        width: '45%',
        backgroundColor: '#30CF59',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

    },
    modalBtnText:{
        color: 'white',
        fontSize: 22,
        fontWeight: '500',
        paddingVertical: 3,
    },
    modalHeader:{
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
        padding: 10,
        alignItems: 'center'
    },
    iconBackBox:{
        width: 30,
        height: 30,
        marginRight: 15,
    },
    iconBack:{
        fontSize: 30,
    },
    uploadModalHeader:{
        fontSize: 20,
    },
    mUserInfo:{
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    mUserImgBox:{
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    mUserImg:{
        width: '100%',
        height: '100%',
        borderRadius: 40
    },
    mUserNameBox:{
        width: '70%',
        marginLeft: 5,
    },
    mUserName:{
        fontSize: 19,
        color: 'black',
        fontWeight: '500',
    },
    mUserDes:{
        marginTop: -5,
        color: '#696C87',
        marginRight: 10,
        fontSize: 15,
        color: 'black',
    },
    mInputBox:{
        maxWidth: '95%',
        minHeight: 60,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    mInputText:{
        color: 'black',
        fontWeight: '600',
        fontSize: 18,
    },
    uploadImg:{
        color: '#30CF59',
        fontSize: 30,
    },
})