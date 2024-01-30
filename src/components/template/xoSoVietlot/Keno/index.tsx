import { Text, Center, View, Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import Header from '../../../common/header';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { ORDER_DETAIL } from '../../../../constants/api';
import moment from 'moment';
import { ENUM_XOSO_CHILD_TYPE } from '../../../../constants/enum';
import { CONFIG_SOCKET } from '../../../../constants/constants';
import mqtt from 'precompiled-mqtt';
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from 'react-redux';

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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
});

interface XoSoVietLot {
    orderID: number,
    buyTime: string,
    period: string,
    periodTime: string,
    paymentType: string,
    totalAmount: number,
    status: number,
    lotteryType: number,
    reserveFee: number
}

const DanhSachVeChoKeno = ({ route }: any) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const loginData = useSelector((state: any) => state.auth);
    const rootApi = useSelector((state: any) => state.rootApi);

    const [search, setSearch] = useState<string>('');
    const [data, setData] = useState<XoSoVietLot[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [newTicket, setNewTicket] = useState<XoSoVietLot>();

    const getData = () => {

        axios.get(rootApi.rootApi + ORDER_DETAIL + "?lotteryType=5&status=2&staff_id=" + loginData.userData?.staff_id, {
            headers: {
                Authorization: loginData.userData.access_token
            }
        }).then(res => {
            console.log("KENO", res?.data?.data);

            if (res?.data?.data) {
                var revertData = res?.data?.data.reverse();
                setData(revertData);
                if (revertData.length != 0 && route.name == "XoSoVietLot_Keno") {
                    setNewTicket(revertData[revertData.length - 1]);
                    setModalVisible(true);
                }
            }
            else {
                setData([]);
            }
        })
    }

    useEffect(() => {
        if (isFocused)
            getData();
    }, [isFocused])

    useEffect(() => {
        if (isFocused) {
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
                // alert({
                //     title: "kêt nối thành công",
                //     message: 'kêt nối thành công',
                //     preset: 'done',
                // });
                console.log('Connected to MQTT broker 123');
                mqttClient.subscribe('oder_done');
            });

            mqttClient.on('message', (topic, message) => {
                // alert({
                //     title: "có tin nhắn",
                //     message: 'có tin nhắn',
                //     preset: 'done',
                // });
                console.log("Topic:", topic);
                console.log("Received message on topic:", message.toString());
                var dataReceive = JSON.parse(message.toString());

                var newData = {
                    orderID: parseInt(dataReceive?.orderID),
                    buyTime: dataReceive?.buyTime,
                    period: dataReceive?.period,
                    periodTime: dataReceive?.periodTime,
                    paymentType: dataReceive?.paymentType,
                    totalAmount: parseInt(dataReceive?.totalAmount),
                    status: parseInt(dataReceive?.status),
                    lotteryType: parseInt(dataReceive?.lotteryType),
                    reserveFee: parseInt(dataReceive?.reserveFee),
                }
                if (newData.lotteryType == 5 && dataReceive.staff_id == loginData.userData?.staff_id) {
                    if (!modalVisible && route.name == "XoSoVietLot_Keno") {
                        getData();

                        setNewTicket(newData);
                        setModalVisible(true);
                    }
                }

            });

            mqttClient.on('error', (error) => {
                console.error('MQTT Error:', error);
            });

            return () => {
                mqttClient.end();
            };
        }
    }, [isFocused])

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={style.wrapItem}
            onPress={() => navigation.navigate('XoSoVietLot_VeThuong_ChiTietVeDaXuLy', { orderId: item.orderID, lotteryType: item.lotteryType, vietlotType: 'KENO' })}
        >
            <TouchableOpacity
                style={{
                    width: '100%',
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
                onPress={() => navigation.navigate('XoSoVietLot_VeThuong_ChiTietVeDaXuLy', { orderId: item?.orderID, lotteryType: item.lotteryType, vietlotType: 'KENO' })}
            >
                <Text style={style.idTicket}>#{item?.orderID}</Text>
                <Text fontWeight="600">{ENUM_XOSO_CHILD_TYPE.find(o => o.key == item?.lotteryType)?.value}</Text>
            </TouchableOpacity>
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
        </TouchableOpacity>
    );

    return (
        <View w="100%" alignItems="center">
            {/* <Modal isOpen={showModal} size="lg" onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.Header>Loại vé</Modal.Header>
                    {data.length > 0 ? data?.map((item, index) => (
                        <TouchableOpacity
                            style={{
                                ...style.wrapSelectedItem,
                                backgroundColor:
                                    item.orderID === selectedType.id ? '#d32e31' : '#fff',
                            }}
                            key={index}
                            onPress={() => setSelectedType(item)}>
                            <Text
                                style={{
                                    color: item.orderID === selectedType.id ? '#fff' : '#000',
                                }}>
                                {item.orderID}
                            </Text>
                        </TouchableOpacity>
                    )) : <View></View>}
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="ghost"
                                colorScheme="blueGray"
                                onPress={() => {
                                    setModalVisible(false);
                                }}>
                                Đóng
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal> */}
            <Header headerTitle="VÉ KENO" backArrow screen='KENO' url='HomeScreen' />

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
                </Center>
            </View>
            <View style={style.lines}></View>
            <View style={style.container}>
                <FlatList
                    style={style.wrapFlatList}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item?.orderID.toString()}
                />
            </View>
            {/* <Modal isOpen={modalVisible} size="lg" onClose={() => setModalVisible(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.Header>Vé keno mới</Modal.Header>
                    <Modal.Body>
                        <View style={{ display: 'flex', flexDirection: 'column' }}>
                            <Text>Mã vé: </Text>
                            <Text style={{ color: 'red' }}>{newTicket?.orderID}</Text>
                        </View>
                        <View>
                            <Text>Giá tiền </Text>
                            <Text style={{ color: 'red', fontSize: 25, marginTop: 16, textAlign: 'center', lineHeight: 50 }}>{parseInt(newTicket?.totalAmount) - newTicket?.reserve_fee}đ</Text>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button
                                variant="ghost"
                                colorScheme="blueGray"
                                onPress={() => {
                                    setModalVisible(false);
                                }}
                                style={{
                                    width: '50%'
                                }}
                            >
                                Đóng
                            </Button>
                            <Button
                                // variant="ghost"
                                colorScheme="blueGray"
                                style={{
                                    width: '50%',
                                    backgroundColor: 'red'
                                }}
                                onPress={() => navigation.navigate('XoSoVietLot_VeThuong_ChiTietVeDaXuLy', { orderId: newTicket?.orderID, lotteryType: newTicket?.lotteryType })}
                            >
                                Chi tiết
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal> */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}

            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            margin: 20,
                            backgroundColor: 'white',
                            borderRadius: 20,
                            padding: 25,
                            // alignItems: 'center',
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                        }}
                    >
                        <View
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: '#555',
                                marginBottom: 10
                            }}
                        >
                            <Text style={{ fontWeight: 600, fontSize: 16, paddingBottom: 10 }}>Vé keno mới</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text>Mã vé: </Text>
                            <Text style={{ color: 'red' }}>{newTicket?.orderID}</Text>
                        </View>
                        <View style={{ marginBottom: 20 }}>
                            <Text>Giá tiền </Text>
                            <Text style={{ color: 'red', fontSize: 25, marginTop: 16, textAlign: 'center', lineHeight: 30 }}>{parseInt(newTicket?.totalAmount) - parseInt(newTicket?.reserveFee)}đ</Text>
                        </View>
                        <Button.Group space={2}>
                            <Button
                                variant="ghost"
                                colorScheme="blueGray"
                                onPress={() => {
                                    setModalVisible(false);
                                }}
                                style={{
                                    width: '50%',
                                    backgroundColor: '#f0f0f0'
                                }}
                            >
                                Đóng
                            </Button>
                            <Button
                                // variant="ghost"
                                colorScheme="blueGray"
                                style={{
                                    width: '50%',
                                    backgroundColor: 'red'
                                }}
                                onPress={() => {
                                    setModalVisible(false);
                                    navigation.navigate('XoSoVietLot_VeThuong_ChiTietVeDaXuLy', { orderId: newTicket?.orderID, lotteryType: newTicket?.lotteryType, vietlotType: 'KENO' });
                                }}
                            >
                                In vé
                            </Button>
                        </Button.Group>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DanhSachVeChoKeno;
