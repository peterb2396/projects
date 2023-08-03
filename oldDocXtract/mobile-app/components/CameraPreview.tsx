import axios from "axios"
import { useEffect, useState } from "react"
import { View, ImageBackground, TouchableOpacity, Text, Animated, Alert } from "react-native"
import { base_url } from "../config"

export default function CameraPreview({ photo, reset, imageIndex, updateFormDetails, lastPage, formDetails, handleNext, cancel, switchScreens }: any) {
  const [startAnimation, setStartAnimation] = useState(false)
  const [animation, setAnimation] = useState(new Animated.Value(0))
  const [blink, setBlink]: any = useState(new Animated.Value(0))
  const [error, setError] = useState(false)

  const handleSubmit = () => {
    setStartAnimation(true)
    animate()
    const formData = new FormData()
    photo.map((img: any, index: any) => {
      const data: any = {
        uri: img.uri,
        name: `form${index + 1}.jpg`,
        type: 'image/jpg'
      }
      formData.append(data.name, data);
    })

    formData.append('fields', JSON.stringify(formDetails.fields))
    axios.post(`${base_url}/extract`, formData).then((res) => {
      console.log(res)
      formDetails.fields = res.data
      updateFormDetails(formDetails)
      switchScreens('Scan Form')
    }).catch((err) => {
      console.log(err)
      setError(true)
      reset()
    })
  }

  const animate = () => {
    Animated.loop(Animated.sequence([Animated.timing(animation, {
      toValue: 600,
      duration: 3000,
      useNativeDriver: true
    }), Animated.timing(animation, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true
    })])).start()
    Animated.loop(Animated.sequence([Animated.timing(blink, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true
    }), Animated.timing(blink, {
      toValue: 0.8,
      duration: 100,
      useNativeDriver: true
    })])).start()
  }
  const animatedStyles: any = {
    transform: [
      {
        translateY: animation
      }
    ]
  }
  return (
    <>
      {error && Alert.alert('Bad Quality Image', 'The image quality was bad and could not processed. Please click clear images including borders for an accurate extraction.', [
        { text: 'OK', onPress: () => {} },
      ])}
      <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          width: '100%',
          height: '100%'
        }}
      >
        {startAnimation && <Animated.View className='w-full h-5 z-10' style={animatedStyles}>
          {/* <Animated.View className="w-full h-[50] bg-gray-500" style={{ opacity: blink }}></Animated.View> */}
          <View className="w-full h-5 bg-gray-500"></View>
          <Animated.View className="w-full h-[200] bg-gray-500" style={{ opacity: blink }}></Animated.View>
        </Animated.View>}

        <ImageBackground
          source={{ uri: photo[imageIndex].uri }}
          style={{
            flex: 1
          }}
        >
          {!startAnimation && <TouchableOpacity onPress={cancel} className='border-2 rounded-xl bg-red-500 py-3 px-6 ' style={{
            position: 'absolute',
            bottom: 50,
            left: 50,
          }}>
            <Text className="text-white">Retake</Text>
          </TouchableOpacity>}
          {!startAnimation && <TouchableOpacity onPress={lastPage ? handleSubmit : handleNext} className='border-2 rounded-xl bg-green-500 py-3 px-6 ' style={{
            position: 'absolute',
            bottom: 50,
            right: 50,
          }}>
            <Text className="text-white">{lastPage ? 'Submit' : 'Next Page'}</Text>
          </TouchableOpacity>}
        </ImageBackground>
      </View></>
  )
}