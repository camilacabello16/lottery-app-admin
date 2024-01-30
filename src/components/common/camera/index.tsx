import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import { ORDER_IMG } from '../../../constants/api';
import { useSelector } from 'react-redux';

const CameraScreen = ({ route }: any) => {
    const loginData = useSelector((state: any) => state.auth);
    const rootApi = useSelector((state: any) => state.rootApi);
    const navigation = useNavigation();

    const cameraRef = useRef(null);
    const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
    const [imageSrc, setImageSrc] = useState<string>("");
    const [imageBinary, setImageBinary] = useState<any>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [listImg, setListImg] = useState<any[]>([]);
    const [listBinary, setListBinary] = useState<any[]>([]);

    useEffect(() => {
        if (route?.params?.imageUri && route?.params?.imageUri?.length > 0) {
            setListImg(route?.params?.imageUri);
        }
        if (route?.params?.imageBinary && route?.params?.imageBinary?.length > 0) {
            setListBinary(route?.params?.imageBinary);
        }
    }, [])

    // Function to check and request camera permissions (Android only)
    const checkAndRequestCameraPermission = async () => {
        const permission = PERMISSIONS.ANDROID.CAMERA;
        try {
            const result = await check(permission);
            if (result !== 'granted') {
                const status = await request(permission);
                return status === 'granted';
            }
            return true;
        } catch (error) {
            console.warn('Error checking camera permission:', error);
            return false;
        }
    };

    // Function to handle taking a picture
    const takePicture = async () => {
        if (cameraRef.current && isCameraReady) {
            if (await checkAndRequestCameraPermission()) {
                try {
                    const options = { quality: 0.8, base64: false };
                    const data = await cameraRef.current.takePictureAsync(options);
                    setImageSrc(data);

                    //check xskt
                    // if (route.params.url == "XoSoKienThiet") {
                    var listUri = listImg;
                    var listBinaries = listBinary;

                    const formData = new FormData();
                    formData.append("img", {
                        uri: data.uri,
                        type: 'image/png',
                        name: `photoTicket12345.png`,
                    })
                    fetch(rootApi.rootApi + ORDER_IMG, {
                        method: 'post',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': loginData.userData?.access_token
                        },
                        body: formData
                    }).then((response) => response.json())
                        .then((responseJson) => {
                            console.log(responseJson);

                            listUri.push(data);
                            listBinaries.push(responseJson.data)
                            navigation.navigate(route.params.url, { imageSrc: listUri, imageBinary: listBinaries });
                            // navigation.navigate(route.params.url, { imageSrc: [data], imageBinary: [responseJson.data] });
                            //   return responseJson;
                        }).catch(err => {
                            console.log(err)
                        })
                } catch (error) {
                    console.warn('Error taking picture:', error);
                }
            } else {
                console.warn('Camera permission denied');
            }
        }
    };

    const retakePicture = () => {
        setShowModal(false);
        setImageSrc("");
    };

    const confirmPicture = () => {
        var listArr = listImg;
        var listBi = listBinary;
        listArr?.push(imageSrc);
        setListImg(listArr);

        const formData = new FormData();

        formData.append("img", {
            uri: imageSrc.uri,
            type: 'image/png',
            name: `photoTicket12345.png`,
        })

        fetch(rootApi.rootApi + ORDER_IMG, {
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("data : ", responseJson.data)
                listBi.push(responseJson.data);
                if (route.params.url == "XoSoKienThiet") {
                    navigation.navigate(route.params.url, { imageSrc: listArr, imageBinary: listBi });
                }
                setShowModal(false);
                //   return responseJson;
            }).catch(err => {
                console.log(err)
            })

        setListBinary(listBi);
        // setShowModal(false);

    };

    const completeImg = () => {
        navigation.navigate(route.params.url, { imageSrc: listImg, imageBinary: listBinary });
    }

    return (
        <View style={styles.container}>
            <RNCamera
                ref={cameraRef}
                style={styles.camera}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.off}
                onCameraReady={() => setIsCameraReady(true)}
                captureAudio={false}
            />
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <Text style={styles.captureButtonText}></Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.completeButton} onPress={completeImg}>
                <Text style={{ color: '#fff' }}>Hoàn thành</Text>
            </TouchableOpacity>


            <Modal visible={showModal} animationType="slide" transparent={false}>
                <View style={styles.modalContainer}>
                    {imageSrc && (
                        <Image source={{ uri: imageSrc.uri }} style={styles.capturedImage} />
                    )}
                    <View style={styles.modalButtonsContainer}>
                        <TouchableOpacity style={styles.modalButton} onPress={retakePicture}>
                            <Text style={styles.modalButtonText}>Chụp lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButton} onPress={confirmPicture}>
                            <Text style={styles.modalButtonText}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: '100%',
        height: '80%',
    },
    captureButton: {
        position: 'absolute',
        bottom: 50,
        width: 80,
        height: 80,
        borderRadius: 100,
        backgroundColor: '#FF0010',
        justifyContent: 'center',
        alignItems: 'center',
    },
    completeButton: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 40,
        borderRadius: 0,
        backgroundColor: '#FF0010',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonText: {
        color: 'white',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    capturedImage: {
        width: '80%',
        height: '60%',
        resizeMode: 'contain',
        marginBottom: 20,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalButton: {
        margin: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: 'blue',
        borderRadius: 8,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default CameraScreen;