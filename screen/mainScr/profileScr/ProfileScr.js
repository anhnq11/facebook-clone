import {
  View,
  Text,
  Image,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert
} from 'react-native'
import React from 'react'
import Style from './ProfileScrStyle'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import NewItems from '../homeScr/newsItems/NewItems';
import URL from '../../../UrlAPi';

const introImg = 'https://transcode-v2.app.engoo.com/image/fetch/f_auto,c_lfill,w_300,dpr_3/https://assets.app.engoo.com/images/rGTEEA2fm66YMzeJz2UbwkKOW62bZVlqKOKZrXlMN7g.jpeg'

const Profile = ({ navigation }) => {

  const [userInfo, setuserInfo] = useState({})
  const [postCount, setpostCount] = useState(0)
  const [post, setpost] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isModalShow, setisModalShow] = useState(false)
  const [action, setaction] = useState()
  const [flCount, setflCount] = useState(0)

  const [name, setname] = useState(userInfo.name);
  const [img, setimg] = useState('')
  const [content, setcontent] = useState('')
  const [contentImg, setcontentImg] = useState('')

  // Lấy thông tin người dùng hiện tại trong LS, hiển thị lên màn hình
  const getUserInfo = async () => {
    try {
      const value = await AsyncStorage.getItem('loginInfo')
      if (value !== null) {
        getPost(JSON.parse(value));
        getFollows(JSON.parse(value));
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Fetch data hiển thị danh sách bài viết của người dùng lên màn hình
  const getPost = async (value) => {
    let url = URL + '/posts?profileId=' + value.id + '&_sort=id&_order=desc&_expand=profile'
    setimg(value.img)
    setname(value.fullname)
    setuserInfo(value)
    try {
      const response = await fetch(url);
      const json = await response.json();
      setpost(json);
      setpostCount(json.length);
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch Data Follows
  const getFollows = async (value) => {
    let url = URL + '/follows?profileId=' + value.id
    try {
      const response = await fetch(url);
      const json = await response.json();
      setflCount(json.length);
    } catch (error) {
      console.error(error);
    }
  }

  // Refresh
  React.useEffect(() => {
    loadData();
  }, []);

  // LoadData - Gọi lại dữ liệu
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
        });
    }
  }

  const pickNewImage = async () => {
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
          setcontentImg("data:image/" + file_ext + ";base64," + res);
        });
    }
  }

  // Upload new post
  const uploadNewPost = () => {
    let newPost = {
      content: content,
      img: contentImg,
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
          setcontent(null)
          setimg("")
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

  // Update thông tin tài khoản
  const editProfile = () => {
    if (name != '') {
      let obj = {
        id: userInfo.id,
        name: userInfo.name,
        password: userInfo.password,
        fullname: name,
        type: userInfo.type,
        img: img
      };
      let url = URL + '/profiles/' + userInfo.id

      fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
      })
        .then(async (res) => {
          if (res.status == 200)
            setuserInfo(obj);
          // Lưu đè thông tin đăng nhập vào LS
          try {
            await AsyncStorage.setItem('loginInfo', JSON.stringify(obj))
          } catch (e) {
            console.log(e);
          }
        })
        .catch((ex) => {
          console.log(ex);
        });
    } else {
      Alert.alert('Thông báo', 'Tên người dùng không được để trống!')
    }
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={loadData} />
      }
    >
      <View style={Style.container}>
        {/* Chứa ảnh */}
        <View style={Style.imgIntroBox}>
          <Image source={{ uri: introImg }} style={Style.imgIntro} />
        </View>
        {/* Chứa tên */}
        <View style={Style.userInfoBox}>
          <View style={Style.userImgBox}><Image style={Style.userImg} source={{ uri: userInfo.img }} /></View>
          <Text style={Style.userName} >{userInfo.fullname}</Text>
        </View>
        {/* Thông tin người dùng */}
        <View style={Style.flInfo}>
          <Text style={Style.postText}>{postCount} Post</Text>
          <Text style={Style.flText}>{flCount} Follower</Text>
        </View>
        <View style={Style.btnContainer}>
          {/* Button chỉnh sửa thông tin tài khoản */}
          <TouchableOpacity style={Style.btnBoxL}
            onPress={() => {
              setaction('EDIT')
              setisModalShow(true)
            }}>
            <FontAwesome style={Style.btnIcon} name='edit' />
            <Text style={Style.btnText}>Edit</Text>
          </TouchableOpacity>

          {/* Button đăng xuất tài khoản */}
          <TouchableOpacity style={Style.btnBoxR} onPress={() => {
            Alert.alert("Xác nhận", "Đăng xuất tài khoản!", [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              { text: 'OK', onPress: () => navigation.navigate("DangNhap") },
            ])
          }}>
            <MaterialIcons style={Style.btnIcon} name='logout' />
            <Text style={Style.btnText}>Log out</Text>
          </TouchableOpacity>
        </View>

        {/* Modal Show */}
        <Modal
          animationType={'slide'}
          transparent={false}
          visible={isModalShow}
          onRequestClose={() => {
            setisModalShow(false)
          }}>
          {
            action === 'EDIT' ?
              <View style={Style.modalBox}>
                <Text style={[Style.userName, { marginTop: 0, textAlign: 'center' }]}>Chỉnh sửa hồ sơ</Text>
                <TouchableOpacity style={Style.modalImgBox} onPress={pickImage} >
                  {
                    img != "" ? <View style={Style.modalImgBox}><Image source={{ uri: img }} style={Style.modalImg} /></View> : <View style={Style.modalImgBox}><Image source={{ uri: userInfo.img }} style={Style.modalImg} /></View>
                  }
                </TouchableOpacity>
                <View style={Style.inputBox}>
                  <TextInput style={Style.inputText} placeholder={userInfo.fullname} onChangeText={(text) => { setname(text) }} />
                </View>

                {/* Modal button */}
                <View style={Style.modalBtnBox}>
                  <TouchableOpacity
                    style={Style.modalBtn}
                    onPress={() => {
                      setisModalShow(false)
                    }}>
                    <Text style={Style.modalBtnText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={Style.modalBtn}
                    onPress={() => {
                      editProfile();
                      setisModalShow(false)
                    }}>
                    <Text style={Style.modalBtnText}>Xác nhận</Text>
                  </TouchableOpacity>
                </View>
              </View> : <View>
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
                      (content !== '' || contentImg !== '') ? <TouchableOpacity onPress={uploadNewPost}>
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
                <TouchableOpacity onPress={pickNewImage}>
                  {
                    contentImg !== '' ? <View style={{ width: '100%', height: 450 }}>
                      <Image source={{ uri: contentImg }} style={{ width: '100%', height: '100%' }} />
                    </View> : <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                      <Entypo style={Style.uploadImg} name='images' />
                      <Text style={[Style.mInputText, { marginLeft: 10 }]}>Upload an image</Text>
                    </View>
                  }
                </TouchableOpacity>
                <View>
                </View>
              </View>
          }
        </Modal>
      </View>

      {/* Item upload bài viết mới */}
      {
        userInfo.type == 0 ? <View></View> :
          <View style={Style.newPost}>
            <View style={Style.userImgBox2}><Image style={Style.userImg2} source={{ uri: userInfo.img }} /></View>
            <TouchableOpacity style={Style.inputBox2} onPress={() => {
              setaction('NEW_POST')
              setisModalShow(true)
            }}>
              <TextInput
                style={Style.inputText2}
                placeholder={"What's on your mind?"}
                editable={false}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={Style.uploadImgBox}
              onPress={() => {
                setaction('IMG')
                setisModalShow(true)
                pickNewImage();
              }}
            >
              <Entypo style={Style.uploadImg} name='images' />
            </TouchableOpacity>
          </View>
      }

      {/* List dữ liệu */}
      <View style={{ backgroundColor: '#ccc' }}>
        {
          post.map((item) => <NewItems key={item.id}
            inputData={item} navigation={navigation} userInfo={userInfo}
            onPress={() => loadData()}
          />)
        }
      </View>

    </ScrollView>
  )
}

export default Profile