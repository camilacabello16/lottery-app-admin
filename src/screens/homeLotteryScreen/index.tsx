import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Stack, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/common/header';
import { logout } from '../../redux/store';
import { removeDevice } from '../../redux/bluetoothStore';
import axios from 'axios';
import { STAFF_LOGOUT } from '../../constants/api';
import { resetValue } from '../../redux/amountStore';
import { switchRootApi } from '../../redux/rootApiStore';

const style = StyleSheet.create({
    container: {
        width: '85%',
        display: 'flex',
        alignItems: 'center',
        marginTop: 20
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

const HomeLotteryScreen = () => {
    const dispatch = useDispatch();
    const isFocus = useIsFocused();
    const navigation = useNavigation();
    const bleData = useSelector((state: any) => state.bluetooth);
    const loginData = useSelector((state: any) => state.auth);
    const rootApi = useSelector((state: any) => state.rootApi);

    const [isEnabled, setIsEnabled] = useState(rootApi.rootApi == "https://api.veso3mien.vn" ? true : false);
    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        dispatch(switchRootApi());
        dispatch(logout());
        dispatch(removeDevice());
        dispatch(resetValue());
        axios.get(rootApi.rootApi + STAFF_LOGOUT, {
            headers: {
                Authorization: loginData.userData.access_token,
            },
        }).then(res => console.log(res))
        navigation.navigate('Login');
    };

    useEffect(() => {
        console.log("BLE", bleData.devices);
    }, [isFocus])

    return (
        <View w="100%" alignItems="center" justifyContent="center">
            <Header headerTitle="TRANG CHỦ" subTitle='Mời chọn loại vé số muốn quản lý' />
            <View style={style.container}>
                {/* <View style={style.wrapHeaderTitle}>
                    <Text style={style.headerTitle}>Trang chủ</Text>
                    <Text style={style.subHeaderTitle}>Mời chọn loại xổ số muốn quản lý</Text>
                </View> */}
                <TouchableOpacity
                    style={style.option}
                    onPress={() => {
                        navigation.navigate('XoSoKienThiet')
                    }}
                >
                    <Text style={style.title}>XỔ SỐ KIẾN THIẾT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={style.option}
                    onPress={() => {
                        // navigation.navigate('Bluetooth', { url: 'XoSoDienToan' });
                        // navigation.navigate('XoSoDienToan')
                        if (bleData.devices.length > 0) {
                            navigation.navigate('XoSoDienToan')
                        }
                        else navigation.navigate('Bluetooth', { url: 'XoSoDienToan' });
                    }}
                >
                    <Text style={style.title}>XỔ SỐ ĐIỆN TOÁN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={style.option}
                    onPress={() => {
                        // navigation.navigate('Bluetooth', { url: 'XoSoVietlot' });
                        // navigation.navigate('XoSoVietlot');
                        if (bleData.devices.length > 0) {
                            navigation.navigate('XoSoVietlot');
                        }
                        else navigation.navigate('Bluetooth', { url: 'XoSoVietlot' });
                    }}
                >
                    <Text
                        style={style.title}
                    >XỔ SỐ VIETLOTT</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={style.option}
                    onPress={() => {
                        dispatch(logout());
                        dispatch(removeDevice());
                        dispatch(resetValue());
                        axios.get(rootApi.rootApi + STAFF_LOGOUT, {
                            headers: {
                                Authorization: loginData.userData.access_token,
                            },
                        }).then(res => console.log(res))
                        navigation.navigate('Login');
                    }}
                >
                    <Text
                        style={style.title}
                    >ĐĂNG XUẤT</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={style.option}
                    onPress={() => {
                        navigation.navigate('Bluetooth');
                    }}
                >
                    <Text
                        style={style.title}
                    >KẾT NỐI BLUETOOTH</Text>
                </TouchableOpacity> */}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
                <Text style={{ color: "#000" }}>{isEnabled ? "Đang sử dụng bản Product" : "Đang sử dụng bản Dev"}</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
                />
            </View>
        </View>
    );
};

export default HomeLotteryScreen;
