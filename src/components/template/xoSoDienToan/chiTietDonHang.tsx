import { Text, View, Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Ball from '../../common/ball';
import Header from '../../common/header';
import axios from 'axios';
import { ORDER_COMPLETE, ORDER_DETAIL } from '../../../constants/api';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { alert } from '@baronha/ting';
import { useDispatch, useSelector } from 'react-redux';
import { incrementByAmount } from '../../../redux/amountStore';
import { ENUM_XOSO_CHILD_TYPE } from '../../../constants/enum';
import { convertToXSDTMacro } from '../../../utils/convertToStringMarco';
import useBLE from '../../../hooks/useBLE';

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
    takePhotoBtnDisable: {
        width: 100,
        height: 100,
        borderWidth: 1,
        borderStyle: 'dashed',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        borderColor: 'gray',
        color: 'gray',
        marginVertical: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textPhotoBtn: {
        color: 'gray',
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
    btnDisable: {
        backgroundColor: '#8a8686',
        borderRadius: 8,
    },
});

interface ticketDetail {
    orderID: number,
    buyTime: string,
    period: number,
    periodTime: string,
    lotteryType: number,
    subType: number,
    paymentType: number,
    ticketPrice: number,
    reserveFee: number,
    totalAmount: number,
    status: number,
    lotteries: Array<lotteriesDetail>,
    userId: number,
    fullName: string,
    cccd: number,
    phone: number,
    email: string
}

interface lotteriesDetail {
    code: Array<number>,
    qty: number,
    price: number
}

const ChiTietDonHangTemplate: React.FC = ({ route }: any) => {
    const bleData = useSelector((state: any) => state.bluetooth);
    const loginData = useSelector((state: any) => state.auth);
    const rootApi = useSelector((state: any) => state.rootApi);
    const { writeMessageToCharacteristic } = useBLE();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [orderDetail, setOrderDetail] = useState<ticketDetail>();
    const [isTakePicture, setIsTakePicture] = useState<boolean>(false);
    const [listImage, setListImage] = useState<any[]>([]);
    const [isPrint, setIsPrint] = useState<boolean>(false);
    const [testStr, setTestStr] = useState<string>('');

    const getDetail = () => {
        if (route?.params?.orderId) {
            axios.get(rootApi.rootApi + ORDER_DETAIL + "?orderId=" + route?.params?.orderId, {
                headers: {
                    Authorization: loginData.userData.access_token
                }
            }).then(res => {
                setOrderDetail(res.data.data[0]);
                if (res.data.data[0].status == 3) {
                    var imgRes = [];
                    res.data.data[0].img.forEach(element => {
                        var url = element;
                        var imgObj = {
                            uri: url
                        };
                        imgRes.push(imgObj);
                    });
                    setListImage(imgRes);
                }
            })
        }
    }

    useEffect(() => {
        getDetail();
        console.log("param", route?.params?.imageBinary);
        if (route?.params?.imageBinary) {
            setIsTakePicture(true);
            setListImage(route?.params?.imageSrc);
        }

    }, [route?.params])

    const sendPrintData = () => {
        var convertString = convertToXSDTMacro(orderDetail);
        var addedTime = 500;
        var length = convertString.length;
        var numberPrint = length / 6;
        console.log(numberPrint);

        // chọn loại xổ số
        writeMessageToCharacteristic(bleData.devices[0], convertString.substring(0, 6));
        //chọn tiền + kỳ + chuỗi số
        setTimeout(() => {
            writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6, 6 * 2));
        }, addedTime);
        setTimeout(() => {
            writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 2, 6 * 3));
        }, addedTime * 3);
        //bấm tự chọn 
        setTimeout(() => {
            writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 3, 6 * 4));
        }, addedTime * 4);
        setTimeout(() => {
            writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 4, 6 * 5));
        }, addedTime * 5);
        //chọn số và bấm hoàn thành
        if (numberPrint >= 6) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 5, 6 * 6));
            }, addedTime * 6);
        }
        if (numberPrint >= 7) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 6, 6 * 7));
            }, addedTime * 7);
        }
        if (numberPrint >= 8) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 7, 6 * 8));
            }, addedTime * 8);
        }
        if (numberPrint >= 9) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 8, 6 * 9));
            }, addedTime * 9);
        }
        if (numberPrint >= 10) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 9, 6 * 10));
            }, addedTime * 10);
        }
        if (numberPrint >= 11) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 10, 6 * 11));
            }, addedTime * 11);
        }
        if (numberPrint >= 12) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 11, 6 * 12));
            }, addedTime * 12);
        }
        if (numberPrint >= 13) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 12, 6 * 13));
            }, addedTime * 13);
        }
        if (numberPrint >= 14) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 13, 6 * 14));
            }, addedTime * 14);
        }
        if (numberPrint >= 15) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 14, 6 * 15));
            }, addedTime * 15);
        }
        if (numberPrint >= 16) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 15, 6 * 16));
            }, addedTime * 16);
        }
        if (numberPrint >= 17) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 16, 6 * 17));
            }, addedTime * 17);
        }
        if (numberPrint >= 18) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 17, 6 * 18));
            }, addedTime * 18);
        }
        if (numberPrint >= 19) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 18, 6 * 19));
            }, addedTime * 19);
        }
        if (numberPrint >= 20) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 19, 6 * 20));
            }, addedTime * 20);
        }
        if (numberPrint >= 21) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 20, 6 * 21));
            }, addedTime * 21);
        }
        if (numberPrint >= 22) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 21, 6 * 22));
            }, addedTime * 22);
        }
        if (numberPrint >= 23) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 22, 6 * 23));
            }, addedTime * 23);
        }
        if (numberPrint >= 24) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 23, 6 * 24));
            }, addedTime * 24);
        }
        if (numberPrint >= 25) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 24, 6 * 25));
            }, addedTime * 25);
        }
        if (numberPrint >= 26) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 25, 6 * 26));
            }, addedTime * 26);
        }
        if (numberPrint >= 27) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 26, 6 * 27));
            }, addedTime * 27);
        }
        if (numberPrint >= 28) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 27, 6 * 28));
            }, addedTime * 28);
        }
        if (numberPrint >= 29) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 28, 6 * 29));
            }, addedTime * 29);
        }
        if (numberPrint >= 30) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 29, 6 * 30));
            }, addedTime * 30);
        }
        if (numberPrint >= 31) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 30, 6 * 31));
            }, addedTime * 31);
        }
        if (numberPrint >= 32) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 31, 6 * 32));
            }, addedTime * 32);
        }
        if (numberPrint >= 33) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 32, 6 * 33));
            }, addedTime * 33);
        }
        if (numberPrint >= 34) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 33, 6 * 34));
            }, addedTime * 34);
        }
        if (numberPrint >= 35) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 34, 6 * 35));
            }, addedTime * 35);
        }
        if (numberPrint >= 36) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 35, 6 * 36));
            }, addedTime * 36);
        }
        if (numberPrint >= 37) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 36, 6 * 37));
            }, addedTime * 37);
        }
        if (numberPrint >= 38) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 37, 6 * 38));
            }, addedTime * 38);
        }
        if (numberPrint >= 39) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 38, 6 * 39));
            }, addedTime * 39);
        }
        if (numberPrint >= 40) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 39, 6 * 40));
            }, addedTime * 40);
        }
        if (numberPrint >= 41) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 40, 6 * 41));
            }, addedTime * 41);
        }
        if (numberPrint >= 42) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 41, 6 * 42));
            }, addedTime * 42);
        }
        if (numberPrint >= 43) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 42, 6 * 43));
            }, addedTime * 43);
        }
        if (numberPrint >= 44) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 43, 6 * 44));
            }, addedTime * 44);
        }
        if (numberPrint >= 45) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 44, 6 * 45));
            }, addedTime * 45);
        }
        if (numberPrint >= 46) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 45, 6 * 46));
            }, addedTime * 46);
        }
        if (numberPrint >= 47) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 46, 6 * 47));
            }, addedTime * 47);
        }
        if (numberPrint >= 48) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 47, 6 * 48));
            }, addedTime * 48);
        }
        if (numberPrint >= 49) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 48, 6 * 49));
            }, addedTime * 49);
        }
        if (numberPrint >= 50) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 49, 6 * 50));
            }, addedTime * 50);
        }
        if (numberPrint >= 51) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 50, 6 * 51));
            }, addedTime * 51);
        }
        if (numberPrint >= 52) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 51, 6 * 52));
            }, addedTime * 52);
        }
        if (numberPrint >= 53) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 52, 6 * 53));
            }, addedTime * 53);
        }
        if (numberPrint >= 54) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 53, 6 * 54));
            }, addedTime * 54);
        }
        if (numberPrint >= 55) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 54, 6 * 55));
            }, addedTime * 55);
        }
        if (numberPrint >= 56) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 55, 6 * 56));
            }, addedTime * 56);
        }
        if (numberPrint >= 57) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 56, 6 * 57));
            }, addedTime * 57);
        }
        if (numberPrint >= 58) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 57, 6 * 58));
            }, addedTime * 58);
        }
        if (numberPrint >= 59) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 58, 6 * 59));
            }, addedTime * 59);
        }
        if (numberPrint >= 60) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 59, 6 * 60));
            }, addedTime * 60);
        }
        if (numberPrint >= 61) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 60, 6 * 61));
            }, addedTime * 61);
        }
        if (numberPrint >= 62) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 61, 6 * 62));
            }, addedTime * 62);
        }
        if (numberPrint >= 63) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 62, 6 * 63));
            }, addedTime * 63);
        }
        if (numberPrint >= 64) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 63, 6 * 64));
            }, addedTime * 64);
        }
        if (numberPrint >= 65) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 64, 6 * 65));
            }, addedTime * 65);
        }
        if (numberPrint >= 66) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 65, 6 * 66));
            }, addedTime * 66);
        }
        if (numberPrint >= 67) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 66, 6 * 67));
            }, addedTime * 67);
        }
        if (numberPrint >= 68) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 67, 6 * 68));
            }, addedTime * 68);
        }
        if (numberPrint >= 69) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 68, 6 * 69));
            }, addedTime * 69);
        }
        if (numberPrint >= 70) {
            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(6 * 69, 6 * 70));
            }, addedTime * 70);
        }
        setIsPrint(true);

        // //hoàn tất
        // setTimeout(() => {
        //     writeMessageToCharacteristic(bleData.devices[0], convertString.substring(length - 18, length - 12));
        // }, addedTime * 4);
        // //bấm gửi đi
        // setTimeout(() => {
        //     writeMessageToCharacteristic(bleData.devices[0], convertString.substring(length - 12, length - 6));
        // }, addedTime * 5);


        // setTimeout(() => {
        //     writeMessageToCharacteristic(bleData.devices[0], convertString.substring(length - 6, length));
        // }, addedTime * 5);
    }

    const completeOrder = () => {
        axios.post(rootApi.rootApi + ORDER_COMPLETE, {
            orderId: orderDetail?.orderID,
            img: route?.params?.imageBinary
        }, {
            headers: {
                Authorization: loginData.userData?.access_token
            }
        })
            // .then((response) => response.json())
            //     .then((responseJson) => {
            //         console.log("data : ", responseJson)
            //         //   return responseJson;
            //     }).catch(err => {
            //         console.log(err)
            //     })
            .then((response) => {
                //increase amount
                var increaseState = {
                    value: orderDetail?.totalAmount - orderDetail?.reserveFee,
                    numberTicket: 1,
                    type: 'DIENTOAN'
                }
                console.log("AMOUNT", increaseState);

                dispatch(incrementByAmount(increaseState));

                alert({
                    title: 'Giao dịch thành công',
                    message: '',
                    preset: 'done'
                });
                navigation.navigate('XoSoDienToan')
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <View w="100%" alignItems="center" style={style.container}>
            <Header headerTitle="XỔ SỐ ĐIỆN TOÁN" subTitle="Chi tiết đơn hàng" backArrow />
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
                                <Text fontSize="sm">#{orderDetail?.orderID}</Text>
                            </View>
                        </View>
                        <View w="100%" mb="2" display="flex" flexDirection="row">
                            <View w="40%" textAlign="left">
                                <Text fontSize="sm" fontWeight="bold">
                                    Họ tên:
                                </Text>
                            </View>
                            <View w="50%" textAlign="left">
                                <Text fontSize="sm">{orderDetail?.fullName}</Text>
                            </View>
                        </View>
                        <View w="100%" mb="2" display="flex" flexDirection="row">
                            <View w="40%" textAlign="left">
                                <Text fontSize="sm" fontWeight="bold">
                                    CCCD/CMND:
                                </Text>
                            </View>
                            <View w="50%" textAlign="left">
                                <Text fontSize="sm">{orderDetail?.cccd}</Text>
                            </View>
                        </View>
                        <View w="100%" mb="2" display="flex" flexDirection="row">
                            <View w="40%" textAlign="left">
                                <Text fontSize="sm" fontWeight="bold">
                                    Thời gian đặt:
                                </Text>
                            </View>
                            <View w="50%" textAlign="left">
                                <Text fontSize="sm">{moment(orderDetail?.buyTime).format("DD/MM/YYYY HH:mm:ss")}</Text>
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
                        <Text fontSize="sm">Loại hình: {ENUM_XOSO_CHILD_TYPE.find(o => o.key == orderDetail?.lotteryType)?.value}</Text>
                        {orderDetail?.lotteries.map((item: any, index: number) => {
                            var chr = String.fromCharCode(65 + index);
                            return (
                                <View
                                    w="100%"
                                    display="flex"
                                    flexDirection="row"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    mt="3"
                                    key={index}
                                >
                                    <View ml="2" mr="2">
                                        <Text>{chr}</Text>
                                    </View>
                                    {
                                        [15, 16, 17, 18].includes(orderDetail?.lotteryType) ?
                                            item?.code.map((itemCode: number, indexCode: number) => {
                                                var number = itemCode.toString().split('');
                                                return (
                                                    <View
                                                        display="flex"
                                                        flexDirection="row"
                                                    >
                                                        <View
                                                            display="flex"
                                                            flexDirection="row"
                                                        >
                                                            {
                                                                number.map((digit, indexDigit) => {
                                                                    return (
                                                                        <View key={index}>
                                                                            <Ball number={digit} />
                                                                        </View>
                                                                    );
                                                                })
                                                            }
                                                        </View>
                                                        {indexCode != item?.code.length - 1 &&
                                                            <View
                                                                style={{
                                                                    width: 1,
                                                                    height: 30,
                                                                    backgroundColor: '#6c757d',
                                                                    marginHorizontal: 5,
                                                                }}
                                                            />
                                                        }
                                                    </View>
                                                );

                                            })
                                            : item?.code.map((itemCode: number, indexCode: number) => {
                                                return (
                                                    <View ml="2" mr="2" key={indexCode}>
                                                        <Ball number={itemCode} />
                                                    </View>
                                                );
                                            })
                                    }
                                </View>
                            );
                        })}
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
                            <Text>#{orderDetail?.orderID}</Text>
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
                            <Text>{moment(orderDetail?.periodTime).format("DD/MM/YYYY HH:mm:ss")}</Text>
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
                                {orderDetail?.totalAmount - orderDetail?.reserveFee}đ
                            </Text>
                        </View>
                        <View w="100%" mt="4" mb="4" style={style.lines}></View>
                        <View
                            w="100%"
                            display="flex"
                            flexDirection="row"
                            justifyContent="flex-start"
                            alignItems="center"
                        >
                            {orderDetail?.status != 3 &&
                                <TouchableOpacity
                                    style={isPrint ? style.takePhotoBtn : style.takePhotoBtnDisable}
                                    onPress={() => {
                                        navigation.navigate('Camera', { url: 'XoSoDienToan_ChiTiet', imageUri: listImage, imageBinary: route?.params?.imageBinary })
                                    }}
                                // disabled={!isPrint}
                                >
                                    <Text style={style.textPhotoBtn}>{listImage.length == 0 ? 'Chụp ảnh' : 'Chụp thêm'}</Text>
                                </TouchableOpacity>
                            }
                            <ScrollView horizontal>
                                {listImage ? listImage.map((item: any, index: any) => {
                                    return (
                                        <View style={style.takePhotoBtn} key={index}>
                                            {orderDetail?.status != 3 &&
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
                                            }
                                            <Image source={{ uri: item.uri }} style={style.capturedImage} />
                                        </View>
                                    );
                                }) : null}
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
                {orderDetail?.status != 3 &&
                    <View
                        w="100%"
                        mt="3"
                        mb="5"
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center">
                        <Button
                            w="100%"
                            style={!isPrint ? style.btnReject : style.btnDisable}
                            onPress={sendPrintData}
                            disabled={isPrint}
                        >
                            <Text style={{ color: '#fff' }}>In vé</Text>
                        </Button>
                    </View>
                }
                {orderDetail?.status != 3 &&
                    <View
                        w="100%"
                        mt="3"
                        mb="5"
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center">
                        <Button w="48%" style={style.btnConfirm} colorScheme="success" onPress={() => navigation.navigate('XoSoDienToan')}>
                            <Text style={{ color: '#fff' }}>Huỷ</Text>
                        </Button>
                        <Button
                            w="48%"
                            disabled={isPrint && isTakePicture ? false : true}
                            style={isPrint && isTakePicture ? style.btnReject : style.btnDisable}
                            onPress={completeOrder}
                        >
                            <Text style={{ color: '#fff' }}>Hoàn thành giao dịch</Text>
                        </Button>
                    </View>
                }
            </ScrollView>
        </View >
    );
};

export default ChiTietDonHangTemplate;
