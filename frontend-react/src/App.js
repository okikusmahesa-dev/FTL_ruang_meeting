import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    unit: '',
    ruang: '',
    kapasitas: '',
    tanggal_rapat: '',
    waktu: '',
    jumlah_peserta: '',
    jenis_konsumsi: ''
  });

  const fetchItems = async () => {
    try {
      const res = await fetch('http://localhost:5000/ruang_meeting');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Gagal mengambil data:", err.message);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/ruang_meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchItems();
      setForm({
        unit: '',
        ruang: '',
        kapasitas: '',
        tanggal_rapat: '',
        waktu: '',
        jumlah_peserta: '',
        jenis_konsumsi: ''
      });
    } catch (err) {
      console.error("Gagal menambah data:", err.message);
    }
  };

  return (
    <div>
      <h1>CRUD Ruang Meeting</h1>
      <form onSubmit={handleSubmit}>
        <input name="unit" placeholder="Unit" value={form.unit} onChange={handleChange} />
        <input name="ruang" placeholder="Ruang" value={form.ruang} onChange={handleChange} />
        <input name="kapasitas" placeholder="Kapasitas" value={form.kapasitas} onChange={handleChange} />
        <input name="tanggal_rapat" placeholder="Tanggal Rapat" value={form.tanggal_rapat} onChange={handleChange} />
        <input name="waktu" placeholder="Waktu" value={form.waktu} onChange={handleChange} />
        <input name="jumlah_peserta" placeholder="Jumlah Peserta" value={form.jumlah_peserta} onChange={handleChange} />
        <input name="jenis_konsumsi" placeholder="Jenis Konsumsi" value={form.jenis_konsumsi} onChange={handleChange} />
        <button type="submit">Tambah</button>
      </form>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Ruang</th>
            <th>Kapasitas</th>
            <th>Tanggal Rapat</th>
            <th>Waktu</th>
            <th>Jumlah Peserta</th>
            <th>Jenis Konsumsi</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, index) => (
            <tr key={index}>
              <td>{row.unit}</td>
              <td>{row.ruang}</td>
              <td>{row.kapasitas}</td>
              <td>{row.tanggal_rapat}</td>
              <td>{row.waktu}</td>
              <td>{row.jumlah_peserta}</td>
              <td>{row.jenis_konsumsi}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
