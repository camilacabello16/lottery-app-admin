import { Buffer } from 'buffer';
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
    useColorScheme,
    TouchableOpacity,
    NativeEventEmitter,
    PermissionsAndroid,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

interface BluetoothDevice {
    id: string;
    name: string;
    rssi: number;
    connected: boolean;
}

const BluetoothComponent: React.FC = () => {
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [connected, setConnected] = useState<boolean>(false);
    const [bluetoothDevices, setBluetoothDevices] = useState<BluetoothDevice[]>([]);
    const [peripheral, setPeripheral] = useState<BluetoothDevice>();

    useEffect(() => {
        BleManager.enableBluetooth().then(() => {
            console.log('Bluetooth is turned on!');
        });

        BleManager.start({ showAlert: false }).then(() => {
            console.log('BLE Manager initialized');
        });

        let stopListener = BleManagerEmitter.addListener('BleManagerStopScan', () => {
            setIsScanning(false);
            console.log('Scan is stopped');
            handleGetConnectedDevices();
        });

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                    console.log('Permission is OK');
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                        if (result) {
                            console.log('User accept');
                        } else {
                            console.log('User refuse');
                        }
                    });
                }
            });
        }

        return () => {
            stopListener.remove();
        };
    }, []);

    const startScan = () => {
        if (!isScanning) {
            BleManager.scan([], 5, true)
                .then(() => {
                    setIsScanning(true);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const handleGetConnectedDevices = () => {
        try {
            BleManager.getConnectedPeripherals([]).then((results) => {
                if (results.length === 0) {
                    console.log('No connected bluetooth devices');
                } else {
                    const connectedDevices: BluetoothDevice[] = results.map((peripheral) => ({
                        ...peripheral,
                        connected: true,
                    }));
                    setConnected(true);
                    setBluetoothDevices(connectedDevices);
                }
            });
        }
        catch (error) {
            console.log("catch", error);

        }
    };

    const connectToPeripheral = (peripheral: BluetoothDevice) => {
        if (peripheral.connected) {
            BleManager.disconnect(peripheral.id).then(() => {
                console.log(JSON.stringify(peripheral));
                peripheral.connected = false;
                setConnected(false);
                alert(`Disconnected from ${peripheral.name}`);
            });
        } else {
            BleManager.connect(peripheral.id)
                .then(() => {
                    peripheral.connected = true;
                    setConnected(true);
                    setPeripheral(peripheral);
                    setBluetoothDevices([...bluetoothDevices]);
                    alert('Connected to ' + peripheral.name);
                })
                .catch((error) => console.log(error));

            setTimeout(() => {
                BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
                    console.log('Peripheral services:', peripheralData);
                });
            }, 900);
        }
    };

    const sendSimpleStringToPeripheral = async (peripheral: BluetoothDevice, message: string) => {
        try {
            console.log(peripheral.id);

            // Check if the device is connected before writing data
            if (peripheral.connected) {
                const serviceUUID = '0000fff0-0000-1000-8000-00805f9b34fb'; // Replace with the actual service UUID of your Bluetooth device
                const characteristicUUID = '0000fff1-0000-1000-8000-00805f9b34fb'; // Replace with the actual characteristic UUID of your Bluetooth device
                const dataToSend = Buffer.from(message, 'utf-8');
                console.log("sending...");

                await BleManager.write(
                    peripheral.id,
                    serviceUUID,
                    characteristicUUID,
                    [1, 2, 3],
                );
                console.log("sent");
                console.log('Message sent successfully:', message);
            } else {
                console.warn('Device is not connected.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const RenderItem: React.FC<{ peripheral: BluetoothDevice }> = ({ peripheral }) => {
        const color = peripheral.connected ? 'green' : '#fff';

        return (
            <>
                <Text
                    style={{
                        fontSize: 20,
                        marginLeft: 10,
                        marginBottom: 5,
                        color: isDarkMode ? Colors.white : Colors.black,
                    }}
                >
                    Nearby Devices:
                </Text>
                <TouchableOpacity onPress={() => connectToPeripheral(peripheral)}>
                    <View
                        style={{
                            backgroundColor: color,
                            borderRadius: 5,
                            paddingVertical: 5,
                            marginHorizontal: 10,
                            paddingHorizontal: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                textTransform: 'capitalize',
                                color: connected ? Colors.white : Colors.black,
                            }}
                        >
                            {peripheral.name}
                        </Text>
                        <View
                            style={{
                                backgroundColor: color,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: connected ? Colors.white : Colors.black,
                                }}
                            >
                                RSSI: {peripheral.rssi}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: connected ? Colors.white : Colors.black,
                                }}
                            >
                                ID: {peripheral.id}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => sendSimpleStringToPeripheral(peripheral, "abc")}>
                    <Text>Send</Text>
                </TouchableOpacity>
            </>
        );
    };

    return (
        <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <ScrollView
                style={backgroundStyle}
                contentContainerStyle={styles.mainBody}
                contentInsetAdjustmentBehavior="automatic"
            >
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
                        marginBottom: 40,
                    }}
                >
                    <View>
                        <Text
                            style={{
                                fontSize: 30,
                                textAlign: 'center',
                                color: isDarkMode ? Colors.white : Colors.black,
                            }}
                        >
                            React Native BLE Manager Tutorial
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.buttonStyle}
                        onPress={startScan}
                    >
                        <Text style={styles.buttonTextStyle}>
                            {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {/* list of scanned bluetooth devices */}
                {bluetoothDevices.map((device) => (
                    <View key={device.id}>
                        <RenderItem peripheral={device} />
                    </View>
                ))}
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
});

export default BluetoothComponent;