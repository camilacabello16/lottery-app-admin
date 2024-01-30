import {Text, Center, View, Modal, Button} from 'native-base';
import React, {useState} from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Header from '../../common/header';
import SelectDropdown from 'react-native-select-dropdown';

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
    height: '82%',
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
  {id: '1', name: 'Lô tô 6x36'},
  {id: '2', name: 'Lô tô 2'},
  {id: '3', name: 'Lô tô 3'},
  {id: '4', name: 'Lô tô 5'},
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

const LichSuMuaVeScreen = () => {
  const [search, setSearch] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<any>(MOCK_FILTER[0]);

  const renderItem = ({item}: any) => (
    <View style={style.wrapItem}>
      <View
        w="100%"
        display="flex"
        flexDirection="row"
        justifyContent="space-between">
        <Text style={style.idTicket}>#{item?.id}</Text>
        <Text fontWeight="600">{item?.type}</Text>
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
        <Text fontSize="md">{item?.kyMua}</Text>
      </View>
      <View
        w="100%"
        display="flex"
        flexDirection="row"
        justifyContent="space-between">
        <Text fontSize="md" fontWeight="600">
          Quay thưởng:{' '}
        </Text>
        <Text fontSize="md">{item?.quayThuong}</Text>
      </View>
      <View
        w="100%"
        display="flex"
        flexDirection="row"
        justifyContent="space-between">
        <Text fontSize="md" fontWeight="600">
          Thời gian:{' '}
        </Text>
        <Text fontSize="md">{item?.date}</Text>
      </View>
    </View>
  );

  return (
    <View w="100%" alignItems="center">
      <Modal isOpen={showModal} size="lg" onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.Header>Loại vé</Modal.Header>
          {MOCK_FILTER.map((item, index) => (
            <TouchableOpacity
              style={{
                ...style.wrapSelectedItem,
                backgroundColor:
                  item.id === selectedType.id ? '#d32e31' : '#fff',
              }}
              onPress={() => setSelectedType(item)}>
              <Text
                style={{
                  color: item.id === selectedType.id ? '#fff' : '#000',
                }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
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
      <Header headerTitle="XỔ SỐ ĐIỆN TOÁN" subTitle="Lịch sử mua vé" />
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
      </View>
      <View style={style.lines}></View>
      <View style={style.container}>
        <FlatList
          style={style.wrapFlatList}
          data={MOCK_HISTORY}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    </View>
  );
};

export default LichSuMuaVeScreen;
