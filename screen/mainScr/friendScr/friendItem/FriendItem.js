import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React from 'react'
import { useState } from 'react'
import Style from './FriendItemStyle'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'

const FriendItem = React.memo(props => {

    const { inputData } = props
    const { user } = props

    var listFollowers = [];
    const [isFollow, setIsFollow] = useState(false);
    // Id của follow hiện tại. Truyền về main để hủy Follow
    const [itemId, setItemId] = useState();

    // Refresh
    React.useEffect(() => {
        loadData();
    }, []);

    // Loadata
    const loadData = React.useCallback(() => {
        listFollowers = inputData.follows;
        setItemId(inputData.id)
        for (const item of listFollowers) {
            if(item.flId == user.id){
                setIsFollow(true)
            }
        }
    }, []);


    return (
        <View style={Style.container}>
            {
                <View style={Style.userInfo}>
                    <View style={Style.userImgBox}><Image style={Style.userImg} source={{ uri: inputData.img }} /></View>
                    <View style={Style.userNameBox}>
                        <View><Text style={Style.userName}>{inputData.id} - {inputData.fullname}</Text></View>
                        {
                            inputData.type == 1 ? <View style={Style.DesBox}>
                                <Text style={Style.userDes}>@{inputData.name}</Text>
                                <Text style={Style.userDes}>| {inputData.follows.length} Followers</Text>
                            </View> : <View></View>
                        }
                    </View>
                    <View>
                        {
                            // Tài khoản Admin -> Hiện nút Follow
                            inputData.type == 1 ? <View>
                                {
                                    (isFollow) ?
                                        <View>
                                            <TouchableOpacity style={Style.followBtn} onPress={() => {
                                                Alert.alert("Xác nhận", "Bạn chắc chắn muốn hủy theo dõi người này?", [
                                                    {
                                                      text: 'Cancel',
                                                      style: 'cancel',
                                                    },
                                                    {
                                                      text: 'Hủy', onPress: () => {
                                                        props.onClick('1', itemId )
                                                        setIsFollow(false)
                                                      },
                                                    }
                                                  ])
                                            }}>
                                                <Text style={Style.followText}>UnFollow</Text>
                                                {/* <View style={Style.followImgBox}><Ionicons name='remove-circle-outline' style={Style.followImg} /></View> */}
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        <View>
                                            <TouchableOpacity style={Style.followBtn} onPress={() => {
                                                props.onClick('2', itemId )
                                                setIsFollow(true)
                                            }}>
                                                <Text style={Style.followText}>Follow</Text>
                                                <View style={Style.followImgBox}><Ionicons name='add-circle-outline' style={Style.followImg} /></View>
                                            </TouchableOpacity>
                                        </View>
                                }
                            </View> : <View>
                                {
                                    // Không phải tài khoản Admin, User đang là Admin -> Xóa / Trống
                                    user.type == 1 ? <TouchableOpacity onPress={() => { props.onClick('3', inputData.id ) }}><Feather name='delete' style={Style.deleteIcon} /></TouchableOpacity> : <View></View>
                                }
                            </View>
                        }
                    </View>
                </View>
            }
            {/* User Info */}
        </View>
    )
})
export default FriendItem