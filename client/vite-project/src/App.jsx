import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";

function YourComponent() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [selectedPhoneBookEntry, setSelectedPhoneBookEntry] = useState(null);
  const [phoneBookEntries, setPhoneBookEntries] = useState([]);
  const [showAddEntryButton, setShowAddEntryButton] = useState(true);

  useEffect(() => {
    fetchPhoneBookEntries();
  }, []);

  const fetchPhoneBookEntries = async () => {
    try {
      const response = await axios.get('http://localhost:8084/phone-entries');
      setPhoneBookEntries(response.data.data);
    } catch (error) {
      console.error('Error fetching phone book entries:', error);
    }
  };

  const addNewPhoneBookEntry = async () => {
    if (!name || !phoneNumber || !email || !rollNumber) {
      alert("All fields are required");
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      alert("Invalid phone number format");
      return;
    }

    if (!isValidRollNumber(rollNumber)) {
      alert('Invalid roll number. It must be at least 10 alphanumeric characters.');
      return;
    }

    if (!isValidEmail(email)) {
      alert("Invalid email format");
      return;
    }

    if (phoneBookEntries.some(entry => entry.name === name)) {
      alert("Duplicate name. Please enter a unique name.");
      return;
    }

    const newEntry = { name, phoneNumber, email, rollNumber };
    try {
      const response = await axios.post('http://localhost:8084/add-phone', newEntry);
      setPhoneBookEntries([...phoneBookEntries, response.data.data]);
      clearForm();
    } catch (error) {
      console.error('Error adding new phone book entry:', error);
    }
  };

  const updatePhoneBookEntry = async (entryToUpdate) => {
    if (!name || !phoneNumber || !email || !rollNumber) {
      alert("All fields are required");
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      alert("Invalid phone number format");
      return;
    }

    if (!isValidRollNumber(rollNumber)) {
      alert("Invalid roll number. It must be at least 10 alphanumeric characters.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Invalid email format");
      return;
    }

    const updatedEntry = { name, phoneNumber, email, rollNumber };
    try {
      const response = await axios.patch(`http://localhost:8084/update-phone/${entryToUpdate._id}`, updatedEntry);
      setPhoneBookEntries(phoneBookEntries.map(entry =>
        entry._id === entryToUpdate._id ? response.data.data : entry
      ));
      clearForm();
      setSelectedPhoneBookEntry(null);
      setShowAddEntryButton(true);
    } catch (error) {
      console.error('Error updating phone book entry:', error);
    }
  };

  const deletePhoneBookEntry = async (id) => {
    try {
      await axios.delete(`http://localhost:8084/delete-phone/${id}`);
      setPhoneBookEntries(phoneBookEntries.filter(entry => entry._id !== id));
    } catch (error) {
      console.error('Error deleting phone book entry:', error);
    }
  };

  const handleSelectEntry = (entry) => {
    setSelectedPhoneBookEntry(entry);
    setShowAddEntryButton(false);
    setName(entry.name);
    setPhoneNumber(entry.phoneNumber);
    setEmail(entry.email);
    setRollNumber(entry.rollNumber);
  };

  const clearForm = () => {
    setName('');
    setPhoneNumber('');
    setEmail('');
    setRollNumber('');
  };

  const isValidPhoneNumber = (phoneNumber) => {
    return /^\d{10}$/.test(phoneNumber);
  };

  const isValidRollNumber = (rollNumber) => {
    return /^[A-Za-z0-9]{10,}$/.test(rollNumber);
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="container">
      <div className="inputs">
        <h1 className="loo">Student Details</h1>

        <label className="default" htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br />

        <label className="default" htmlFor="phoneNumber">Phone Number:</label>
        <input type="text" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /><br />

        <label className="default" htmlFor="email">Email:</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />

        <label className="default" htmlFor="rollNumber">Roll Number:</label>
        <input type="text" id="rollNumber" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} /><br />

        {showAddEntryButton && (
          <button className="button" onClick={addNewPhoneBookEntry}>Add New Entry</button>
        )}
        {selectedPhoneBookEntry && (
          <button className="button" onClick={() => updatePhoneBookEntry(selectedPhoneBookEntry)}>Update Selected Entry</button>
        )}
      </div>

      <div className="entries">
        <h2 className="loo">Student Entries</h2>
        <ul>
          {phoneBookEntries.map((entry, index) => (
            <li key={entry._id}>
              <div className="default">Name: {entry.name}</div>
              <div className="default">Roll Number: {entry.rollNumber}</div>
              <div className="entry-buttons">
                <button className="button" onClick={() => handleSelectEntry(entry)}>Update</button>
                <button className="button" onClick={() => deletePhoneBookEntry(entry._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default YourComponent;
