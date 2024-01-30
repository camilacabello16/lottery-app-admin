import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DanhSachVeCho from './danhSachVeCho';
import DanhSachVeXuLy from './danhSachVeXuLy';
import Icon from 'react-native-vector-icons/FontAwesome';
import DanhSachVeGiuVietlot from './danhSachVeGiu';

const Tab = createBottomTabNavigator();

const XoSoVietlotVeThuong = () => {
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
                component={DanhSachVeCho}
                options={{
                    title: 'Đang chờ',
                    tabBarIcon: ({ color }) => (
                        <Icon name={'ticket'} size={26} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="DanhSachVeGiu"
                component={DanhSachVeGiuVietlot}
                options={{
                    title: 'Vé giữ',
                    tabBarIcon: ({ color }) => (
                        <Icon name={'list'} size={26} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="DanhSachVeXuLy"
                component={DanhSachVeXuLy}
                options={{
                    title: 'Đã xử lý',
                    tabBarIcon: ({ color }) => (
                        <Icon name={'check-square-o'} size={26} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default XoSoVietlotVeThuong;

