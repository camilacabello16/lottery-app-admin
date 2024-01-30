import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Platform,
    StatusBar,
    ScrollView,
    StyleSheet,
    Dimensions,
    SafeAreaView,
    NativeModules,
    TouchableOpacity,
    NativeEventEmitter,
    PermissionsAndroid,
    TextInput
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import useBLE from '../../hooks/useBLE';
import { Device } from 'react-native-ble-plx';
import { convertToStringMarco } from '../../utils/convertToStringMarco';
import { useDispatch } from 'react-redux';
import { addDevice } from '../../redux/bluetoothStore';
import { alert } from '@baronha/ting';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/header';

const Bluetooth = ({ route }: any) => {
    const navigation = useNavigation();
    const [messageArr, setMessageArr] = useState<string[]>([]);
    const dispatch = useDispatch();

    const backgroundStyle = {
        backgroundColor: Colors.lighter,
    };

    // useEffect(() => {
    //     console.log(route.params);
    //     var msg = convertToStringMarco(route.params.ticketDetail);
    //     setMessageArr(msg);
    // }, [])

    const { requestPermission,
        scanDevice,
        stopScan,
        connectToDevice,
        writeMessageToCharacteristic,
        connectedDevice,
        allDevices
    } = useBLE();

    const scan = async () => {
        requestPermission(
            (isGranted: boolean) => {
                if (isGranted) {
                    scanDevice();
                }
            }
        )
    }

    const sendMessage = (device: Device) => {
        messageArr.forEach(msg => {
            writeMessageToCharacteristic(device, msg)
        });
    }

    const connectDevice = (device: Device) => {
        connectToDevice(device);
        stopScan();
        dispatch(addDevice(device));
        alert({
            title: "Kết nối thành công",
            message: '',
            preset: 'done'
        });
        navigation.navigate(route?.params?.url);
    }

    return (
        <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
            <Header headerTitle="KẾT NỐI BLUETOOTH" backArrow url='HomeScreen' />
            <StatusBar
                barStyle={'light-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                style={backgroundStyle}
                contentContainerStyle={styles.mainBody}
                contentInsetAdjustmentBehavior="automatic">
                <View
                    style={{
                        backgroundColor: Colors.lighter,
                        marginBottom: 40,
                    }}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.buttonStyle}
                        onPress={scan}
                    >
                        <Text style={styles.buttonTextStyle}>
                            Quét
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.buttonStyle}
                        onPress={stopScan}
                    >
                        <Text style={styles.buttonTextStyle}>
                            Dừng
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* list of scanned bluetooth devices */}
                {allDevices.map((device: Device) => {
                    return (
                        <View key={device.id ? device.id : device.manufacturerData} style={styles.bleDeviceFound}>
                            <Text style={{ fontSize: 16, color: '#fff' }}>{device.name ? device.name : "N/A"}</Text>
                            {/* {connectedDevice?.id != device.id && */}
                            <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => connectDevice(device)}
                                style={styles.buttonConnect}
                            >
                                <Text style={{ color: '#fff', textAlign: 'center' }}>
                                    Kết nối
                                </Text>
                            </TouchableOpacity>

                            {/* {connectedDevice?.id == device.id &&
                                <View>
                                    <TouchableOpacity
                                        activeOpacity={0.5}
                                        // onPress={() => writeMessageToCharacteristic(device, textMessage)}
                                        onPress={() => sendMessage(device)}
                                        style={styles.buttonConnect}
                                    >
                                        <Text style={{ color: '#fff', textAlign: 'center' }}>
                                            Send Message
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            } */}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
};
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        height: windowHeight,
    },
    buttonStyle: {
        backgroundColor: '#307ecc',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 15,
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    buttonConnect: {
        backgroundColor: '#46c771',
        padding: 5,
        borderRadius: 8,
        marginTop: 8
    },
    bleDeviceFound: {
        padding: 8,
        backgroundColor: '#adb3af'
    },
    inputSendMessage: {
        backgroundColor: '#fff',
        borderRadius: 8
    }
});
export default Bluetooth;