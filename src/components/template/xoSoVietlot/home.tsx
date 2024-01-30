import { fontWeight, height } from '@mui/system';
import { Stack, View } from 'native-base';
import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../common/header';

const style = StyleSheet.create({
  container: {
    width: '85%',
    display: 'flex',
    alignItems: 'center',
    marginTop: 16
  },
  option: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    backgroundColor: '#d32e31',
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '300',
  },
  wrapHeaderTitle: {
    width: '100%',
    marginBottom: 20,
    textAlign: 'left',
  },
  headerTitle: {
    color: '#d32e31',
    fontSize: 32,
    fontWeight: '300',
  },
  subHeaderTitle: {
    color: '#a1a1a1',
    fontSize: 16,
    fontWeight: '300',
  },
});

const VietlotHome = () => {
  const navigation = useNavigation();
  return (
    <View w="100%" alignItems="center" justifyContent="center">
      <Header headerTitle="VIETLOT" backArrow />
      <View style={style.container}>
        <View style={style.wrapHeaderTitle}>
          {/* <Text style={style.headerTitle}>Xổ số Vietlot</Text> */}
          {/* <Text style={style.subHeaderTitle}>
            Mời chọn loại xổ số
          </Text> */}
        </View>
        <TouchableOpacity
          style={style.option}
          onPress={() => {
            navigation.navigate('XoSoVietLot_Keno')
          }}
        >
          <Text style={style.title}>VÉ SỐ KENO</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.option}
          onPress={() => {
            navigation.navigate('XoSoVietLot_VeThuong')
          }}
        >
          <Text style={style.title}>VÉ THƯỜNG</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VietlotHome;
