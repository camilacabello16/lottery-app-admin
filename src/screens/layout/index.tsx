// App.tsx
import React from 'react';
import { View } from 'react-native';

import LoginScreen from '../loginScreen';
import { useSelector } from 'react-redux';
import Bluetooth from '../bluetooth';
import HomeLotteryScreen from '../homeLotteryScreen';

const BasicLayout = () => {
    const loginData = useSelector((state: any) => state.auth);

    return (
        <View style={{ flex: 1 }}>
            {loginData.isLoggedIn ? <HomeLotteryScreen /> : <LoginScreen />}
            {/* <HomeLotteryScreen /> */}
        </View>
    );
};

export default BasicLayout;