import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

const makeStyle = (hasBackBtn?: boolean) =>
  StyleSheet.create({
    header: {
      width: '100%',
      height: 65,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
      backgroundColor: '#d32e31',
      position: 'relative',
    },
    mainHeader: {
      width: '70%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      marginLeft: 40
    },
    wrapBackBtn: {
      position: 'absolute',
      top: 20,
      left: 10,
      width: '20%',
      height: '100%'
    },
    backBtn: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '500',
    },
    mainTitle: {
      color: '#fff',
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 2,
      textAlign: 'center',
    },
    subTitle: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '500',
    },
  });

export interface IHeaderProps {
  headerTitle?: string;
  backArrow?: boolean;
  subTitle?: string;
  url?: string;
  param?: any;
  screen?: string;
}

const Header: React.FC<IHeaderProps> = ({ backArrow, headerTitle, subTitle, url, param, screen }) => {
  const counter = useSelector((state: any) => state.counter.counters);
  const navigation = useNavigation();
  const style = makeStyle(backArrow);

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    });

    return formatter.format(amount);
  };

  const TotalTicketView = () => {
    console.log("COUNT", counter);

    var counterState = counter?.find(o => o.type == screen);
    return (
      <View>
        <Text style={{
          color: '#fff'
        }}>{counterState?.value ? formatCurrency(counterState?.value) : formatCurrency(0)}</Text>
        <Text style={{
          color: '#fff'
        }}>{counterState?.numberTicket ? counterState?.numberTicket : 0} vé</Text>
      </View>
    );
  }

  return (
    <View style={style.header}>
      {backArrow && (
        <TouchableOpacity style={style.wrapBackBtn} onPress={() => {
          if (url) {
            navigation.navigate(url, { param: { ...param } });
          } else {
            navigation.goBack();
          }
        }}>
          {/* <Text style={style.backBtn}>Back</Text> */}
          <Icon name={'chevron-left'} size={26} color={'#fff'} />
        </TouchableOpacity>
      )}
      <View style={style.mainHeader}>
        <Text style={style.mainTitle}>{headerTitle}</Text>
        {/* v1.9 */}
        {subTitle &&
          <Text style={style.subTitle}>{subTitle}</Text>
        }
      </View>
      {screen &&
        <TotalTicketView />
      }
    </View>
  );
};

export default Header;
