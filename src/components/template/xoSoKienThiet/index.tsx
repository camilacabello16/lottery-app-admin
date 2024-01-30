import {
    Text,
    Center,
    View,
    ScrollView,
    Button,
    Modal,
    Image,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Header from '../../common/header';
import { KHO_VE_XO_SO_KIEN_THIET } from '../../types';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FlatList } from 'react-native';
import { ENUM_LOCATION } from '../../../constants/enum';
import axios from 'axios';
import { PROVINCE, RADIOS, STAFF_LOGOUT, XSKT_CREATE } from '../../../constants/api';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import { alert } from '@baronha/ting';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/store';
import { removeDevice } from '../../../redux/bluetoothStore';
import { resetValue } from '../../../redux/amountStore';

const style = StyleSheet.create({
    container: {
        width: '85%',
        display: 'flex',
        alignItems: 'center',
        marginTop: 10,
    },
    wrapSelected: {
        width: 220,
        height: 39,
        borderRadius: 8,
        backgroundColor: '#efeff0',
    },
    dropdown2BtnTxtStyle: {
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 17,
    },
    dropdownStyle: {
        borderRadius: 8,
        width: 200
    },
    rowStyle: {
        borderBottomWidth: 0,
        height: 42,
    },
    lines: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#cecece',
        marginVertical: 12,
    },
    inputNumber: {
        width: 172,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#efeff0',
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 17,
    },
    inputDate: {
        width: 200,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#efeff0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 12,
    },
    wrapGroupNumber: {
        width: '100%',
        height: 40,
        borderRadius: 8,
        backgroundColor: '#efeff0',
        fontWeight: '400',
        fontSize: 17,
        paddingHorizontal: 12,
        marginTop: 6,
    },
    capturedImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        borderWidth: 1,
        borderRadius: 8,
    },
    btnDisable: {
        backgroundColor: '#8a8686',
        borderRadius: 8,
    },
    button: {
        width: '100%',
        borderRadius: 8,
        height: 48,
        backgroundColor: '#d32e31',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    textButton: {
        fontWeight: '300',
        fontSize: 17,
        color: '#fff',
    },
    imgView: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#efeff0',
        marginLeft: 4,
    },
    takePhotoBtn: {
        // width: '100%',
        height: 48,
        borderWidth: 1,
        borderStyle: 'dashed',
        backgroundColor: '#efeff0',
        borderRadius: 8,
        display: 'flex',
        textAlign: 'center',
        borderColor: 'gray',
        color: 'gray',
        marginVertical: 8,
        position: 'relative'
    },
    textPhotoBtn: {
        color: 'gray',
    },
});

const MOCK_MENH_GIA = [
    10000,
    20000,
    50000,
    100000,
    200000,
    500000,
];

const MOCK_LOAI_XO_SO = ['Xổ số miền Bắc'];
const MOCK_KHU_VUC = ['Miền Bắc'];
const MOCK_ANH_VE = [
    {
        id: 1,
        uri: 'https://www.minhchinh.com/upload/images/veso/IMG_0001(189).png',
    },
    {
        id: 2,
        uri: 'https://www.minhchinh.com/upload/images/veso/IMG_0001(189).png',
    },
    {
        id: 3,
        uri: 'https://www.minhchinh.com/upload/images/veso/IMG_0001(189).png',
    },
    {
        id: 4,
        uri: 'https://www.minhchinh.com/upload/images/veso/IMG_0001(189).png',
    },
    {
        id: 5,
        uri: 'https://www.minhchinh.com/upload/images/veso/IMG_0001(189).png',
    },
    {
        id: 6,
        uri: 'https://www.minhchinh.com/upload/images/veso/IMG_0001(189).png',
    },
];

interface Radios {
    time: string;
    name: string;
    province_id: string;
}

