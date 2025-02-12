import { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function App() {
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(false);
  const [EmailList, setEmailList] = useState([]);

  const handlemsg = (e) => {
    setMsg(e.target.value);
  };

  const handlefile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });

      const totalEmail = emailList.map((data) => data.A);
      setEmailList(totalEmail);
    };
    reader.readAsArrayBuffer(file);
  };

  const handlesend = () => {
    setStatus(true);
    axios
      .post('http://localhost:5000/mail', { msg: msg, EmailList: EmailList })
      .then((data) => {
        if (data.data === true) {
          alert('Email message was sent successfully');
          setStatus(false);
        } else {
          alert('Email send failed');
        }
      });
  };

  return (
    <div>
      <textarea onChange={handlemsg} value={msg} placeholder="Enter your email message here..." />
      <input type="file" onChange={handlefile} />
      <p>Total Emails in the File: {EmailList.length}</p>
      <button onClick={handlesend}>
        {status ? "Sending..." : "Send"}
      </button>
    </div>
  );
}

export default App;
