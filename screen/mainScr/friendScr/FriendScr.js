import { View, Text, FlatList, Alert, RefreshControl } from 'react-native'
import React from 'react'
import { useState } from 'react'
import FriendItem from './friendItem/FriendItem'
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL from '../../../UrlAPi'
import Style from './FriendStyleScr';

const FriendScr = ({ navigation }) => {

  const [allProfiles, setAllProfiles] = useState([])
  const [isLoading, setisLoading] = useState(false);
  const [userInfo, setuserInfo] = useState({})
  // const [state, setState] = useState(true)

  // Lấy thông tin người dùng hiện tại
  const getUserInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('loginInfo')
      if (value !== null) {
        getAllProfiles(JSON.parse(value))
        // setState(!state)
        // console.log(state);
      }
    } catch (e) {
      console.log("Error: " + e);
    }
  }

  // Lấy danh sách tất cả các tài khoản người dùng kèm theo tài khoản follower
  const getAllProfiles = async (value) => {
    let url = URL + '/profiles?id_ne=' + value.id + '&_embed=follows'
    setuserInfo(value);
    try {
      const response = await fetch(url);
      const json = await response.json();
      setAllProfiles(json);
    } catch (error) {
      console.error(error);
    }
  }

  const buttonClick = async (value, data) => {
    switch (value) {
      case '1': {
        // Delete follows
        let url = URL + '/follows?profileId=' + data + '&flId=' + userInfo.id
        let deleteObj
        try {
          const response = await fetch(url);
          const json = await response.json();
          deleteObj = json;
        } catch (error) {
          console.error(error);
        }
        let deleteId = deleteObj[0].id;
        let deleteUrl = URL + '/follows/' + deleteId
        fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        })
          .then((res) => {
            if (res.status == 200) {
              Alert.alert("Thông báo", "Đã hủy theo dõi!");
              getUserInfo();
            }
            else {
              console.log(res.status);
            }
          })
          .catch((ex) => {
            console.log(ex);
          });
      }
        break;
      case '2': {
        // Add new follow
        let fl = {
          profileId: data,
          flId: userInfo.id,
        }

        let urlPost = URL + '/follows'
        fetch(urlPost, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(fl)
        })
          .then((res) => {
            if (res.status == 201) {
              getUserInfo();
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
        break;
      case '3': {
        // Delete user
        Alert.alert("Xác nhận", "Bạn chắc chắn muốn xóa tài khoản?", [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Xóa', onPress: () => {
              let url = URL + '/profiles/' + data

              fetch(url, {
                method: 'DELETE',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                }
              })
                .then((res) => {
                  if (res.status == 200) {
                    Alert.alert("Thông báo", "Xóa tài khoản thành công!");
                    getUserInfo();
                  }
                })
                .catch((ex) => {
                  console.log(ex);
                });
            },
          }
        ])
      }
        break;
      default: {
      }
    }
  }
  // Refresh
  React.useEffect(() => {
    getUserInfo();
  }, []);

  // Loadata
  const loadData = React.useCallback(() => {
    setisLoading(true);
    getUserInfo();
    setisLoading(false);
  }, []);

  return (
    <View style={Style.container}>
      <FlatList
        keyExtractor={(item) => { return item.id }}
        data={allProfiles}
        renderItem={({ item }) => <FriendItem inputData={item} navigation={navigation}
          user={userInfo} onClick={buttonClick} />}
        key={(item) => { return item.id }}
        // extraData={state}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadData} />
        }
      />
    </View>
  )
}

export default FriendScr