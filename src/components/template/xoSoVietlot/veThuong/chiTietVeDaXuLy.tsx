import { Text, View, Button, Modal } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Ball from '../../../common/ball';
import Header from '../../../common/header';
import axios from 'axios';
import { ORDER_COMPLETE, ORDER_DETAIL } from '../../../../constants/api';
import moment from 'moment';
import { ENUM_KENO_ODD, ENUM_XOSO_CHILD_TYPE } from '../../../../constants/enum';
import { useNavigation } from '@react-navigation/native';
import useBLE from '../../../../hooks/useBLE';
import { useDispatch, useSelector } from 'react-redux';
import { convertToStringMarco } from '../../../../utils/convertToStringMarco';
import { KENO_ODD_ID, MARCO_BAO_TYPE } from '../../../../constants/marcoSymbol';
import { alert } from '@baronha/ting';
import { incrementByAmount } from '../../../../redux/amountStore';

const style = StyleSheet.create({
    capturedImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        borderWidth: 1,
        borderRadius: 8,
    },
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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

const ChiTietVeDaXuLy: React.FC = ({ route }: any) => {
    const dispatch = useDispatch();
    const loginData = useSelector((state: any) => state.auth);
    const rootApi = useSelector((state: any) => state.rootApi);

    const { writeMessageToCharacteristic } = useBLE();
    const bleData = useSelector((state: any) => state.bluetooth);
    const navigation = useNavigation();
    const [isPrint, setIsPrint] = useState<boolean>(false);
    const [isTakePicture, setIsTakePicture] = useState<boolean>(false);
    const [listImage, setListImage] = useState<any[]>([]);

    const [orderDetail, setOrderDetail] = useState<ticketDetail>();

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

                if (route?.params?.vietlotType && route?.params?.vietlotType == "KENO") {
                    sendPrintDataKeno(res.data.data[0]);
                }
            })
        }
    }

    const formatCurrency = (amount) => {
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        });

        return formatter.format(amount);
    };

    useEffect(() => {
        getDetail();
        if (route?.params?.imageBinary) {
            setIsTakePicture(true);
            setListImage(route?.params?.imageSrc);
        }

    }, [route?.params])

    const sendPrintData = () => {
        var convertString = convertToStringMarco(orderDetail);
        console.log(convertString);
        writeMessageToCharacteristic(bleData.devices[0], convertString[0]);
        var beginChar = 1;
        var addedTime = 1000;
        if (KENO_ODD_ID.includes(order.subType)) { // keno dac biet
            var numberTicket = order.lotteries.length;

            var indices = [];
            for (var i = 0; i < convertString.length; i++) {
                if (convertString[i] === "f") indices.push(i);
            }

            if (numberTicket == 1) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar + 1, convertString?.length - 2));
                }, 2000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 2]);
                }, 3000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 1]);
                }, 4000);
            }
            else if (numberTicket == 2) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar + 1, indices[1]));
                }, 2000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 3000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[1] + 1, convertString?.length - 2));
                }, 4000);
                // print 2 last character
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 2]);
                }, 5000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 1]);
                }, 6000);
            }
            else if (numberTicket == 3) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar + 1, indices[1]));
                }, 2000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 3000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[1] + 1, indices[2]));
                }, 4000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 5000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[2] + 1, convertString?.length - 2));
                }, 6000);
                // print 2 last character
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 2]);
                }, 7000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 1]);
                }, 8000);
            }
            else if (numberTicket == 4) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar + 1, indices[1]));
                }, 2000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 3000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[1] + 1, indices[2]));
                }, 4000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 5000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[2] + 1, indices[3]));
                }, 6000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 7000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[3] + 1, convertString?.length - 2));
                }, 8000);
                // print 2 last character
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 2]);
                }, 9000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 1]);
                }, 10000);
            }
            else if (numberTicket == 5) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar + 1, indices[1]));
                }, 2000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 3000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[1] + 1, indices[2]));
                }, 4000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 5000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[2] + 1, indices[3]));
                }, 6000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 7000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[3] + 1, indices[4]));
                }, 8000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 9000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[4] + 1, convertString?.length - 2));
                }, 10000);
                // print 2 last character
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 2]);
                }, 11000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 1]);
                }, 12000);
            }
            else if (numberTicket == 6) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar + 1, indices[1]));
                }, 2000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 3000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[1] + 1, indices[2]));
                }, 4000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 5000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[2] + 1, indices[3]));
                }, 6000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 7000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[3] + 1, indices[4]));
                }, 8000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 9000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[4] + 1, indices[5]));
                }, 10000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 11000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[5] + 1, convertString.length - 2));
                }, 12000);
                // print 2 last character
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 2]);
                }, 13000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 1]);
                }, 14000);
            }

            setIsPrint(true);
        }
        else {
            if (MARCO_BAO_TYPE.find(o => o.key == orderDetail.subType)) {
                beginChar = 3;
                addedTime = 3000;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[1]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[2]);
                }, 2000);
            } else {
                beginChar = 1;
                addedTime = 1000;
            }

            var length = convertString.length - 1;
            var numberTime = 0;

            if (length < 20) {
                numberTime = 0;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, length));
                }, addedTime);
            }
            else if (length >= 20 && length < 40) {

                numberTime = 1;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, length));
                }, addedTime);
            }
            else if (length >= 40 && length < 60) {
                numberTime = 2;

                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, length));
                }, addedTime);
            }
            else if (length >= 60 && length < 80) {
                numberTime = 2;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, length));
                }, addedTime);
            }
            else if (length >= 80 && length < 100) {
                numberTime = 3;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, length));
                }, addedTime);
            }
            else if (length >= 100 && length < 120) {
                numberTime = 3;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, 100));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(100, length));
                }, addedTime);
            }
            else if (length >= 120 && length < 140) {
                numberTime = 4;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, 100));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(100, 120));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(120, length));
                }, addedTime);
            }
            else if (length >= 140 && length < 160) {
                numberTime = 4;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, 100));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(100, 120));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(120, 140));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(140, length));
                }, addedTime);
            }
            else if (length >= 160 && length < 180) {
                numberTime = 5;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, 100));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(100, 120));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(120, 140));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(140, 160));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(160, length));
                }, addedTime);
            }
            else if (length >= 180 && length < 200) {
                numberTime = 5;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, 100));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(100, 120));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(120, 140));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(140, 160));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(160, 180));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(180, length));
                }, addedTime);
            }
            else if (length >= 200) {
                numberTime = 6;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, 100));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(100, 120));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(120, 140));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(140, 160));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(160, 180));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(180, 200));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(200, length));
                }, addedTime);
            }

            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(convertString.length - 1));
            }, addedTime + (1000));

            if (MARCO_BAO_TYPE.find(o => o.key == orderDetail.subType) || (orderDetail?.lotteryType == 5 && orderDetail.totalAmount >= 100000)) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], "1");
                }, (orderDetail?.lotteries.length == 1 ? (2000 + (addedTime)) : ((addedTime) * orderDetail?.lotteries.length)));
            }
            // writeMessageToCharacteristic(bleData.devices[0], element)

            setIsPrint(true);
        }


    };

    const sendPrintDataKeno = (order) => {
        var convertString = convertToStringMarco(order);
        console.log(convertString);
        writeMessageToCharacteristic(bleData.devices[0], convertString[0]);
        var beginChar = 1;
        var addedTime = 1000;
        if (KENO_ODD_ID.includes(order.subType)) { // keno dac biet
            var numberTicket = order.lotteries.length;

            var indices = [];
            for (var i = 0; i < convertString.length; i++) {
                if (convertString[i] === "f") indices.push(i);
            }

            if (numberTicket == 1) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar + 1, convertString?.length - 2));
                }, 2000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 2]);
                }, 3000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 1]);
                }, 4000);
            }
            else if (numberTicket == 2) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar + 1, indices[1]));
                }, 2000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 3000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[1] + 1, convertString?.length - 2));
                }, 4000);
                // print 2 last character
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 2]);
                }, 5000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 1]);
                }, 6000);
            }
            else if (numberTicket == 3) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar + 1, indices[1]));
                }, 2000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 3000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[1] + 1, indices[2]));
                }, 4000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 5000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[2] + 1, convertString?.length - 2));
                }, 6000);
                // print 2 last character
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 2]);
                }, 7000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 1]);
                }, 8000);
            }
            else if (numberTicket == 4) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar + 1, indices[1]));
                }, 2000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 3000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[1] + 1, indices[2]));
                }, 4000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 5000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[2] + 1, indices[3]));
                }, 6000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 7000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[3] + 1, convertString?.length - 2));
                }, 8000);
                // print 2 last character
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 2]);
                }, 9000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 1]);
                }, 10000);
            }
            else if (numberTicket == 5) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar + 1, indices[1]));
                }, 2000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 3000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[1] + 1, indices[2]));
                }, 4000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 5000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[2] + 1, indices[3]));
                }, 6000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 7000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[3] + 1, indices[4]));
                }, 8000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 9000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[4] + 1, convertString?.length - 2));
                }, 10000);
                // print 2 last character
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 2]);
                }, 11000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 1]);
                }, 12000);
            }
            else if (numberTicket == 6) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar + 1, indices[1]));
                }, 2000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 3000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[1] + 1, indices[2]));
                }, 4000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 5000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[2] + 1, indices[3]));
                }, 6000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 7000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[3] + 1, indices[4]));
                }, 8000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 9000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[4] + 1, indices[5]));
                }, 10000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[beginChar]);
                }, 11000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(indices[5] + 1, convertString.length - 2));
                }, 12000);
                // print 2 last character
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 2]);
                }, 13000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[convertString?.length - 1]);
                }, 14000);
            }
            setIsPrint(true);
        }
        else {// keno thuong
            if (MARCO_BAO_TYPE.find(o => o.key == order.subType)) {
                beginChar = 3;
                addedTime = 3000;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[1]);
                }, 1000);
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString[2]);
                }, 2000);
            } else {
                beginChar = 1;
                addedTime = 1000;
            }

            var length = convertString.length - 1;
            var numberTime = 0;

            if (length < 20) {
                numberTime = 0;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, length));
                }, addedTime);
            }
            else if (length >= 20 && length < 40) {

                numberTime = 1;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, length));
                }, addedTime);
            }
            else if (length >= 40 && length < 60) {
                numberTime = 2;

                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, length));
                }, addedTime);
            }
            else if (length >= 60 && length < 80) {
                numberTime = 2;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, length));
                }, addedTime);
            }
            else if (length >= 80 && length < 100) {
                numberTime = 3;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, length));
                }, addedTime);
            }
            else if (length >= 100 && length < 120) {
                numberTime = 3;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, 100));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(100, length));
                }, addedTime);
            }
            else if (length >= 120 && length < 140) {
                numberTime = 4;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, 100));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(100, 120));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(120, length));
                }, addedTime);
            }
            else if (length >= 140 && length < 160) {
                numberTime = 4;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, 100));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(100, 120));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(120, 140));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(140, length));
                }, addedTime);
            }
            else if (length >= 160 && length < 180) {
                numberTime = 5;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, 100));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(100, 120));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(120, 140));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(140, 160));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(160, length));
                }, addedTime);
            }
            else if (length >= 180 && length < 200) {
                numberTime = 5;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, 100));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(100, 120));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(120, 140));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(140, 160));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(160, 180));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(180, length));
                }, addedTime);
            }
            else if (length >= 200) {
                numberTime = 6;
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(beginChar, 20));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(20, 40));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(40, 60));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(60, 80));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(80, 100));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(100, 120));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(120, 140));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(140, 160));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(160, 180));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(180, 200));
                    writeMessageToCharacteristic(bleData.devices[0], convertString.substring(200, length));
                }, addedTime);
            }

            setTimeout(() => {
                writeMessageToCharacteristic(bleData.devices[0], convertString.substring(convertString.length - 1));
            }, addedTime + (1000));

            if (MARCO_BAO_TYPE.find(o => o.key == order.subType) || (order?.lotteryType == 5 && order.totalAmount >= 100000)) {
                setTimeout(() => {
                    writeMessageToCharacteristic(bleData.devices[0], "1");
                }, (order?.lotteries.length == 1 ? (2000 + (addedTime)) : ((addedTime) * order?.lotteries.length)));
            }
            // writeMessageToCharacteristic(bleData.devices[0], element)

            setIsPrint(true);
        }
    };

    const completeOrder = () => {
        axios.post(rootApi.rootApi + ORDER_COMPLETE, {
            orderId: orderDetail?.orderID,
            // img: route?.params?.imageBinary
            img: route?.params?.imageBinary
        }, {
            headers: {
                Authorization: loginData.userData?.access_token
            }
        }).then((response) => {

            //increase amount
            var increaseState = {
                value: orderDetail?.totalAmount - orderDetail?.reserveFee,
                numberTicket: 1,
                type: orderDetail?.lotteryType == 5 ? 'KENO' : 'VIETLOT_VETHUONG'
            }
            dispatch(incrementByAmount(increaseState));

            alert({
                title: 'Giao dịch thành công',
                message: '',
                preset: 'done'
            });
            if (orderDetail?.lotteryType == 5) {
                navigation.navigate('XoSoVietLot_Keno')
            } else {
                navigation.navigate('XoSoVietLot_VeThuong')
            }
        })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <View w="100%" alignItems="center" style={style.container}>
            <Header headerTitle="CHI TIẾT ĐƠN HÀNG" backArrow />
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
                    {/* <View style={style.wrapRightHeaderContent}>
            <Button w="100%" style={style.btnReject}>
              <Text style={{color: '#fff'}}>Gọi điện</Text>
            </Button>
          </View> */}
                </View>

                <ScrollView style={style.wrapScrollView}>
                    <View style={style.wrapDetailOrder}>
                        <Text fontSize="sm">Loại hình: {ENUM_XOSO_CHILD_TYPE.find(o => o.key == route?.params?.lotteryType)?.value}</Text>
                        {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
                        {orderDetail?.lotteries ? orderDetail?.lotteries.map((item: any, index: number) => {
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
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                        {item?.code.map((itemCode: number, indexCode: number) => {
                                            return (
                                                <View ml="2" mr="2" key={indexCode}>
                                                    <Ball
                                                        size={itemCode.length > 2 ? 70 : 35}
                                                        number={KENO_ODD_ID.includes(orderDetail.subType) ? ENUM_KENO_ODD.find((x: any) => x.key == itemCode)?.value : itemCode}
                                                    />
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            );
                        }) : <View></View>}
                        {/* </ScrollView> */}

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
                                {formatCurrency(orderDetail?.totalAmount - orderDetail?.reserveFee)}
                            </Text>
                        </View>
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
                                        navigation.navigate('Camera', { url: 'XoSoVietLot_VeThuong_ChiTietVeDaXuLy', imageUri: listImage, imageBinary: route?.params?.imageBinary })
                                    }}
                                    disabled={!isPrint}
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


                            {/* <Image source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png" }} style={style.capturedImage} /> */}
                        </View>
                    </View>
                </ScrollView>

                {(orderDetail?.status != 3 && (!route?.params?.vietlotType || route?.params?.vietlotType != "KENO")) &&
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
                        <Button w="48%" style={style.btnConfirm} colorScheme="success"
                            onPress={() => navigation.navigate('XoSoVietLot_VeThuong')}
                        >
                            <Text style={{ color: '#fff' }}>Huỷ</Text>
                        </Button>
                        <Button w="48%"
                            style={isPrint && isTakePicture ? style.btnReject : style.btnDisable}
                            onPress={completeOrder}
                            disabled={isPrint && isTakePicture ? false : true}
                        >
                            <Text style={{ color: '#fff' }}>Hoàn thành giao dịch</Text>
                        </Button>
                    </View>
                }
            </ScrollView>
        </View>
    );
};

export default ChiTietVeDaXuLy;
