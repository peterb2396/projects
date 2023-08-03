import { StyleSheet, Alert, View, TouchableOpacity, SafeAreaView, Text } from 'react-native'
import { Camera, CameraType, FlashMode } from 'expo-camera'
import CameraPreview from '../components/CameraPreview'
import Button from '../components/Button'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import * as Print from 'expo-print';
import { base_url } from '../config'

interface cameraStatus {
    status: string
}

export default function Form({ switchScreens, updateFormDetails, formDetails, updatePhoto, forum }: any) {
    const [cameraStarted, setCameraStarted] = useState(false)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState<any>([])
    const [imageIndex, setImageIndex] = useState(0)
    const [type, setType] = useState(CameraType.back);
    const [flash, setFlash] = useState(FlashMode.off)
    const cameraRef: any = useRef(null);
    const [flashMode, setFlashMode] = useState(FlashMode.off)
    const [pages, setPages] = useState(1)
    const reset = () => {
        setPreviewVisible(false)
        setCapturedImage([])
        setImageIndex(0)
    }
    useEffect(() => {
        axios.get(`${base_url}/getForm/${forum.index}`, {
            data: undefined
        },).then(res => {
            // console.log(res.data)
            updateFormDetails(res.data)
            setPages(res.data.pages)
        })
    }, [])
    const handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode(FlashMode.off)
        } else if (flashMode === 'off') {
            setFlashMode(FlashMode.on)
        } else {
            setFlashMode(FlashMode.auto)
        }

    }
    const takePicture = async () => {
        if (cameraRef) {
            try {
                const photo = await cameraRef.current.takePictureAsync();
                // console.log(photo)
                let update = [...capturedImage]
                update[imageIndex] = photo
                setCapturedImage(update)
                updatePhoto(update)
                setPreviewVisible(true)
            } catch (e) {
                console.log(e)
            }
        }
    }

    const startCamera = async () => {
        //   MediaLibrary.requestPermissionsAsync();
        const cameraStatus: cameraStatus = await Camera.requestCameraPermissionsAsync();
        if (cameraStatus.status === "granted") setCameraStarted(true)
        else Alert.alert("Access denied")
    }

    const printForm = async () => {
        await axios({
            url: forum.printable,
            method: 'GET',
            responseType: 'blob'
        }).then(async (response) => {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const printOptions = {
                html: `<iframe src=${url} style={{display: none}} />`,
                width: 595,
                height: 842,
                base64: true,
            };

            const printResult = await Print.printAsync(printOptions);

            console.log(printResult);

        }).catch(error => {
            console.log(error);
        });
    }

    const closeCamera = () => {
        setCameraStarted(false)
    }

    const fillForm = () => {
        switchScreens('Fill Form')
    }

    const handleNext = () => {
        setImageIndex(imageIndex + 1)
        setPreviewVisible(false)
    }
    return (
        <SafeAreaView className='flex-1' style={{ backgroundColor: '#EEEFF3' }}>
            {cameraStarted ?
                previewVisible && capturedImage ? (
                    <CameraPreview reset={reset} formDetails={formDetails} updateFormDetails={updateFormDetails} photo={capturedImage} imageIndex={imageIndex} forum={forum} lastPage={imageIndex === pages - 1} handleNext={handleNext} switchScreens={switchScreens} cancel={() => {
                        setPreviewVisible(false)
                        delete capturedImage[imageIndex]
                    }} />
                ) : (
                    <Camera style={styles.camera} type={type} flashMode={flashMode} ref={cameraRef}>
                        <TouchableOpacity onPress={handleFlashMode}
                            style={{
                                position: 'absolute',
                                right: '5%',
                                top: '10%',
                                backgroundColor: flashMode === FlashMode.off ? '#000' : '#fff',
                                borderRadius: 50,
                                height: 25,
                                width: 25
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20
                                }}
                            >
                                ⚡️
                            </Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                position: 'absolute',
                                top: -20,
                                flexDirection: 'row-reverse',
                                flex: 1,
                                width: '100%',
                                marginTop: 30,
                                justifyContent: 'space-between'
                            }}><Button icon='cross' onPress={closeCamera} color="#fff" />
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                flexDirection: 'row',
                                flex: 1,
                                width: '100%',
                                padding: 20,
                                justifyContent: 'space-between'
                            }}>
                            <View
                                style={{
                                    alignSelf: 'center',
                                    flex: 1,
                                    alignItems: 'center'
                                }}>
                                <TouchableOpacity
                                    onPress={takePicture}
                                    style={{
                                        width: 70,
                                        height: 70,
                                        bottom: 0,
                                        borderRadius: 50,
                                        backgroundColor: '#fff'
                                    }} />
                            </View>
                        </View>
                    </Camera>
                )
                : (
                    <SafeAreaView>
                        <View className='p-absolute flex-row m-5'>
                            <Button title='Go to Dashboard' icon='back' onPress={() => switchScreens('Dashboard')} color="#BEA4D0" />
                        </View>
                        <View className='flex-column items-center'>
                            <Text className='text-3xl font-bold my-2' style={{ fontFamily: 'Georgia' }}>{forum?.name}</Text>
                            <Text className='text-sm my-2 px-10 text-center' style={{ fontFamily: 'Georgia' }}>Select a form filling method. You can either type it manually or scan a copy of ink filled form. Please print the form if you prefer to scan.</Text>

                            {/* <Text className='text-md font-semibold'>{forum?.organizer}</Text> */}
                        </View>
                        <View className='mt-[100] items-center'>
                            <View className='border-2 rounded-lg w-[200]' style={{ borderColor: '#BEA4D0', backgroundColor: '#ffffff' }}>
                                <Button title='Print Document' icon='print' onPress={printForm} color="#BEA4D0" />
                            </View>
                            <View className='border-2 rounded-lg w-[200] mt-10' style={{ borderColor: '#BEA4D0', backgroundColor: '#ffffff' }}>
                                <Button title='Scan Document' icon='camera' onPress={startCamera} color="#BEA4D0" />
                            </View>
                            <View className='border-2 rounded-lg w-[200] mt-10' style={{ borderColor: '#BEA4D0', backgroundColor: '#ffffff' }}>
                                <Button title='Fill Manually' icon='edit' onPress={fillForm} color="#BEA4D0" />
                            </View>
                        </View>
                    </SafeAreaView>
                )
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    camera: {
        flex: 1,
        width: '100%',
    }
})