import { Text, View, Button } from 'native-base';
import React, { useEffect } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Ball from '../../../common/ball';
import Header from '../../../common/header';
import { useNavigation } from '@react-navigation/native';

const style = StyleSheet.create({
  wrapHeaderContent: {
    borderRadius: 8,
    padding: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFF',
  },
  wrapLeftHeaderContent: {
    width: '75%',
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  wrapRightHeaderContent: {
    width: '25%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#f0f0f0',
    height: '100%',
  },
  contentContainer: {
    width: '100%',
    padding: 10,
  },
  wrapDetailOrder: {
    borderRadius: 8,
    padding: 16,
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFF',
  },
  wrapScrollView: {
    height: '50%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginTop: 16,
  },
  lines: {
    backgroundColor: '#B7B7B7',
    height: 2,
  },
  textColor: {
    color: '#d32e31',
  },
  takePhotoBtn: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderStyle: 'dashed',
    backgroundColor: '#efeff0',
    borderRadius: 8,
    borderColor: 'gray',
    color: 'gray',
    marginVertical: 8,
    marginHorizontal: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textPhotoBtn: {
    color: 'gray'
  },
  btnConfirm: {
    backgroundColor: '#d32e31',
    borderRadius: 8,
  },
  btnReject: {
    backgroundColor: '#5cb85c',
    borderRadius: 8,
  },
  capturedImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    borderWidth: 1,
    borderRadius: 8,
  },
});

const ChiTietDonHang = ({ route }: any) => {

  const navigation = useNavigation();

  return (
    <View w="100%" alignItems="center" style={style.container}>
      <Header headerTitle="VÉ THƯỜNG" subTitle="Chi tiết đơn hàng" />
      <ScrollView style={style.contentContainer}>
        <View w="100%" style={style.wrapHeaderContent}>
          <View style={style.wrapLeftHeaderContent}>
            <View w="100%" mb="2" display="flex" flexDirection="row">
              <View w="40%" textAlign="left">
                <Text fontSize="sm" fontWeight="bold">
                  Đơn hàng:
                </Text>
              </View>
              <View w="50%" textAlign="left">
                <Text fontSize="sm">#3123122312</Text>
              </View>
            </View>
            <View w="100%" mb="2" display="flex" flexDirection="row">
              <View w="40%" textAlign="left">
                <Text fontSize="sm" fontWeight="bold">
                  Họ tên:
                </Text>
              </View>
              <View w="50%" textAlign="left">
                <Text fontSize="sm">Nguyễn Văn Uyên</Text>
              </View>
            </View>
            <View w="100%" mb="2" display="flex" flexDirection="row">
              <View w="40%" textAlign="left">
                <Text fontSize="sm" fontWeight="bold">
                  CCCD/CMND:
                </Text>
              </View>
              <View w="50%" textAlign="left">
                <Text fontSize="sm">112233445566</Text>
              </View>
            </View>
            <View w="100%" mb="2" display="flex" flexDirection="row">
              <View w="40%" textAlign="left">
                <Text fontSize="sm" fontWeight="bold">
                  Thời gian đặt:
                </Text>
              </View>
              <View w="50%" textAlign="left">
                <Text fontSize="sm">00:12:22 23/2/2023</Text>
              </View>
            </View>
          </View>
          <View style={style.wrapRightHeaderContent}>
            <Button w="100%" style={style.btnReject}>
              <Text style={{ color: '#fff' }}>Gọi điện</Text>
            </Button>
          </View>
        </View>

        <ScrollView style={style.wrapScrollView}>
          <View style={style.wrapDetailOrder}>
            <Text fontSize="sm">Loại hình: Mega 645</Text>
            <View
              w="100%"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mt="3">
              {/* <View ml="2" mr="2">
                <Text></Text>
              </View> */}
              <View ml="2" mr="2">
                <Ball number={9} />
              </View>
              <View ml="2" mr="2">
                <Ball number={4} />
              </View>
              <View ml="2" mr="2">
                <Ball number={1} />
              </View>
              <View ml="2" mr="2">
                <Ball number={7} />
              </View>
              <View ml="2" mr="2">
                <Ball number={9} />
              </View>
              <View ml="2" mr="2">
                <Ball number={9} />
              </View>
              {/* <View ml="2" mr="2">
            <Ball />
          </View> */}
            </View>
            <View w="100%" mt="4" mb="4" style={style.lines}></View>
            <View
              w="100%"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Đơn hàng:
              </Text>
              <Text>#12312321312</Text>
            </View>
            <View
              w="100%"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Text fontSize="sm" fontWeight="bold">
                Quay thưởng:
              </Text>
              <Text>12/03/2023</Text>
            </View>
            <View w="100%" mt="4" mb="4" style={style.lines}></View>
            <View
              w="100%"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <Text fontSize="lg" fontWeight="bold" style={style.textColor}>
                TỔNG TIỀN:
              </Text>
              <Text fontSize="lg" fontWeight="bold" style={style.textColor}>
                25000đ
              </Text>
            </View>
            <View w="100%" mt="4" mb="4" style={style.lines}></View>
            <View
              w="100%"
              display="flex"
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="center">
              <TouchableOpacity
                style={style.takePhotoBtn}
                onPress={() => {
                  navigation.navigate('Camera')
                }}
              >
                <Text style={style.textPhotoBtn}>Chụp ảnh</Text>
              </TouchableOpacity>
              {/* <View ml="2" style={style.takePhotoBtn}>

              </View> */}
              {route?.params?.imageSrc && (
                <View style={style.takePhotoBtn}>
                  <Image source={{ uri: route?.params?.imageSrc }} style={style.capturedImage} />
                </View>
              )}
              {/* <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png" }} style={style.capturedImage} /> */}
            </View>
          </View>
        </ScrollView>

        <View
          w="100%"
          mt="3"
          mb="5"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Button w="48%" style={style.btnConfirm} colorScheme="success">
            <Text style={{ color: '#fff' }}>Huỷ</Text>
          </Button>
          <Button w="48%" style={style.btnReject}>
            <Text style={{ color: '#fff' }}>Hoàn thành giao dịch</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChiTietDonHang;
