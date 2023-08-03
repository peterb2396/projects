import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';
import OpenExcel from './components/excelopen';
import OpenPdf from './components/openpdf';
import qr from "./qr.png"
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { base_url } from './config';

function App() {
  const [forms, setForms] = useState({})
  const [responses, setResponses] = useState({})
  const [isFormMoved, setIsFormMoved] = useState(false)
  const [selectedForm, setSelectedForm] = useState({})
  const [excelKey, setExcelKey] = useState('')
  const [pdfKey, setPdfKey] = useState('')
  const excelRef = useRef(null);
  // const [showMain, setShowMain] = useState(true)
  const [showNew, setShowNew] = useState(false)
  useEffect(() => {
    axios.get(`${base_url}/getAllForms/`).then(res => {
      console.log(res.data)
      const data = res.data
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          data[key]['active'] = false;
        }
      }
      setForms(data)
    }).catch((err) => {
      console.log(err)
      window.alert('Something went wrong. Please try again.')
    })
  }, [])

  const selectForm = (form) => {
    setIsFormMoved(true)
    setSelectedForm(form)
    const updateForm = { ...forms }
    for (const key in updateForm) {
      if (Object.hasOwnProperty.call(updateForm, key)) {
        updateForm[key].active = false;
      }
    }
    updateForm[form.index].active = true
    setForms(updateForm)
    axios.get(`${base_url}/getResponses/${form.index}`, {
      data: undefined
    },).then(res => {
      console.log(res.data)
      setResponses(res.data)
    }).catch((err) => {
      console.log(err)
      window.alert('Something went wrong. Please try again.')
    })
  }

  const viewExcel = () => {
    excelRef.current.scrollIntoView({ behavior: 'smooth' })
    setExcelKey(responses['-1'])
  }

  const viewPdf = (index) => {
    setPdfKey(responses[index].pdf)
  }

  const printForm = () => {
    axios({
      url: selectedForm.printable,
      method: 'GET',
      responseType: 'blob'
    }).then(response => {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = function () {
        iframe.contentWindow.print();
      };

    }).catch(error => {
      console.log(error);
    });
  }

  return (
    <>
      <div className='main-container'>
        <div className={`left-content ${isFormMoved ? 'hide-left' : ''}`}>
          <div className='left-welcome'>Welcome to DocXtract!</div>
          <div className='left-body'>Managing Complex Forms Made Easy</div>
          <div style={{width: '80%', marginTop: '30px'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div className='left-body'>Admin</div>
              <div style={{fontSize: '15px'}}> - Upload forms and let us do the rest</div>
              <div style={{fontSize: '15px'}}> - View responses filled in any format into the defined standard template</div>
              <div style={{fontSize: '15px'}}> - Access all responses containerised in a table</div>
              <div style={{fontSize: '15px'}}> - Download each form template and all responses as an excel file</div>
              
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div className='left-body'>User</div>
              <div style={{fontSize: '15px'}}> - Fill forms with the interface provided</div>
              <div style={{fontSize: '15px'}}> - Prefer filling with a pen. No worries we got it for you.</div>
              <div style={{fontSize: '15px'}}> - Fill your form, scan it and access your responses on mobile app.</div>
              <div style={{fontSize: '15px'}}> - You think our AI failed, not pretty much but still for minor changes, you get the changes to validate and modify response once you're done scanning.</div>
            </div>
          </div>
          <div style={{marginTop: '20px', marginBottom: '10px', fontSize: '20px'}}>Scan to use the app</div>
          <img src={qr} alt="" width={250} height={250}/>

        </div>
        <div onTransitionEnd={() => setShowNew(true)} className={`right-content ${isFormMoved ? 'move-left' : showNew ? 'move-again' : ''}`}>
          <div className='right-head' style={{textAlign: 'center'}}>Select a form to view responses</div>
          {Object.keys(forms).map((key, index) => {
            return (
              <div key={index} className={`right-modal ${forms[key].active ? 'active-form' : ''}`} onClick={() => selectForm(forms[key])}>
                <div style={{ fontWeight: 600, fontSize: '18px' }}>{forms[key].name}</div>
                <div style={{ fontSize: '15px' }}>{forms[key].description}</div>
              </div>
            )
          })}
        </div>
        {isFormMoved && <div className='response-list'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className='right-head' style={{ marginLeft: '25px' }}>{`Responses for ${selectedForm.name}`} </div>
            <div style={{ display: 'flex' }}>
              <button className='print-form-button' onClick={printForm}>Print Form</button>
              <button className='view-excel-button' onClick={viewExcel}>View Excel</button>
            </div>

          </div>

          {Object.keys(responses).map((key, index) => {
            if (key !== '-1')
              return (
                <div key={index} className='right-modal' style={{ marginLeft: '25px' }} onClick={() => viewPdf(key)}>
                  <div style={{ fontWeight: 600 }}>{responses[key].name}</div>
                  <div style={{ fontSize: '12px' }}>{responses[key].date}</div>
                </div>
              )
          })}
        </div>}
      </div>
      {pdfKey !== '' &&
        <OpenPdf fileKey={pdfKey} />
      }
      <div style={{ height: isFormMoved ? '100vh' : '' }} ref={excelRef}>
        {excelKey !== '' && <OpenExcel fileKey={excelKey} />}
      </div>

    </>
  );
}

export default App;
