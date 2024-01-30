import { Text, Center, View, Modal, Button } from 'native-base';
import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Header from '../../common/header';
import axios from 'axios';
import { HOLD_ORDER, ORDER_DETAIL, STAFF_LOGOUT } from '../../../constants/api';
import moment from 'moment';
import mqtt from 'precompiled-mqtt';
import { CONFIG_SOCKET } from '../../../constants/constants';
import { ENUM_XOSO_CHILD_TYPE } from '../../../constants/enum';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { alert } from '@baronha/ting';
import { logout } from '../../../redux/store';
import { removeDevice } from '../../../redux/bluetoothStore';
import { makeid } from '../../../utils/common';
import { resetValue } from '../../../redux/amountStore';

const style = StyleSheet.create({
    container: {
        width: '85%',
        display: 'flex',
        alignItems: 'center',
        marginTop: 10,
    },
    wrapSelected: {
        width: 150,
        height: 39,
        borderRadius: 8,
        backgroundColor: '#efeff0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdown2BtnTxtStyle: {
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 17,
    },
    dropdownStyle: {
        borderRadius: 8,
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
        width: 150,
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
    wrapFlatList: {
        width: '100%',
        height: '75%',
    },
    wrapItem: {
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#efeff0',
        borderColor: '#efeff0',
        borderWidth: 2,
        marginTop: 8,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    idTicket: {
        fontSize: 18,
        fontWeight: '800',
        color: '#d32e31',
    },
    wrapSelectedItem: {
        width: '100%',
        height: 32,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const MOCK_FILTER = [
    {
        key: 0,
        value: "Tất cả"
    },
    {
        key: 1,
        value: "Lô tô 2 số"
    },
    {
        key: 2,
        value: "Điện toán 6/36"
    },
    {
        key: 3,
        value: "Lô tô 3 số"
    },
    {
        key: 4,
        value: "Lô tô 5 số"
    },
];

interface VeXoSoDienToan {
    orderID: number,
    buyTime: string,
    period: string,
    periodTime: string,
    paymentType: string,
    totalAmount: number,
    status: number,
    lotteryType: number,
    reverseFee: number
}

const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    });

    return formatter.format(amount);
};

const DanhSachVeChoScreen = () => {
    const loginData = useSelector((state: any) => state.auth);
    const rootApi = useSelector((state: any) => state.rootApi);
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [search, setSearch] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedType, setSelectedType] = useState<number>(0);
    const [data, setData] = useState<VeXoSoDienToan[]>([]);

    const getData = () => {
        axios.get(rootApi.rootApi + ORDER_DETAIL + "?gameId=2&status=2" + '&lotteryType=' + (selectedType == 0 ? "" : selectedType), {
            headers: {
                Authorization: loginData.userData?.access_token
            }
        }).then(res => {
            console.log("RESP", res.data);
            if (res.data.error == 401) {
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
                if (res.data.data) {
                    var revertData = res?.data?.data.reverse();
                    // revertData = revertData.filter(o => o.e)
                    setData(revertData);
                } else {
                    setData([])
                }
            }
        })
    }

    useEffect(() => {
        getData();
    }, [isFocused, selectedType])

    useEffect(() => {
        const options = {
            // host: 'ws://socket-client.veso3mien.vn',
            // port: 8083,
            clientId: 'APPNV_' + loginData.userData?.staff_id,
            username: CONFIG_SOCKET.username,
            password: CONFIG_SOCKET.password,
            path: CONFIG_SOCKET.path
        };
        const mqttClient = mqtt.connect(CONFIG_SOCKET.host, options);

        mqttClient.on('connect', () => {
            console.log('Connected to MQTT broker 123');
            mqttClient.subscribe('oder_done');
        });

        mqttClient.on('message', (topic, message) => {
            console.log(`Received message on topic ${topic}: ${message.toString()}`);
            var dataReceive = JSON.parse(message.toString());

            var newData = {
                orderID: parseInt(dataReceive?.orderID),
                buyTime: dataReceive?.buyTime,
                period: dataReceive?.period,
                periodTime: dataReceive?.periodTime,
                paymentType: dataReceive?.paymentType,
                totalAmount: parseInt(dataReceive?.talAmount),
                status: parseInt(dataReceive?.status),
                lotteryType: parseInt(dataReceive?.lotteryType),
            }
            // setTimeout(() => {
            //     var newArr = [newData].concat(data);

            //     setData(newArr);
            // }, 1000)
            getData();
        });

        mqttClient.on('error', (error) => {
            console.error('MQTT Error:', error);
        });

        return () => {
            mqttClient.end();
        };
    }, [])

    const holdOrder = (data) => {
        axios.post(rootApi.rootApi + HOLD_ORDER, {
            id: data.orderID
        },
            {
                headers: {
                    Authorization: loginData.userData.access_token
                }
            }).then(res => {
                console.log(res);
                alert({
                    title: "Giữ vé thành công",
                    message: '',
                    preset: 'done',
                });
                getData();
            }).catch(err => {
                console.log(err);

            })
    }

    const renderItem = ({ item }: any) => (
        <View style={style.wrapItem}>
            <TouchableOpacity
                onPress={() => navigation.navigate('XoSoDienToan_ChiTiet', { orderId: item.orderID, lotteryType: item.lotteryType })}
            >
                <View
                    style={{
                        width: '100%',
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <Text style={style.idTicket}>#{item?.orderID}</Text>
                    <Text fontWeight="600">{ENUM_XOSO_CHILD_TYPE.find(o => o.key == item?.lotteryType)?.value}</Text>
                </View>
                <View style={style.lines}></View>
                <View
                    w="100%"
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between">
                    <Text fontSize="md" fontWeight="600">
                        Kỳ mua:{' '}
                    </Text>
                    <Text fontSize="md">{item?.period}</Text>
                </View>
                <View
                    w="100%"
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between">
                    <Text fontSize="md" fontWeight="600">
                        Quay thưởng:{' '}
                    </Text>
                    <Text fontSize="md">{moment(item?.periodTime).format("DD/MM/YYYY HH:mm:ss")}</Text>
                </View>
                <View
                    w="100%"
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between">
                    <Text fontSize="md" fontWeight="600">
                        Thời gian:{' '}
                    </Text>
                    <Text fontSize="md">{moment(item?.buyTime).format("DD/MM/YYYY HH:mm:ss")}</Text>
                </View>
                <View
                    w="100%"
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between">
                    <Text fontSize="md" fontWeight="600">
                        Giá vé:{' '}
                    </Text>
                    <Text fontSize="md">{formatCurrency(item?.totalAmount - item?.reserve_fee)}</Text>
                </View>
            </TouchableOpacity>

            <View mt="2">
                <Button
                    style={style.button}
                    onPress={() => holdOrder(item)}
                >
                    <Text style={style.textButton}>Giữ vé</Text>
                </Button>
            </View>
        </View>
    );

    return (
        <View w="100%" alignItems="center">
            <Modal isOpen={showModal} size="lg" onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.Header>Loại vé</Modal.Header>
                    {MOCK_FILTER.length > 0 ? MOCK_FILTER?.map((item, index) => (
                        <TouchableOpacity
                            style={{
                                ...style.wrapSelectedItem,
                                backgroundColor:
                                    item.key === selectedType ? '#d32e31' : '#fff',
                            }}
                            key={index}
                            onPress={() => setSelectedType(item.key)}>
                            <Text
                                style={{
                                    color: item.key === selectedType ? '#fff' : '#000',
                                }}>
                                {item.value}
                            </Text>
                        </TouchableOpacity>
                    )) : <View></View>}
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
            <Header headerTitle="XỔ SỐ ĐIỆN TOÁN" subTitle="Danh sách vé chờ" backArrow url='HomeScreen' screen='DIENTOAN' />
            <View style={style.container}>
                <Center
                    w="100%"
                    mt={2}
                    alignItems="center"
                    flexDirection="row"
                    justifyContent="space-between"
                    flexWrap="wrap">
                    <TextInput
                        style={style.inputNumber}
                        onChangeText={val => setSearch(val)}
                        value={search}
                        placeholder="Tìm kiếm"
                        keyboardType="numeric"
                    />
                    <TouchableOpacity
                        style={style.wrapSelected}
                        onPress={() => setShowModal(true)}>
                        <Text>{MOCK_FILTER.find(o => o.key == selectedType).value}</Text>
                    </TouchableOpacity>
                </Center>
            </View>
            <View style={style.lines}></View>
            <View style={style.container}>
                <FlatList
                    style={style.wrapFlatList}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.orderID.toString()}
                />
            </View>
        </View>
    );
};

export default DanhSachVeChoScreen;
