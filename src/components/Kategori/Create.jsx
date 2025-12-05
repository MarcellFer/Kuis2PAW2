// Import React untuk membuat komponen
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CreateKategori() {

  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    kategoriMenu: "",
    deskripsi: "",
  });


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

  // Fungsi untuk handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!formData.kategoriMenu || !formData.deskripsi) {
      setError("Semua field harus diisi!");
      return;
    }

    // Reset error
    setError(null);
    setLoading(true);

    try {
      // Kirim POST request ke API
      const response = await axios.post(
        "https://tugas-2-paw-2.vercel.app/api/kategori",
        formData
      );

      console.log("Kategori created:", response.data);
      
      // Tampilkan notifikasi sukses
      Swal.fire({
        title: "Berhasil!",
        text: "Data kategori berhasil disimpan.",
        icon: "success"
      });

      // Reset form setelah berhasil
      setFormData({
        kategoriMenu: "",
        deskripsi: "",
      });
    } catch (err) {
      console.error("Error creating kategori:", err);
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
      <h2 className="mb-4">Tambah Kategori</h2>

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
        {/* Input field untuk nama kategori menu */}
        <div className="mb-3">
          <label htmlFor="kategoriMenu" className="form-label">
            Kategori Menu
          </label>
          <input
            type="text"
            className="form-control"
            id="kategoriMenu"
            name="kategoriMenu"
            value={formData.kategoriMenu}
            onChange={handleChange}
            placeholder="Contoh: Makanan"
          />
        </div>

        {/* Input field untuk deskripsi */}
        <div className="mb-3">
          <label htmlFor="deskripsi" className="form-label">
            Deskripsi
          </label>
          <input
            type="text"
            className="form-control"
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            placeholder="Contoh: Kategori untuk makanan utama"
            rows="3"
          />
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/kategori")}
            disabled={loading}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}