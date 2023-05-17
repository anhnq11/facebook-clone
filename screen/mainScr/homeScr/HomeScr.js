import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Text,
  RefreshControl,
  Modal,
  Image,
  Alert
} from 'react-native'
import { useState, useEffect } from 'react';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewItems from './newsItems/NewItems';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import Style from './HomeStyleScr';
import URL from '../../../UrlAPi';

const HomeScr = ({ navigation }) => {

  const [post, setpost] = useState([])
  const [userInfo, setuserInfo] = useState({})
  const [isLoading, setisLoading] = useState(false)
  const [isModalShow, setisModalShow] = useState(false)

  const [content, setcontent] = useState('')
  const [img, setimg] = useState('')

  let postArrays = []

  // Lấy thông tin người dùng hiện tại trong LS
  const getUserInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('loginInfo')
      if (value !== null) {
        getPost(JSON.parse(value))
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Fetch data hiển thị danh sách bài viết
  const getPost = async (value) => {
    let url = URL + '/posts?_sort=id&_order=desc&_expand=profile'
    setuserInfo(value)
    try {
      const response = await fetch(url);
      const json = await response.json();
      for (const item of json) {
        let getLikeUrl = URL + '/likes?postId=' + item.id
        try {
          const response = await fetch(getLikeUrl);
          const json = await response.json();
          item.likes = json;
          postArrays.push(item);
        } catch (error) {
          console.error(error);
        }
      }
      setpost(postArrays);
      postArrays = []
    } catch (error) {
      console.error(error);
    }
  }

  const buttonClick = async (value, data) => {
    switch (value) {
      case '1': {
        // Delete like post
        let url = URL + '/likes?postId=' + data + '&profileId=' + userInfo.id;
        let deleteObj;
        try {
          const response = await fetch(url);
          const json = await response.json();
          deleteObj = json;
        }
        catch (error) {
          console.log(error);
        }
        let deleteId = deleteObj[0].id;
        let deleteUrl = URL + '/likes/' + deleteId;
        fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        })
          .then((res) => {
            if (res.status == 200) {
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
        // Add like post

        let likePost = {
          postId: data,
          profileId: userInfo.id,
        }

        let urlPost = URL + '/likes'
        fetch(urlPost, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(likePost)
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
        break;

      default:
        break;
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

  // Lấy ảnh từ thư viện
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      let _uri = result.assets[0].uri;
      let file_ext = _uri.substring(_uri.lastIndexOf('.') + 1);

      FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' })
        .then((res) => {
          setimg("data:image/" + file_ext + ";base64," + res);
          console.log(_uri);
        });
    }
  }

  // Upload new post - server

  const uploadNewPost = () => {
    let newPost = {
      content: content,
      img: img,
      profileId: userInfo.id,
    }

    let urlPost = URL + '/posts'
    fetch(urlPost, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost)
    })
      .then((res) => {
        if (res.status == 201) {
          Alert.alert("Thông báo!", "Đã tải bài viết lên!")
          setisModalShow(false)
          loadData()
          setcontent('')
          setimg('')
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

  return (
    <View style={{ backgroundColor: '#ccc' }}>
      <FlatList
        keyExtractor={(item) => { return item.id }}
        data={post}
        key={(item) => { return item.id }}
        renderItem={({ item }) => <NewItems inputData={item} navigation={navigation}
          userInfo={userInfo} onClick={buttonClick} />}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={loadData} />
        }
      />

      {/* Kiểm tra quyền tài khoản -> Cho phép đăng bài viết mới */}
      {
        userInfo.type == 0 ? <View></View> :
          <TouchableOpacity style={Style.addBtnBox} onPress={() => setisModalShow(true)}>
            <Entypo name='plus' style={Style.addBtn} />
          </TouchableOpacity>
      }

      {/* Modal thêm bài viết mới */}
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={isModalShow}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}>
        {/* Modal add new post */}
        <View>
          {/* Modal Upload bài viết mới */}
          <View style={Style.modalHeader}>
            <TouchableOpacity style={Style.iconBackBox}
              onPress={() => {
                setisModalShow(false)
              }}
            ><Ionicons style={Style.iconBack} name='arrow-back' /></TouchableOpacity>
            <Text style={Style.uploadModalHeader}>Upload New Post</Text>
            <View>
              {
                (content !== '' || img !== '') ? <TouchableOpacity onPress={uploadNewPost}>
                  <Text style={[Style.uploadModalHeader, { marginLeft: '50%', color: '#30CF59' }]}>Post</Text>
                </TouchableOpacity> :
                  <Text style={[Style.uploadModalHeader, { marginLeft: '50%', color: '#ccc' }]}>Post</Text>
              }

            </View>
          </View>
          <View style={Style.mUserInfo}>
            <View style={Style.mUserImgBox}><Image style={Style.mUserImg} source={{ uri: userInfo.img }} /></View>
            <View style={Style.mUserNameBox}>
              <Text style={Style.mUserName}>{userInfo.fullname}</Text>
              <View style={Style.DesBox}><Text style={Style.mUserDes}>@{userInfo.name}</Text></View>
            </View>
          </View>
          <View style={Style.mInputBox}>
            <TextInput
              style={Style.mInputText}
              multiline
              numberOfLines={1}
              placeholder={"What's on your mind?"}
              onChangeText={(text) => {
                setcontent(text)
              }}
            />
          </View>
          {/* Icon upload image */}
          <TouchableOpacity onPress={pickImage}>
            {
              img !== '' ? <View style={{ width: '100%', height: 450 }}>
                <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} />
              </View> : <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                <Entypo style={Style.uploadImg} name='images' />
                <Text style={[Style.mInputText, { marginLeft: 10 }]}>Upload an image</Text>
              </View>
            }
          </TouchableOpacity>
          <View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default HomeScr