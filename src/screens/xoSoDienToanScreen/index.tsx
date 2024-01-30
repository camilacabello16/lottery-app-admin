import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DanhSachVeChoScreen from '../../components/template/xoSoDienToan/danhSachVeCho';
import DanhSachVeDaXuLyTemplate from '../../components/template/xoSoDienToan/danhSachVeDaXuLy';
import Icon from 'react-native-vector-icons/FontAwesome';
import DanhSachVeGiuScreen from '../../components/template/xoSoDienToan/danhSachVeGiu';

const Tab = createBottomTabNavigator();

const XoSoDienToanScreen = () => {
  return (
    // <SafeAreaView>
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#d32e31',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="XoSoDienToan_DanhSachVeCho"
        component={DanhSachVeChoScreen}
        options={{
          tabBarLabel: "Đang chờ",
          tabBarIcon: ({ color }) => (
            <Icon name="ticket" size={26} color={color} />
          ),
        }} />
      <Tab.Screen
        name="DanhSachVeGiu"
        component={DanhSachVeGiuScreen}
        options={{
          title: 'Vé giữ',
          tabBarIcon: ({ color }) => (
            <Icon name={'list'} size={26} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="XoSoDienToan_DanhSachVeXuLy"
        component={DanhSachVeDaXuLyTemplate}
        options={{
          tabBarLabel: "Đã xử lý",
          tabBarIcon: ({ color }) => (
            <Icon name={'check-square-o'} size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
    // </SafeAreaView>
  );
};

export default XoSoDienToanScreen;
