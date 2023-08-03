import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import CheckBox from 'expo-checkbox';
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Button from '../components/Button';
import { base_url } from '../config';
const staticData = {
    "text": [
        "MUSKAAN SHAIKH",
        "Yes",
        "SOFTWARE ENGINEERING",
        "SPRING",
        "No",
        "No",
        "Yes",
        "No",
        "Yes",
        "Yes",
        "No",
        "No"
    ]
}

function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
}
export default function Fill_Form({ switchScreens, formDetails, scan }: any) {
    const [form, setForm]: any = useState({})
    const [details, setDetails]: any = useState({})
    useEffect(() => {
        let fields: any = {}
        setForm(formDetails.fields)
        setDetails(formDetails.data)
        // axios.get(`http://192.168.1.223:8000/getForm/${forum.index}`, {
        //     data: undefined
        // },).then(res => {
        //     fields = res.data.fields
        //     setForm(res.data.fields)
        //     setDetails(res.data.data)

        // }).then(async () => {

        //     if (photo) {
        //         const formData = new FormData()
        //         photo.map((img: any, index: any) => {
        //             const data: any = {
        //                 uri: img.uri,
        //                 name: `form${index + 1}.jpg`,
        //                 type: 'image/jpg'
        //             }
        //             formData.append(data.name, data);
        //         })

        //         formData.append('fields', JSON.stringify(fields))
        //         console.log(typeof (fields))
        //         axios.post('http://192.168.1.223:8000/extract', formData).then((res) => {
        //             console.log(res)
        //             setForm(res.data)
        //         }).catch((err) => console.log(err))
        //         // let formUpdates = { ...form }
        //         // Object.keys(fields).map((field: any) => {
        //         //     formUpdates = {
        //         //         ...formUpdates,
        //         //         [field]: {
        //         //             ...fields[field],
        //         //             value: staticData.text[Number(field)]
        //         //         }
        //         //     }
        //         // })
        //         // setForm(formUpdates)
        //     }


        // }).catch((err) => console.log(err))
    }, [])
    const handleTextChange = (key: any, val: any) => {
        setForm({
            ...form, [key]: {
                ...form[key],
                value: val
            }
        })
    }

    const handleCheckboxChange = (key: any) => {
        setForm({
            ...form, [key]: {
                ...form[key],
                value: form[key].value === 'Yes' ? 'No' : 'Yes'
            }
        })
    }

    const handleMCSingleValue = (key: any) => {
        let form_copy = {
            ...form, [key]: {
                ...form[key],
                value: form[key].value === 'Yes' ? 'No' : 'Yes'
            }
        }

        if (form[key].value === 'No')
            Object.keys(form).map((k) => {
                if (form[k].groupName === form[key].groupName && k !== key) {
                    form_copy = {
                        ...form_copy, [k]: {
                            ...form_copy[k],
                            value: 'No'
                        }
                    }
                }
            })
        setForm(form_copy)
    }

    const handleSubmit = () => {
        console.log({ data: details, fields: form })
        axios.post(`${base_url}/submitForm/`, { data: details, fields: form }).then(res => {
            console.log(res)
            switchScreens('Dashboard')
        }).catch((err) => console.log(err))
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#EEEFF3' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className='p-absolute flex-row m-5'>
                    <Button title='Go to Options' icon='back' onPress={() => switchScreens('Form')} color="#BEA4D0" />
                </View>
                <View className='flex-1 flex-column items-center'>
                    <Text className='text-2xl font-bold my-2' style={{ fontFamily: 'Georgia' }}>{details?.name}</Text>
                    {/* <Text className='text-md font-semibold'>{details?.organizer}</Text> */}
                </View>
                <View className='flex-1 mx-10 my-5'>

                    {Object.keys(form).length > 0 ?
                        Object.keys(form).map((key: any, index) => {
                            console.log(scan, !form[key].name.includes('Signature'))
                            return (
                                <View key={index}>
                                    {
                                        form[key].type === 'text' ?
                                            ((scan && !form[key].name.includes('Signature')) || !scan) &&
                                            <>
                                                <Text className='text-bold'>{form[key].name}</Text>
                                                <TextInput value={form[key].value} onChangeText={text => handleTextChange(key, text)} className='border bg-white rounded-xl mt-1 mb-3 p-2' />
                                            </>
                                            : form[key].type === 'checkbox' ?
                                                <View className='flex flex-row mb-5'>
                                                    <CheckBox value={form[key].value === 'Yes' ? true : false} onValueChange={() => handleCheckboxChange(key)} />
                                                    <Text className='ml-5'>{form[key].name}</Text>
                                                </View>
                                                : form[key].type === "mc" && form[key].singleSelectionOnly
                                                    ? <View className='mb-5'>
                                                        {form[key - 1].groupName !== form[key].groupName && <Text className='mb-2'>{form[key].groupName}</Text>}
                                                        <View className='flex flex-row mb-1'><CheckBox value={form[key].value === 'Yes' ? true : false} onValueChange={() => handleMCSingleValue(key)} /><Text className='ml-5'>{form[key].choiceName}</Text></View>
                                                    </View>
                                                    : form[key].type === "mc" && !form[key].singleSelectionOnly
                                                        ? <View className='mb-5'>
                                                            {form[key - 1].groupName !== form[key].groupName && <Text className='mb-2'>{form[key].groupName}</Text>}
                                                            <View className='flex flex-row mb-1'><CheckBox value={form[key].value === 'Yes' ? true : false} onValueChange={() => handleCheckboxChange(key)} /><Text className='ml-5'>{form[key].choiceName}</Text></View>
                                                        </View>
                                                        : <></>

                                    }
                                </View>
                            )
                        }) :
                        <Text>No Items</Text>
                    }
                </View>
                <View className='flex-1 flex-row justify-center' style={{ marginTop: 10, marginBottom: 30 }}>
                    <TouchableOpacity className='rounded-xl py-3 px-5' style={{ backgroundColor: '#BEA4D0' }} onPress={handleSubmit}>
                        <Text className='text-white' style={{ fontFamily: 'Georgia', fontWeight: '500', fontSize: 18 }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

