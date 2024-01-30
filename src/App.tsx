import { Center, NativeBaseProvider } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import XoSoKienThietScreen from './screens/xoSoKienThietScreen';
import XoSoDienToanScreen from './screens/xoSoDienToanScreen';
import XoSoVietlotScreen from './screens/xoSoVietlot';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import XoSoVietlotVeThuong from './components/template/xoSoVietlot/veThuong';
import ChiTietDonHang from './components/template/xoSoVietlot/veThuong/chiTietDonHang';
import LichSuMuaVeScreen from './components/template/xoSoDienToan/lichSuMuaVe';
import Bluetooth from './screens/bluetooth';
import CameraScreen from './components/common/camera';
import rootReducer from './redux/reducers';
import { createStore } from '@reduxjs/toolkit';
import BasicLayout from './screens/layout';
import MQTTExample from './screens/mqtt';
import ChiTietDonHangTemplate from './components/template/xoSoDienToan/chiTietDonHang';
import DanhSachVeXuLy from './components/template/xoSoVietlot/veThuong/danhSachVeXuLy';
import ChiTietVeDaXuLy from './components/template/xoSoVietlot/veThuong/chiTietVeDaXuLy';
import HomeLotteryScreen from './screens/homeLotteryScreen';
import XoSoKienThietLichSuTemplate from './components/template/xoSoKienThiet/lichSuMuaVe';
import DanhSachVeChoKeno from './components/template/xoSoVietlot/Keno';
import LoginScreen from './screens/loginScreen';
import mqtt from 'precompiled-mqtt';
import { CONFIG_SOCKET } from './constants/constants';

const Stack = createNativeStackNavigator();

const store = createStore(rootReducer);

function App() {
    // const [client, setClient] = useState<any>();

    // const sendMessage = (topic, payload) => {
    //     if (client) {
    //         client.publish(topic, payload);
    //     }
    // };

    // const sendAutomaticMessage = (topic, payload, interval) => {
    //     setInterval(() => {
    //         console.log(topic, payload);

    //         sendMessage(topic, payload);
    //     }, interval);
    // };

    // useEffect(() => {
    //     const options = {
    //         // host: 'ws://socket-client.veso3mien.vn',
    //         // port: 8083,
    //         clientId: ''user_' + makeid(8)',
    //         username: CONFIG_SOCKET.username,
    //         password: CONFIG_SOCKET.password,
    //         path: CONFIG_SOCKET.path
    //     };
    //     const mqttClient = mqtt.connect(CONFIG_SOCKET.host, options);
    //     setClient(mqttClient);
    //     mqttClient.on('connect', () => {
    //         console.log('Connected to MQTT broker user');
    //         mqttClient.subscribe('user_online');
    //     });

    //     mqttClient.on('message', (topic, message) => {
    //         console.log("Topic:", topic);
    //         console.log("Received message on topic:", message.toString());
    //     });

    //     mqttClient.on('error', (error) => {
    //         console.error('MQTT Error:', error);
    //     });

    //     mqttClient.publish("abc", "user_online");

    //     return () => {
    //         mqttClient.end();
    //     };
    // }, [])

    // useEffect(() => {
    //     sendAutomaticMessage('user_online', 'Automatic message', 10000); // 10 seconds interval
    // }, []);

    return (
        <Provider store={store}>
            <NativeBaseProvider>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false
                        }}
                    >
                        <Stack.Screen
                            name="Layout"
                            component={BasicLayout}
                            options={{ title: 'Layout' }}
                        />

                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ title: 'Layout' }}
                        />

                        <Stack.Screen
                            name="HomeScreen"
                            component={HomeLotteryScreen}
                            options={{ title: 'Trang chủ' }}
                        />

                        {/* home */}
                        <Stack.Screen name="XoSoVietlot" component={XoSoVietlotScreen} options={{ title: 'Xổ số Vietlot' }} />
                        <Stack.Screen name="XoSoKienThiet" component={XoSoKienThietScreen} options={{ title: 'Xổ số kiến thiết' }} />
                        <Stack.Screen name="XoSoDienToan" component={XoSoDienToanScreen} options={{ title: 'Xổ số điện toán' }} />
                        {/* <Stack.Screen name="XoSoKeno" component={XoSoDienToanScreen} options={{ title: 'Xổ số điện toán' }} /> */}
                        {/* vietlot */}
                        <Stack.Screen name="XoSoVietLot_VeThuong" component={XoSoVietlotVeThuong} options={{ title: 'Xổ số Vietlot - Vé thường' }} />
                        <Stack.Screen name="XoSoVietLot_VeThuong_ChiTietDonHang" component={ChiTietDonHang} options={{ title: 'Chi tiết đơn hàng' }} />
                        <Stack.Screen name="XoSoVietLot_VeThuong_ChiTietVeDaXuLy" component={ChiTietVeDaXuLy} options={{ title: 'Chi tiết đơn hàng - vé đã xử lý' }} />
                        <Stack.Screen name="XoSoVietLot_Keno" component={DanhSachVeChoKeno} options={{ title: 'Xổ số Vietlot - Keno' }} />
                        {/* kien thiet */}
                        <Stack.Screen name="XoSoKienThiet_LichSuMuaVe" component={XoSoKienThietLichSuTemplate} options={{ title: 'Lịch sử mua vé' }} />

                        {/* dien toan  */}
                        {/* <Stack.Screen name="XoSoDienToan" component={LichSuMuaVeScreen} options={{ title: 'Lịch sử mua vé' }} /> */}
                        <Stack.Screen name="XoSoDienToan_ChiTiet" component={ChiTietDonHangTemplate} options={{ title: 'Lịch sử mua vé' }} />


                        {/* bluetooth  */}
                        {/* <Stack.Screen name="Bluetooth" component={BluetoothComponent} options={{ title: 'Bluetooth' }} /> */}
                        <Stack.Screen name="Bluetooth" component={Bluetooth} options={{ title: 'Bluetooth' }} />
                        {/* <Stack.Screen name="Bluetooth" component={MQTTExample} options={{ title: 'Bluetooth' }} /> */}

                        {/* camera */}
                        <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Camera' }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </NativeBaseProvider>
        </Provider>
    );
}

export default App;
