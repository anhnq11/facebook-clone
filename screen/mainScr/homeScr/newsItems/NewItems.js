import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    Modal,
    ScrollView,
    TextInput,
    Dimensions,
    ToastAndroid,
    TouchableWithoutFeedback,
} from 'react-native'
import React from 'react'
import { useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Dropdown } from 'react-native-element-dropdown';

import Style from './NewItemsStyle'
import URL from '../../../../UrlAPi'

let deviceWidth = Dimensions.get('window').width
let deviceHeight = Dimensions.get('window').height

const NewItems = (props) => {

    const [isModalShow, setisModalShow] = useState(false)
    const [comt, setcomt] = useState([])
    const [comment, setcomment] = useState('')
    const [cmtCount, setcmtCount] = useState(0)
    const [isLike, setisLike] = useState(false)
    const [likes, setlikes] = useState([])
    const [likeId, setlikeId] = useState()
    const [curLike, setcurLike] = useState()
    const [likeCount, setlikeCount] = useState(0)
    const [isLoading, setisLoading] = useState(false)
    const [action, setaction] = useState('')
    const [navIndex, setnavIndex] = useState()
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const data = [
        { label: 'Edit', value: '1' },
        { label: 'Delete', value: '2' }
    ];

    // Fetch Likes post 
    const getLikes = async () => {
        let url = URL + '/likes?postId=' + props.inputData.id
        try {
            const response = await fetch(url);
            const json = await response.json();
            setlikes(json)
            setlikeCount(json.length)
            getIsLike()
        } catch (error) {
            console.error(error);
        }
    }

    // Fetch Comments bài viết - server
    const getCmts = async () => {
        let url = URL + '/cmts?postId=' + props.inputData.id + '&_expand=profile'
        try {
            const response = await fetch(url);
            const json = await response.json();
            setcomt(json);
            setcmtCount(json.length)
        } catch (error) {
            console.error(error);
        }
    }

    const getIsLike = () => {
        likes.forEach(element => {
            // Nếu prfId là tài khoản hiện tại -> setisLike = true;
            if (element.profileId == props.userInfo.id) {
                setisLike(true)
                // setlikeId(element.id) // Set LikeId để thực hiện UnLike
            }
            if (element.id == curLike) {
                setisLike(false)
            }
        });
    }

    // Add Like
    const addLike = (postId, profileId) => {
        let like = {
            postId: postId,
            profileId: profileId,
        }

        let urlPost = URL + '/likes'
        fetch(urlPost, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(like)
        })
            .then((res) => {
                if (res.status == 201) {
                    console.log("Đã Like");
                    loadData();
                }
                else {
                    Alert.alert("Add Fail!")
                    console.log(res.status);
                }
            })
            .catch((ex) => {
                console.log(ex);
            });
    }

    // UnLike
    const unLike = (likeId) => {
        let url = URL + '/likes/' + likeId
        fetch(url, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((res) => {
                if (res.status == 200) {
                    console.log('Hủy Like');
                    setisLike(false)
                    setcurLike(likeId) // Lấy Id của Like hiện tại. Check cho vòng lặp sau
                    loadData();
                }
                else {
                    console.log(res.status);
                }
            })
            .catch((ex) => {
                console.log(ex);
            });
    }

    const addNewCmt = () => {

        if (comment !== '') {
            let newCmt = {
                postId: props.inputData.id,
                profileId: props.userInfo.id,
                cmt: comment
            }
            let urlPost = URL + '/cmts'
            fetch(urlPost, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCmt)
            })
                .then((res) => {
                    if (res.status == 201) {
                        loadData()
                        setcomment('')
                    }
                    else {
                        Alert.alert("Add Fail!")
                        console.log(res.status);
                    }
                })
                .catch((ex) => {
                    console.log(ex);
                });
        } else {
            ToastAndroid.showWithGravity(
                'Enter your comment!',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
            );
        }
    }

    // Sửa/ xóa post
    const postAction = (value, postId) => {
        if (value == 1) {
            Alert.alert('Thông báo', 'Không thể chỉnh sửa bài viết!')
            console.log('Edit post: ' + postId)
        }
        else {
            // Xóa post
            Alert.alert("Xác nhận", "Bạn chắc chắn muốn xóa bài viết?", [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Xóa', onPress: () => {
                        let url = URL + '/posts/' + postId;

                        fetch(url, {
                            method: 'DELETE',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            }
                        })
                            .then((res) => {
                                if (res.status == 200) {
                                    Alert.alert("Thông báo", "Xóa bài viết thành công!");
                                    loadData();
                                }

                            })
                            .catch((ex) => {
                                console.log(ex);
                            });
                    },
                }
            ]);
        }
    }

    React.useEffect(() => {
        const focusHandler = props.navigation.addListener('focus', () => {
            // loadData();
        });
        loadData();
        return focusHandler;
    }, [props.navigation]);

    // Loadata
    const loadData = () => {
        setisLoading(true);
        getCmts();
        getLikes();
        // console.log(likes); // Chạy lượt đầu không log ra dữ liệu
        setisLoading(false);
        setnavIndex(props.navigation.getState().index);
    };

    return (
        <View style={Style.container}>
            {/* User Info */}
            <TouchableWithoutFeedback
                onPress={() => {
                    if (navIndex !== 3) {
                        console.log("User Info Click!!!");
                        setaction('SHOW_ACC')
                        setisModalShow(true)
                    }
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={Style.userInfo} >
                        <View style={Style.userImgBox}><Image style={Style.userImg} source={{ uri: props.inputData.profile.img }} /></View>
                        <View style={Style.userNameBox}>
                            <Text style={Style.userName}>{props.inputData.profile.fullname}</Text>
                            <View style={Style.DesBox}><Text style={Style.userDes}>@{props.inputData.profile.name}</Text></View>
                        </View>
                    </View>
                    {/* Dropdown chức năng sửa/xóa bài viết */}
                    {
                        // Hiển thị Icon xóa/sửa với bài viết của tài khoản đang đăng nhập.
                        (props.inputData.profileId !== props.userInfo.id) ? <View></View> :
                            <View style={Style.dropdownContainer}>
                                <Dropdown
                                    style={(!isFocus) ? Style.dropdownClose : Style.dropdownOpen}
                                    placeholderStyle={Style.placeholderStyle}
                                    selectedTextStyle={Style.placeholderStyle}
                                    containerStyle={Style.containerStyle}
                                    itemTextStyle={Style.placeholderStyle}
                                    itemContainerStyle={Style.itemContainerStyle}
                                    iconStyle={Style.iconStyle}
                                    showsVerticalScrollIndicator={false}
                                    data={data}
                                    maxHeight={120}
                                    labelField="label"
                                    valueField="value"
                                    placeholder={!isFocus ? '' : ''}
                                    value={value}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={item => {
                                        // setValue(item.value);
                                        setIsFocus(false);
                                        postAction(item.value, props.inputData.id);
                                    }}
                                />
                            </View>
                    }
                </View>
            </TouchableWithoutFeedback>

            {/* Content: Post Content & Image */}
            <View>
                {
                    props.inputData.content !== undefined ? <Text style={Style.contentText}>{props.inputData.content}</Text> : null
                }
                {
                    props.inputData.img != "" ? <TouchableWithoutFeedback onPress={() => {
                        setaction('SHOW_IMG') // Hành động xem ảnh ở chế độ full màn hình
                        setisModalShow(true)
                    }}>
                        <View style={{ width: deviceWidth - 20, height: 200, justifyContent: 'center', marginTop: 5 }}>
                            <Image style={{ width: deviceWidth - 20, height: 200 }} source={{ uri: props.inputData.img }} />
                        </View>
                    </TouchableWithoutFeedback> : <View></View>
                }
            </View>

            {/* React Icon */}
            <View style={Style.mReactBox}>
                <TouchableOpacity style={Style.reactBox} onPress={() => {
                    loadData()
                }}>
                    <View style={Style.iconBox}>
                        {
                            isLike ? <TouchableWithoutFeedback onPress={() => {
                                unLike(likeId)
                            }}>
                                <FontAwesome name='heart' style={[Style.reactIcon, { color: 'red' }]} />
                            </TouchableWithoutFeedback> :
                                <TouchableWithoutFeedback onPress={() => {
                                    addLike(props.inputData.id, props.userInfo.id)
                                    setisLike(true)
                                }}>
                                    <FontAwesome name='heart-o' style={Style.reactIcon} />
                                </TouchableWithoutFeedback>
                        }
                    </View>
                    <Text style={Style.reactText}>{likeCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Style.reactBox} onPress={() => {
                    setaction('SHOW_CMT') // Hành động xem comment bài viết
                    setisModalShow(true)
                    getCmts();
                }}>
                    <View style={Style.iconBox}><FontAwesome name='comment-o' style={Style.reactIcon} /></View>
                    <Text style={Style.reactText}>{cmtCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={Style.reactBox}>
                    <View style={Style.iconBox}><FontAwesome name='send-o' style={Style.reactIcon} /></View>
                    <Text style={Style.reactText}>Share</Text>
                </TouchableOpacity>
            </View>

            {/* Modal */}
            <Modal
                animationType={'slide'}
                transparent={false}
                visible={isModalShow}
                onRequestClose={() => {
                    setaction('')
                    setisModalShow(false)
                }}>
                {
                    action === 'SHOW_CMT' ?
                        // Modal show comments
                        <View style={Style.modalBox}>
                            {/* User Info */}
                            <View style={Style.modalHeader}>
                                <View style={Style.userInfo}>
                                    <View style={Style.userImgBox}><Image style={Style.userImg} source={{ uri: props.inputData.profile.img }} /></View>
                                    <View style={Style.userNameBox}>
                                        <Text style={Style.userName}>{props.inputData.profile.fullname}</Text>
                                        <View style={Style.DesBox}><Text style={Style.userDes}>@{props.inputData.profile.name}</Text></View>
                                    </View>
                                </View>
                                <FontAwesome style={Style.iconClose} name='close' onPress={() => { setisModalShow(false) }} />
                            </View>
                            {/* Content: Post Content & Image */}
                            <View>
                                {
                                    props.inputData.content != "" ? <Text style={Style.contentText}>{props.inputData.content}</Text> : <View></View>
                                }
                                {
                                    props.inputData.img != "" ? <View style={Style.contentImgBox}><Image style={Style.contentImg} resizeMode='contain' source={{ uri: props.inputData.img }} /></View> : <View></View>
                                }
                            </View>
                            <ScrollView style={Style.listCmt}>
                                {
                                    comt.map((item) => <View style={Style.cmtBox} key={item.id}>
                                        <View style={Style.cmtUserIf}>
                                            <View style={Style.userImgBox}><Image style={Style.userImg} source={{ uri: item.profile.img }} /></View>
                                            <Text style={Style.cmtName}>{item.profile.fullname}</Text>
                                        </View>
                                        <Text style={Style.cmtCnt}>{item.cmt}</Text>
                                    </View>)
                                }
                            </ScrollView>

                            <View style={Style.addCmt}>
                                <TextInput
                                    style={Style.ipCmt}
                                    placeholder='Enter your comment!'
                                    value={comment}
                                    onChangeText={(text) => { setcomment(text) }}
                                />
                                <FontAwesome style={Style.sendCmt} name='send-o' onPress={() => {
                                    addNewCmt();
                                }} />
                            </View>
                        </View> : action === 'SHOW_IMG' ?
                            // Modal show Image
                            <View style={Style.modalImgBox}>
                                <View style={{ width: deviceWidth, height: deviceHeight / 2 }}>
                                    <Image style={{ width: '100%', height: '100%' }} resizeMode='contain' source={{ uri: props.inputData.img }} />
                                </View>
                            </View> : action === 'SHOW_ACC' ?
                                // Modal show profile
                                <View style={{ width: deviceWidth, height: deviceHeight, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>Đây là profile của {props.inputData.profile.fullname}</Text>
                                    {/* Hiển thị chi tiết profile tại đây */}
                                </View> : <View></View>
                }
            </Modal>
        </View>
    )
}

export default NewItems