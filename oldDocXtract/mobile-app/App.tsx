
import { useState } from 'react';
import Form from './screens/Form';
import Dashboard from './screens/Dashboard';
import Fill_Form from './screens/Fill_Form';



export default function App() {
  const [display, setDisplay] = useState('Dashboard')
  const [forum, setForum] = useState({})
  const [photo, setPhoto] = useState([])
  const [formDetails, setFormDetails] = useState()
  const switchScreens = (screen: string) => {
    if (screen === 'Form') setDisplay('Form')
    else if (screen === 'Fill Form') setDisplay('Fill Form')
    else if (screen === 'Scan Form') setDisplay('Scan Form')
    else setDisplay('Dashboard')
  }
  const form = (forum: any) => {
    setForum(forum)
    switchScreens('Form')
  }
  const updatePhoto = (newPhoto: any) => {
    setPhoto(newPhoto)
  }

  const updateFormDetails = (details: any) => {
    setFormDetails(details)
  }

  return (
    display === 'Dashboard' ?
      <Dashboard form={form} />
      : display === 'Form' ?
        <Form updateFormDetails={updateFormDetails} formDetails = {formDetails} switchScreens={switchScreens} forum={forum} updatePhoto={updatePhoto} />
        : display === 'Scan Form' ?
          <Fill_Form formDetails={formDetails} switchScreens={switchScreens} scan={true}></Fill_Form>
          : display === 'Fill Form' ?
            <Fill_Form formDetails={formDetails} switchScreens={switchScreens}></Fill_Form>
            :
            <></>
  );
}
