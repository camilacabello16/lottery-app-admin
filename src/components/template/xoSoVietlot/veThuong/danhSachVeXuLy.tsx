import { Text, Center, View, Modal, Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Header from '../../../common/header';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { ORDER_DETAIL } from '../../../../constants/api';
import { ENUM_XOSO_CHILD_TYPE } from '../../../../constants/enum';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
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
  totalInput: {
    width: 175,
    height: 37,
    borderRadius: 8,
    backgroundColor: '#efeff0',
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 17,
  },
});

const MOCK_FILTER = [
  { id: '1', name: 'Lô tô 6x36' },
  { id: '2', name: 'Lô tô 2' },
  { id: '3', name: 'Lô tô 3' },
  { id: '4', name: 'Lô tô 5' },
];
const MOCK_HISTORY = [
  {
    id: '001223344',
    kyMua: '120033222',
    quayThuong: '12/05/2023',
    type: 'LOTO3',
    date: '12/05/2023 12:00:21',
  },
  {
    id: '001229344',
    kyMua: '120033222',
    quayThuong: '12/05/2023',
    type: 'LOTO3',
    date: '12/05/2023 12:00:21',
  },
  {
    id: '001225349',
    kyMua: '120033252',
    quayThuong: '14/05/2023',
    type: 'LOTO4',
    date: '12/06/2023 15:00:21',
  },
  {
    id: '001525342',
    kyMua: '120033252',
    quayThuong: '14/05/2023',
    type: 'LOTO9',
    date: '12/06/2023 15:00:21',
  },
  {
    id: '001825342',
    kyMua: '120033252',
    quayThuong: '14/05/2023',
    type: 'LOTO3',
    date: '12/06/2023 15:00:21',
  },
  {
    id: '011225342',
    kyMua: '120333252',
    quayThuong: '15/05/2023',
    type: 'LOTO9',
    date: '12/06/2023 15:00:21',
  },
];

interface XoSoVietLot {
  orderID: number,
  buyTime: string,
  period: string,
  periodTime: string,
  paymentType: string,
  totalAmount: number,
  status: number,
  lotteryType: number
}

const DanhSachVeXuLy = () => {
  const navigation = useNavigation();
  const loginData = useSelector((state: any) => state.auth);
  const rootApi = useSelector((state: any) => state.rootApi);

  const [search, setSearch] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [selectedType, setSelectedType] = useState<any>(MOCK_FILTER[0]);
  const [total, setTotal] = useState<number>(12000);

  const [data, setData] = useState<XoSoVietLot[]>([]);

  const getData = () => {
    axios.get(rootApi.rootApi + ORDER_DETAIL + "?gameId=3&status=3", {
      headers: {
        Authorization: loginData.userData.access_token
      }
    }).then(res => {
      setData(res?.data?.data.filter((o: any) => o.lotteryType != 5));
    })
  }

  useEffect(() => {
    getData();
  }, [])

  const onChangeStartDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    // setShowDateTimePicker(false);
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    // setShowDateTimePicker(false);
    setToDate(currentDate);
  };
  const renderItem = ({ item }: any) => (
    <View style={style.wrapItem}>
      <TouchableOpacity
        style={{
          width: '100%',
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }}
        onPress={() => navigation.navigate('XoSoVietLot_VeThuong_ChiTietVeDaXuLy', { orderId: item.orderID, lotteryType: item.lotteryType })}
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
    </View>
  );

  const formatCurrency = (number: number) => {
    const formattedNumber = number
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedNumber} đ`;
  };

  return (
    <View w="100%" alignItems="center">
      <Modal isOpen={showModal} size="lg" onClose={() => setShowModal(false)}>
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
                  setShowModal(false);
                }}>
                Đóng
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Header headerTitle="VÉ THƯỜNG" subTitle="Danh sách vé đã xử lý" backArrow url='HomeScreen' />
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
            <Text>{selectedType.name}</Text>
          </TouchableOpacity>
        </Center>
        {/* <Center
          w="100%"
          mt={2}
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between">
          <Text fontSize="md">Từ ngày:</Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={startDate}
            mode={'date'}
            is24Hour={true}
            style={{ backgroundColor: 'transparent' }}
            onChange={onChangeStartDate}
          />
        </Center>
        <Center
          w="100%"
          mt={2}
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between">
          <Text fontSize="md">Đến ngày:</Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={toDate}
            mode={'date'}
            is24Hour={true}
            style={{ backgroundColor: 'transparent' }}
            onChange={onChangeEndDate}
          />
        </Center>
        <Center
          w="100%"
          mt={2}
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          flexWrap="wrap">
          <Text fontSize="md">Doanh số:</Text>
          <TextInput
            style={style.totalInput}
            onChangeText={val => setSearch(val)}
            value={formatCurrency(total)}
            editable={false}
          />
        </Center> */}
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

export default DanhSachVeXuLy;
