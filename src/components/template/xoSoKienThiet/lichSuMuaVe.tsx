import { Text, Center, View, ScrollView, Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, TextInput } from 'react-native';
import Header from '../../common/header';
import axios from 'axios';
import { ORDER_DETAIL } from '../../../constants/api';
import { ENUM_XOSO_CHILD_TYPE } from '../../../constants/enum';
import moment from 'moment';
import { useSelector } from 'react-redux';

const style = StyleSheet.create({
    container: {
        width: '85%',
        display: 'flex',
        alignItems: 'center',
        marginTop: 10,
    },
    wrapSelected: {
        width: 172,
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
        height: '80%',
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
}

const XoSoKienThietLichSuTemplate = ({ route }: any) => {
    const rootApi = useSelector((state: any) => state.rootApi);

    const [search, setSearch] = useState<string>('');
    const [data, setData] = useState<XoSoVietLot[]>([]);

    const getData = () => {
        axios.get(rootApi.rootApi + ORDER_DETAIL + "?gameId=1").then(res => {
            setData(res?.data?.data);
        })
    }

    useEffect(() => {
        getData();
        console.log(route?.params?.orderParam);

    }, [])

    const renderItem = ({ item }: any) => (
        <View style={style.wrapItem}>
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
        </View>
    );

    return (
        <View w="100%" alignItems="center">
            <Header
                headerTitle="XỔ SỐ KIẾN THIẾT"
                subTitle="Lịch sử mua vé"
                backArrow
                url="XoSoKienThiet"
                param={route?.params?.orderParam}
            />
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
                    {/* <SelectDropdown
                        data={MOCK_FILTER}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                        }}
                        defaultValue={MOCK_FILTER[0]}
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
                    /> */}
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
            {/* <View>
                <Button>Tạo vé</Button>
            </View> */}
        </View>
    );
};

export default XoSoKienThietLichSuTemplate;
