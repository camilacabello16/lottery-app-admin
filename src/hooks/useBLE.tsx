import { Buffer } from "buffer";
import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import { BLE_DEFAULT_UUID, BLE_DEFAULT_WRITE_UUID } from "../constants/constants";
// import { encode } from 'base64-js';

type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();

interface BluetoothLowEnergyApi {
    requestPermission(callback: PermissionCallback): Promise<void>;
    scanDevice(): void;
    stopScan(): void;
    connectToDevice(device: Device): void;
    writeMessageToCharacteristic(device: Device, message: string): void;
    allDevices: Device[];
    connectedDevice: Device | null;
}

export default function useBLE(): BluetoothLowEnergyApi {
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    const requestPermission = async (callback: PermissionCallback) => {
        if (Platform.OS === 'android') {
            const grantedStatus = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'Bluetooth need location permission',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'Ok',
                    buttonNeutral: 'Later'
                },
            )
            callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
        } else {
            callback(true);
        }
    }

    const isDuplicate = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;

    const scanDevice = () => {
        try {
            bleManager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.log('Scan error:', error);
                }
                if (device) {
                    console.log('Device found:', JSON.stringify(device));
                    setAllDevices(prevState => {
                        if (!isDuplicate(prevState, device) && device.name) {
                            return [...prevState, device];
                        }
                        return prevState;
                    });
                }
            });

        } catch (error) {
            console.log('Catch scan error:', error);
        }
    };

    const stopScan = () => {
        bleManager.stopDeviceScan();
    }

    const connectToDevice = async (device: Device) => {
        try {
            console.log("CHA", device.serviceUUIDs);

            const deviceConnected = await bleManager.connectToDevice(device.id);
            setConnectedDevice(deviceConnected);
            await deviceConnected.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();


            // try {
            //     // Connect to the device
            //     const connectedDevice = await device.connect();

            //     await connectedDevice.discoverAllServicesAndCharacteristics();

            //     // Check if the device has the necessary serviceUUIDs
            //     if (connectedDevice.serviceUUIDs && connectedDevice.serviceUUIDs.length > 0) {
            //         const serviceUUID = connectedDevice.serviceUUIDs[0]; // Assuming you want to use the first serviceUUID
            //         const characteristicUUID = connectedDevice.serviceUUIDs[0]; // Assuming you want to use the first serviceUUID as characteristicUUID
            //         const messageToWrite = 'Hello, BLE Peripheral!';

            //         // Write the message to the characteristic
            //         await connectedDevice.writeCharacteristicWithoutResponseForService(
            //             // '0000fff0-0000-1000-8000-00805f9b34fb',
            //             // '0000fff0-0000-1000-8000-00805f9b34fb',
            //             serviceUUID,
            //             characteristicUUID,
            //             messageToWrite
            //         );

            //         console.log('Message sent successfully:', messageToWrite);
            //     } else {
            //         console.log('Device does not have serviceUUIDs.');
            //     }
            // } catch (error) {
            //     console.log('Error:', error);
            // }
        } catch (error) {
            console.log('Connection error:', error);
        }
    }

    const writeMessageToCharacteristic = async (device: Device, message: string) => {
        try {
            console.log(message);

            //handle device uuid
            if (device.serviceUUIDs) {
                var uuidArr = device.serviceUUIDs[0].split('-');
                var uuid = BLE_DEFAULT_UUID + '-';
                var writeUUID = BLE_DEFAULT_WRITE_UUID + '-';
                for (let i = 1; i < uuidArr.length; i++) {
                    uuid += uuidArr[i];
                    writeUUID += uuidArr[i];
                    if (i < uuidArr.length - 1) {
                        uuid += '-';
                        writeUUID += '-';
                    }
                }
                const base64String = Buffer.from(message).toString('base64');

                await device.writeCharacteristicWithResponseForService(
                    uuid,
                    writeUUID,
                    base64String,
                );
            }
            else {
                console.log('This device not have UUID');
            }
        } catch (error) {
            console.log('Write error:', error);
        }
    };

    return {
        requestPermission,
        scanDevice,
        stopScan,
        connectToDevice,
        writeMessageToCharacteristic,
        connectedDevice,
        allDevices
    }
}