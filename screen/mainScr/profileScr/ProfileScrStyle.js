import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container:{
        width: '100%',
        alignItems: 'center',
    },
    imgIntroBox:{
        width: '100%',
        height: 200,
        marginBottom: 5,
    },
    imgIntro:{
        width: '100%',
        height: '100%',
    },
    userInfoBox:{
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
        position: 'absolute',
        marginTop: '37%',
        flexDirection: 'row',
    },
    userImgBox:{
        width: 120,
        height: 120,
    },
    userImg:{
        width: '100%',
        height: '100%',
        borderRadius: 120,
    },
    userName:{
        fontSize: 30,
        fontWeight: '500',
        marginLeft: 10,
        marginTop: 35,
    },
    flInfo:{
        marginTop: 45,
        marginLeft: 30,
        flexDirection: 'row',
    },
    postText:{
        fontSize: 18,
        fontWeight: '500',
        color: '#61605f',
        paddingRight: 10,
    },
    flText:{
        fontSize: 18,
        fontWeight: '500',
        color: '#61605f',
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderColor: '#61605f'
    },
    btnContainer:{
        width: '90%',
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
    btnBoxL:{
        width: '40%',
        backgroundColor: '#30CF59',
        flexDirection: 'row',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
    },
    btnBoxR:{
        width: '40%',
        backgroundColor: '#30CF59',
        flexDirection: 'row',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        marginLeft: 10,
    },
    btnIcon:{
        fontSize: 22,
        color: 'white'
    },
    btnText:{
        fontSize: 17,
        color: 'white',
        marginLeft: 10
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
    inputBox:{
        width: 300,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: '#30CF59',
        backgroundColor: 'white',
        padding: 10,
    },
    inputText:{
        color: 'black',
        fontWeight: '600',
        fontSize: 18,
    },
    modalImgBox:{
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15, 
    },
    modalImg:{
        width: '100%',
        height: '100%',
        borderRadius: 150,
        backgroundColor: 'red'
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
    newPost:{
        borderTopWidth: 10,
        borderTopColor: '#ccc',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    userImgBox2:{
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        marginLeft: 0,
    },
    userImg2:{
        width: '100%',
        height: '100%',
        borderRadius: 40
    },
    inputBox2:{
        width: 280,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#ccc',
        backgroundColor: 'white',
        padding: 8,
    },
    inputText2:{
        color: 'black',
        fontWeight: '600',
        fontSize: 18,
    },
    uploadImgBox:{
        width: 40,
        height: 40,
        marginLeft: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadImg:{
        color: '#30CF59',
        fontSize: 30,
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
})