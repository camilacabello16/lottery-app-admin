import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import XoSoKienThietTemplate from '../../components/template/xoSoKienThiet';
import XoSoKienThietLichSuTemplate from '../../components/template/xoSoKienThiet/lichSuMuaVe';

const XoSoKienThietScreen = () => {
  return (
    <SafeAreaView>
      <XoSoKienThietTemplate />
      {/* <XoSoKienThietLichSuTemplate /> */}
    </SafeAreaView>
  );
};

export default XoSoKienThietScreen;
