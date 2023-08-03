import React, { useEffect, useState } from 'react';
import FileSaver from 'file-saver';
import './table.css';
import axios from 'axios';
const XLSX = require('xlsx');

function OpenExcel({ fileKey }) {
  const [data, setData] = useState([]);
  const [cols, setCols] = useState([]);
  useEffect(() => {
    axios.get(fileKey, {
      responseType: 'arraybuffer'
    }).then((response) => {
      const binaryData = response.data;
      const wb = XLSX.read(binaryData, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const _data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setData(_data.slice(1));
      setCols(
        _data[0].map((col) => {
          return {
            name: col,
            key: col.toLowerCase().replace(/ /g, '_'),
          };
        })
      );
    }).catch((err) => {
      console.log(err)
      window.alert('Something went wrong. Please try again.')
    })
  }, [fileKey])

  console.log(data)
  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([cols.map((col) => col.name), ...data]);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'excel_sheet.xlsx');
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  return (
    <>
      <div  className="table-container">

        {/* <input type="file" onChange={handleChange} /> */}
        <div className="table-scrollable">
          <table className="table-bordered">
            <thead>
              <tr>
                {cols.map((col) => (
                  <th key={col.key}>{col.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {cols.map((col, colIndex) => (
                    <td key={colIndex}>{row[colIndex]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {data.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className='download-excel-button' onClick={handleDownload}>Download Excel Sheet</button>
        </div>
      )}</>
  );
}
export default OpenExcel;