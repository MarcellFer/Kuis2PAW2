// Import React untuk membuat komponen
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CreateMenu() {

  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    namaMenu: "",
    harga: "",
    rating: "",
    kategori_id: "",
  });

  // State untuk menyimpan data kategori
  const [kategori, setKategori] = useState([]);

  // Fungsi untuk handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // State untuk menyimpan pesan error
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch kategori data saat komponen mount
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const response = await axios.get(
          "https://tugas-2-paw-2.vercel.app/api/kategori"
        );
        setKategori(response.data);
      } catch (err) {
        console.error("Error fetching kategori:", err);
      }
    };
    fetchKategori();
  }, []);

  // Fungsi untuk handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!formData.namaMenu || !formData.harga || !formData.rating || !formData.kategori_id) {
      setError("Semua field harus diisi!");
      return;
    }

    // Reset error
    setError(null);
    setLoading(true);

    try {
      // Kirim POST request ke API
      const response = await axios.post(
        "https://tugas-2-paw-2.vercel.app/api/menu",
        formData
      );

      console.log("Menu created:", response.data);
      
      // Tampilkan notifikasi sukses
      Swal.fire({
        title: "Berhasil!",
        text: "Data menu berhasil disimpan.",
        icon: "success"
      });

      // Reset form setelah berhasil
      setFormData({
        namaMenu: "",
        harga: "",
        rating: "",
        kategori_id: "",
      });
    } catch (err) {
      console.error("Error creating menu:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat menyimpan data"
      );
    } finally {
      setLoading(false);
    }
  };

    // Simulasi berhasil
    // alert("Validasi berhasil! Data siap dikirim.");
    // console.log("Data yang akan dikirim:", formData);
    // };

  // Render form sederhana
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Tambah Menu</h2>

       {/* Tampilkan pesan error jika ada */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

        {/* Tampilkan state untuk debugging */}
        <div className="alert alert-info">
        <strong>State saat ini:</strong>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>

      {/* Form untuk input data fakultas */}
      <form onSubmit={handleSubmit}>
        {/* Input field untuk nama menu */}
        <div className="mb-3">
          <label htmlFor="namaMenu" className="form-label">
            Nama Menu
          </label>
          <input
            type="text"
            className="form-control"
            id="namaMenu"
            name="namaMenu"
            value={formData.namaMenu}
            onChange={handleChange}
            placeholder="Contoh: Nasi Goreng"
          />
        </div>

        {/* Input field untuk harga */}
        <div className="mb-3">
          <label htmlFor="harga" className="form-label">
            Harga
          </label>
          <input
            type="number"
            className="form-control"
            id="harga"
            name="harga"
            value={formData.harga}
            onChange={handleChange}
            placeholder="Contoh: 50000"
          />
        </div>

        {/* Input field untuk rating */}
        <div className="mb-3">
          <label htmlFor="rating" className="form-label">
            Rating
          </label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="Contoh: 4.5"
            min="0"
            max="5"
          />
        </div>

        {/* Select field untuk kategori */}
        <div className="mb-3">
          <label htmlFor="kategori_id" className="form-label">
            Kategori
          </label>
          <select
            className="form-control"
            id="kategori_id"
            name="kategori_id"
            value={formData.kategori_id}
            onChange={handleChange}
          >
            <option value="">Pilih Kategori</option>
            {kategori.map((kat) => (
              <option key={kat._id} value={kat._id}>
                {kat.kategoriMenu}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/menu")}
            disabled={loading}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}