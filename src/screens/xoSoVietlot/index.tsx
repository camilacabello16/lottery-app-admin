import { Center } from 'native-base';
import React from 'react';
import { SafeAreaView } from 'react-native';
import VietlotHome from '../../components/template/xoSoVietlot/home';
import ChiTietDonHang from '../../components/template/xoSoVietlot/veThuong/chiTietDonHang';
import ChiTietVeDaXuLy from '../../components/template/xoSoVietlot/veThuong/chiTietVeDaXuLy';
import DanhSachVeCho from '../../components/template/xoSoVietlot/veThuong/danhSachVeCho';
import DanhSachVeXuLy from '../../components/template/xoSoVietlot/veThuong/danhSachVeXuLy';

const XoSoVietlotScreen = () => {
  return (
    <SafeAreaView>
      <VietlotHome />
      {/* <DanhSachVeCho /> */}
      {/* <ChiTietDonHang /> */}
      {/* <DanhSachVeXuLy /> */}
      {/* <ChiTietVeDaXuLy /> */}
    </SafeAreaView>
  );
};

export default XoSoVietlotScreen;
