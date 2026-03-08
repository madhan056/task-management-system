import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MessageList() {
  const [messages, setMessages] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [recipient, setRecipient] = useState('');
  const [text, setText] = useState('');

  const fetchMessages = async (status = '') => {
    try {
      const response = await axios.get(
        'http://localhost:8000/api/messages/',
        { params: status ? { status } : {} }
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleFilterChange = (e) => {
    const selected = e.target.value;
    setFilterStatus(selected);
    fetchMessages(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/api/messages/', {
        recipient_number: recipient,
        message_text: text
      });

      setRecipient('');
      setText('');
      fetchMessages(filterStatus);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>WhatsApp Message Tracker</h2>

      {/* SEND MESSAGE FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
  placeholder="Recipient Number"
  value={recipient}
  onChange={(e) => setRecipient(e.target.value)}
/>

        <input
          type="text"
          placeholder="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <button type="submit">Send Message</button>
      </form>

      <label>Filter by status: </label>
      <select value={filterStatus} onChange={handleFilterChange}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="sent">Sent</option>
        <option value="failed">Failed</option>
      </select>

      <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Recipient</th>
            <th>Message</th>
            <th>Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {messages.map(msg => (
            <tr key={msg.id}>
              <td>{msg.recipient_number}</td>
              <td>{msg.message_text}</td>
              <td>{new Date(msg.timestamp).toLocaleString()}</td>
              <td>{msg.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MessageList;