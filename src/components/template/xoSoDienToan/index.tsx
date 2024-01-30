import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DanhSachVeChoScreen from './danhSachVeCho';
import DanhSachVeDaXuLyTemplate from './danhSachVeDaXuLy';
import DanhSachVeGiuScreen from './danhSachVeGiu';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const xoSoDienToanHome = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#d32e31',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="DanhSachVeCho"
        component={DanhSachVeChoScreen}
        options={{
          title: 'Đang chờ',
          tabBarIcon: ({ color }) => (
            <Icon name={'ticket'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen name="DanhSachVeGiu" component={DanhSachVeGiuScreen} options={{ title: 'Vé giữ' }} />
      <Tab.Screen name="DanhSachVeXuLy" component={DanhSachVeDaXuLyTemplate} options={{ title: 'Đã xử lý' }} />
    </Tab.Navigator>
  )
}

export default xoSoDienToanHome;