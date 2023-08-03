import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Entypo } from "@expo/vector-icons"
import { base_url } from '../config'

export default function Dashboard({ form }: any) {
  const [forums, setForums]: any = useState({})
  useEffect(() => {
    axios.get(`${base_url}/getAllForms/`, {
      data: undefined
    },).then(res => {
      console.log(res.data)
      setForums(res.data)
    }).catch((err) => console.log(err))
  }, [])
  return (
    <SafeAreaView className=' flex-1' style={{ backgroundColor: '#BEA4D0' }}>
      <Text className='text-white mx-5' style={{ fontWeight: '600', fontFamily: 'Georgia', fontSize: 25, marginTop: 40, marginBottom: 30 }}>
        Welcome to DocXtract!
      </Text>
      <View className='bg-white m-2 rounded-3xl p-5 h-[600]'>
        <Text className='text-black my-3' style={{ fontWeight: '500', fontSize: 20, marginBottom: 30, fontFamily: 'Georgia' }}>Select a Form</Text>
        {
          Object.keys(forums).length > 0 ?
            Object.keys(forums).map((key: any, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => form(forums[key])}>
                  <View className='rounded-lg p-3 py-5 mb-3 ' style={{ backgroundColor: '#EEEFF3' }}>
                    <View className='flex-row justify-between items-center mb-3'>
                      <View className='flex-col'>
                        <Text className='text-slate-800 text-lg' style={{fontFamily: 'Georgia'}}>{forums[key].name}</Text>
                        <Text className='text-slate-800 text-sm' style={{fontFamily: 'Georgia'}}>{forums[key].description}</Text>
                      </View>


                      <Entypo name="chevron-small-right" size={28} color="#BEA4D0" />

                      {/* <Text className='text-slate-800 text-lg'>{forums[key].due}</Text> */}
                    </View>
                    {/* <View className='flex-row justify-between items-center'>
                  <Text className='text-slate-800 text-sm'>{forums[key].organizer}</Text>
                  <View className={`rounded-lg p-1 ${forums[key].complete ? 'bg-zinc-100' : 'bg-stone-100'}`}>
                    <Text className='text-slate-800 text-sm'>{forums[key].complete ? 'Submitted': 'Pending'}</Text>
                  </View>
                </View> */}
                  </View>
                </TouchableOpacity>
              )
            }) : <Text>No Items</Text>}
      </View>
    </SafeAreaView>
  )
}