const XoSoKienThietTemplate: React.FC = () => {
    const dispatch = useDispatch();
    const loginData = useSelector((state: any) => state.auth);
    const rootApi = useSelector((state: any) => state.rootApi);
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const route = useRoute();

    const [khoVe, setKhoVe] = useState<string>(KHO_VE_XO_SO_KIEN_THIET.MIEN_BAC);
    const [loaiXoSo, setLoaiXoSo] = useState<string>(MOCK_LOAI_XO_SO[0]);
    const [maKy, setMaKy] = useState<string>('00120000219');
    const [showCam, setShowCam] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [listProvince, setListProvince] = useState<any[]>([]);
    const [isTakePicture, setIsTakePicture] = useState<boolean>(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    //param
    const [xoSoType, setXoSoType] = useState<number>(1);
    const [menhGia, setMenhGia] = useState<number>(10000);
    const [soLuong, setSoLuong] = useState<number>(1);
    const [ngayMua, setNgayMua] = useState<Date>(new Date());
    const [khuVuc, setKhuVuc] = useState<number>(1);
    const [boSo, setBoSo] = useState<string>('');
    const [kiHieu, setKiHieu] = useState<string>('');
    const [createdDate, setCreatedDate] = useState<string>(moment().format("YYYY-MM-DD HH:mm:ss").toString());
    const [listImage, setListImage] = useState<any[]>([]);
    const [listRadios, setListRadios] = useState<Radios[]>([]);

    const getLocation = () => {
        axios.get(rootApi.rootApi + PROVINCE).then(res => {
            setListProvince(res.data.data);
        })
    }

    const getListRadios = () => {
        axios.get(rootApi.rootApi + RADIOS + '?location=' + xoSoType + '&day=' + moment(ngayMua).format('YYYY-MM-DD')).then(res => {
            console.log(res.data.data);

            var list = [];
            res.data.data[0].radios.forEach((element: any) => {
                var item = {
                    time: res.data.data[0].time,
                    name: element?.title,
                    province_id: element?.province_id,
                }
                list.push(item);
            });
            console.log(list);

            setListRadios(list);
        })
    }

    const incrementNumberWithPrefix = (s: string) => {
        var res = parseInt(s) + 1;
        return res.toString();
    }

    useEffect(() => {
        getListRadios();
    }, [xoSoType, ngayMua])

    useEffect(() => {
        getLocation();
        console.log("PARAM", route?.params);
        if (route?.params?.param) {
            setXoSoType(route?.params?.param.location);
            setMenhGia(route?.params?.param.money);
            setSoLuong(route?.params?.param.qty);
            setNgayMua(route?.params?.param.day);
            setKhuVuc(route?.params?.param.province_id);
            setBoSo(incrementNumberWithPrefix(route?.params?.param.code));
            setKiHieu(route?.params?.param.symbols[0][0]);
            setIsTakePicture(false);
            setListImage([]);
        }

        if (route?.params?.imageBinary) {
            setIsTakePicture(true);
            setListImage(route?.params?.imageSrc)
        }
    }, [isFocused])

    const listKhoVe = Object.values(KHO_VE_XO_SO_KIEN_THIET);
    const listMenhGia = MOCK_MENH_GIA;

    const onChangeNumberic = (text: string) => {
        setSoLuong(+text.replace(/[^0-9]/g, ''));
    };

    const onChangeDate = (event: any, selectedDate: any) => {
        console.log(selectedDate);

        const currentDate = selectedDate;
        setShowDatePicker(false);
        setNgayMua(currentDate);
        setCreatedDate(moment(currentDate).format("YYYY-MM-DD HH:mm:ss"));
    };

    const renderAnhVeLe = ({ item }: any) => {
        return (
            <View style={style.imgView}>
                <Image
                    source={{
                        uri: item?.uri,
                    }}
                    width="100%"
                    alt="img"
                />
            </View>
        );
    };

    const submitTicket = () => {

        var param = {
            location: xoSoType,
            province_id: khuVuc,
            day: createdDate,
            money: menhGia,
            code: boSo,
            symbols: [kiHieu],
            qty: soLuong,
            img: route?.params?.imageBinary
        }
        console.log(param);
        axios.post(rootApi.rootApi + XSKT_CREATE, param, {
            headers: {
                Authorization: loginData.userData.access_token,
            },
        })
            .then((response) => {
                console.log("RES", response.data);
                if (response.data.error == 401) {
                    alert({
                        title: "Token hết hạn",
                        message: 'Vui lòng đăng nhập lại',
                        preset: 'error',
                    });
                    dispatch(logout());
                    dispatch(removeDevice());
                    dispatch(resetValue());
                    axios.get(rootApi.rootApi + STAFF_LOGOUT, {
                        headers: {
                            Authorization: loginData.userData.access_token,
                        },
                    }).then(res => console.log(res))
                    navigation.navigate('Login');
                }
                else {
                    alert({
                        title: 'Khởi tạo thành công',
                        message: '',
                        preset: 'done'
                    });
                    var cloneBoso = boSo;
                    var cloneKiHieu = kiHieu;
                    setBoSo(incrementNumberWithPrefix(cloneBoso));
                    setKiHieu(cloneKiHieu);
                    setIsTakePicture(false);
                    setListImage([]);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <View w="100%" alignItems="center">
            <Modal isOpen={showModal} size="lg" onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.Header>Ảnh vé</Modal.Header>
                    <Modal.Body>
                        <View
                            w="100%"
                            alignItems="flex-start"
                            justifyContent="space-between">
                            <Text fontSize="md" fontWeight="light">
                                Chụp ảnh vé
                            </Text>
                            <Button style={style.takePhotoBtn}>
                                <Text style={style.textPhotoBtn}>Chụp ảnh</Text>
                            </Button>
                        </View>
                        <View
                            w="100%"
                            alignItems="flex-start"
                            justifyContent="space-between">
                            <Text fontSize="md" fontWeight="light">
                                Ảnh vé lẻ:
                            </Text>
                            <FlatList
                                data={MOCK_ANH_VE}
                                horizontal={true}
                                renderItem={renderAnhVeLe}
                                keyExtractor={item => item.id.toString()}
                            />
                        </View>
                        {/* <View
              w="100%"
              mt={2}
              alignItems="flex-start"
              justifyContent="space-between">
              <Text fontSize="md" fontWeight="light">
                Ảnh vé cặp nguyên:
              </Text>
              <FlatList
                data={MOCK_ANH_VE}
                horizontal={true}
                renderItem={renderAnhVeLe}
                keyExtractor={item => item.id.toString()}
              />
            </View> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="ghost"
                                colorScheme="blueGray"
                                onPress={() => {
                                    setShowModal(false);
                                }}>
                                Đóng
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Header headerTitle="XỔ SỐ KIẾN THIẾT" backArrow />
            <View style={style.container}>
                {/* <Center
                    w="100%"
                    mt={2}
                    alignItems="center"
                    flexDirection="row"
                    justifyContent="space-between"
                    flexWrap="wrap">
                    <Text fontSize="md" fontWeight="light">
                        Kho vé:
                    </Text>
                    <SelectDropdown
                        data={ENUM_LOCATION}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                            setKhoVe(selectedItem);
                        }}
                        defaultValue={1}
                        rowStyle={style.rowStyle}
                        buttonStyle={style.wrapSelected}
                        buttonTextStyle={style.dropdown2BtnTxtStyle}
                        rowTextStyle={style.dropdown2BtnTxtStyle}
                        dropdownStyle={style.dropdownStyle}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item;
                        }}
                    />
                </Center>
                <View style={style.lines}></View> */}
                <ScrollView w={['100%', '300']} h="70%">
                    <Center
                        w="100%"
                        mt={4}
                        alignItems="center"
                        flexDirection="row"
                        justifyContent="space-between"
                        flexWrap="wrap">
                        <Text fontSize="md" fontWeight="light">
                            Loại xổ số:
                        </Text>
                        <SelectDropdown
                            data={ENUM_LOCATION.map(o => o.value)}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index);
                                setXoSoType(ENUM_LOCATION.find(o => o.value == selectedItem)?.key);
                                setKiHieu('');
                            }}
                            defaultValue={"Xổ số miền Bắc"}
                            rowStyle={style.rowStyle}
                            buttonStyle={style.wrapSelected}
                            buttonTextStyle={style.dropdown2BtnTxtStyle}
                            rowTextStyle={style.dropdown2BtnTxtStyle}
                            dropdownStyle={style.dropdownStyle}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item;
                            }}
                        />
                    </Center>
                    <Center
                        w="100%"
                        mt={4}
                        alignItems="center"
                        flexDirection="row"
                        justifyContent="space-between"
                        flexWrap="wrap">
                        <Text fontSize="md" fontWeight="light">
                            Mệnh giá:
                        </Text>
                        <SelectDropdown
                            data={listMenhGia}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index);
                                setMenhGia(selectedItem);
                            }}
                            defaultValue={menhGia}
                            rowStyle={style.rowStyle}
                            buttonStyle={style.wrapSelected}
                            buttonTextStyle={style.dropdown2BtnTxtStyle}
                            rowTextStyle={style.dropdown2BtnTxtStyle}
                            dropdownStyle={style.dropdownStyle}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item;
                            }}
                        />
                    </Center>
                    <Center
                        w="100%"
                        mt={4}
                        alignItems="center"
                        flexDirection="row"
                        justifyContent="space-between"
                        flexWrap="wrap">
                        <Text fontSize="md" fontWeight="light">
                            Số lượng:
                        </Text>
                        <TextInput
                            style={style.inputNumber}
                            onChangeText={val => onChangeNumberic(val)}
                            value={`${soLuong}`}
                            placeholder="Số lượng vé"
                            keyboardType="numeric"
                        />
                    </Center>
                    <Center
                        w="100%"
                        mt={4}
                        alignItems="center"
                        flexDirection="row"
                        justifyContent="space-between"
                        flexWrap="wrap"
                    >
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text fontSize="md" fontWeight="light">
                                Ngày chọn:
                            </Text>
                            <TextInput value={moment(ngayMua).format("DD/MM/YYYY HH:mm:ss").toString()} editable={false} />
                        </TouchableOpacity>

                        {showDatePicker &&
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={ngayMua}
                                mode='datetime'
                                // is24Hour={true}
                                display="default"
                                style={{ backgroundColor: 'transparent' }}
                                onChange={onChangeDate}
                            />
                        }
                        {/* {showDatePicker && (
                            <DateTimePicker
                                value={ngayMua}
                                mode="time"
                                is24Hour={true}
                                display="default"
                            //   onChange={handleDateChange}
                            />
                        )} */}
                    </Center>
                    <Center
                        w="100%"
                        mt={4}
                        alignItems="center"
                        flexDirection="row"
                        justifyContent="space-between"
                        flexWrap="wrap">
                        <Text fontSize="md" fontWeight="light">
                            Khu vực:
                        </Text>
                        <SelectDropdown
                            data={listRadios.map(o => o.name + " " + moment(o.time).format("DD/MM/YYYY"))}
                            onSelect={(selectedItem, index) => {
                                setKhuVuc(parseInt(listRadios.find(o => (o.name + " " + moment(o.time).format("DD/MM/YYYY")) == selectedItem)?.province_id));
                            }}
                            defaultValue={listRadios.find(o => o.province_id == khuVuc.toString())?.name + " " + moment(listRadios.find(o => o.province_id == khuVuc.toString())?.time).format("DD/MM/YYYY")}
                            rowStyle={style.rowStyle}
                            buttonStyle={style.wrapSelected}
                            buttonTextStyle={style.dropdown2BtnTxtStyle}
                            rowTextStyle={style.dropdown2BtnTxtStyle}
                            dropdownStyle={style.dropdownStyle}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item;
                            }}
                        />
                    </Center>
                    {/* <Center
                        w="100%"
                        mt={4}
                        alignItems="center"
                        flexDirection="row"
                        justifyContent="space-between"
                        flexWrap="wrap">
                        <Text fontSize="md" fontWeight="light">
                            Mã kỳ:
                        </Text>
                        <TextInput
                            style={style.inputNumber}
                            onChangeText={val => setMaKy(val)}
                            value={maKy}
                            placeholder="Mã kỳ"
                            editable={false}
                        />
                    </Center> */}
                    <View
                        w="100%"
                        mt={5}
                        alignItems="flex-start"
                        justifyContent="space-between">
                        <Text fontSize="md" fontWeight="light">
                            Bộ số*(Giới hạn 0 kí tự):
                        </Text>
                        <TextInput
                            style={style.wrapGroupNumber}
                            onChangeText={val => setBoSo(val)}
                            value={boSo}
                            placeholder="Bộ số"
                        />
                    </View>
                    {xoSoType == 1 &&
                        <View
                            w="100%"
                            mt={5}
                            alignItems="flex-start"
                            justifyContent="space-between">
                            <Text fontSize="md" fontWeight="light">
                                Kí hiệu*:
                            </Text>
                            <TextInput
                                style={style.wrapGroupNumber}
                                onChangeText={val => setKiHieu(val)}
                                value={kiHieu}
                                placeholder="Ký hiệu"
                            />
                        </View>
                    }
                    <View
                        w="100%"
                        display="flex"
                        flexDirection="row"
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <ScrollView horizontal style={{ height: 150 }}>
                            {listImage ? listImage.map((item: any, index: any) => {
                                return (
                                    <View style={style.takePhotoBtn} key={index}>
                                        <TouchableOpacity
                                            style={{
                                                position: 'absolute',
                                                top: -1,
                                                right: -1,
                                                width: 20,
                                                height: 20,
                                                backgroundColor: 'red',
                                                zIndex: 10,
                                                borderRadius: 100,
                                            }}
                                            onPress={() => {
                                                console.log("SPLICE", index);
                                                var listClone = listImage;

                                                var removeItem = listClone.splice(index, 1)[0];
                                                listClone = listClone.filter(o => o != removeItem);
                                                setListImage(listClone);
                                                route?.params?.imageBinary.splice(index, 1);
                                                if (route?.params?.imageBinary.length == 0) setIsTakePicture(false);
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#fff',
                                                    fontSize: 18,
                                                    textAlign: 'center'
                                                }}
                                            >X</Text>
                                        </TouchableOpacity>
                                        <Image source={{ uri: item.uri }} style={style.capturedImage} alt='abc' />
                                    </View>
                                );
                            }) : null}
                        </ScrollView>
                    </View>

                </ScrollView>
                <Center w="100%" mt={2} justifyContent="space-between">

                    <View w="100%" mt={2}>
                        <Button
                            w={'100%'}
                            style={style.button}
                            // onPress={() => setShowModal(true)}
                            onPress={() => {
                                navigation.navigate('Camera', { url: 'XoSoKienThiet' })
                            }}
                        >
                            <Text style={style.textButton}>Chụp ảnh vé</Text>
                        </Button>
                    </View>

                    <View w="100%" mt={2}>
                        <Button
                            w={'100%'}
                            style={isTakePicture ? style.button : style.btnDisable}
                            onPress={submitTicket}
                            disabled={!isTakePicture}
                        >
                            <Text style={style.textButton}>Khởi tạo</Text>
                        </Button>
                    </View>
                </Center>
            </View>
        </View>
    );
};

export default XoSoKienThietTemplate;
