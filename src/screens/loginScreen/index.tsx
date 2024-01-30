import React, { useRef } from 'react';
import {
    Input,
    Stack,
    Pressable,
    InputRightAddon,
    InputGroup,
    Button,
    Box,
} from 'native-base';
import { StyleSheet, Text } from 'react-native';
import axios from 'axios';
import { STAFF_LOGIN } from '../../constants/api';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { alert } from '@baronha/ting';
import { login } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const validationSchema = yup.object({
    username: yup.string().required('Vui lòng nhập tên đăng nhập'),
    pass: yup.string().required('Vui lòng nhập mật khẩu'),
});

const style = StyleSheet.create({
    text: {
        width: '85%',
        fontSize: 40,
        fontWeight: '300',
        textAlign: 'left',
        color: '#d32e31',
    },
    button: {
        backgroundColor: '#d32e31',
        height: 48
    },
    subText: {
        color: '#1a1a1a',
        fontSize: 12,
        fontWeight: '300',
        textAlign: 'left',
        width: '85%',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '300',
        color: '#fff',
    },
});

const LoginScreen = () => {
    const rootApi = useSelector((state: any) => state.rootApi);

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            username: '',
            pass: '',
        },
        validationSchema,
        onSubmit: (values) => {
            axios.post(rootApi.rootApi + STAFF_LOGIN, {
                username: values.username,
                pass: values.pass,
                device: 1
            }).then(res => {
                if (res.data.error == 0) {
                    alert({
                        title: res.data.msg,
                        message: '',
                        preset: 'done'
                    });
                    var stateLogin = {
                        username: values.username,
                        access_token: res.data.data.access_token,
                        staff_id: res.data.data.id
                    }
                    dispatch(login(stateLogin));
                    navigation.navigate('Layout');
                } else {
                    alert({
                        title: res.data.msg,
                        message: '',
                        preset: 'error'
                    });
                }
            })
        },
    });

    const [show, setShow] = React.useState(false);
    const toastRef = useRef<any>(null);

    return (
        <Stack space={4} w="100%" alignItems="center" justifyContent="center">
            <Text style={style.text}>Đăng nhập</Text>
            <Text style={style.subText}>Truy cập bằng tài khoản quản trị</Text>
            <InputGroup
                height={12}
                w={{
                    base: '85%',
                    md: '285',
                }}>
                <Input
                    w={{
                        base: '100%',
                        md: '100%',
                    }}
                    colorScheme="secondary"
                    value={formik.values.username}
                    onChangeText={formik.handleChange('username')}
                    onBlur={formik.handleBlur('username')}
                    placeholder="Tên đăng nhập"></Input>
            </InputGroup>
            {formik.touched.username && formik.errors.username && (
                <Text style={{ color: 'red' }}>{formik.errors.username}</Text>
            )}
            <InputGroup
                height={12}
                w={{
                    base: '85%',
                    md: '285',
                }}>
                <Input
                    w={{
                        base: '85%',
                        md: '100%',
                    }}
                    colorScheme="secondary"
                    type={show ? 'text' : 'password'}
                    value={formik.values.pass}
                    onChangeText={formik.handleChange('pass')}
                    onBlur={formik.handleBlur('pass')}
                    placeholder="Mật khẩu"></Input>
                <Pressable onPress={() => setShow(!show)}>
                    <InputRightAddon height={12} children={!show ? 'Hiện' : 'Ẩn'} />
                </Pressable>
            </InputGroup>
            {formik.touched.pass && formik.errors.pass && (
                <Text style={{ color: 'red' }}>{formik.errors.pass}</Text>
            )}
            <Box width="85%" alignItems="center">
                <Button
                    w={'100%'}
                    style={style.button}
                    onPress={formik.handleSubmit}>
                    <Text style={style.buttonText}>Đăng nhập</Text>
                </Button>
            </Box>
        </Stack>
    );
};

export default LoginScreen;
