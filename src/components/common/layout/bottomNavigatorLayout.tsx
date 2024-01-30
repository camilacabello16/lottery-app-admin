import { View } from 'native-base';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DanhSachVeCho from '../../template/xoSoVietlot/veThuong/danhSachVeCho';
import DanhSachVeXuLy from '../../template/xoSoVietlot/veThuong/danhSachVeXuLy';

const Tab = createBottomTabNavigator();

const bottomNavigatorLayout = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="DanhSachVeCho"
                component={DanhSachVeCho}
            />
            <Tab.Screen name="DanhSachVeXuLy" component={DanhSachVeXuLy} />
        </Tab.Navigator>
    );
}

export default bottomNavigatorLayout;