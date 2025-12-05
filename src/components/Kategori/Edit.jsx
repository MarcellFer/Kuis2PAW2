// Import useState dan useEffect untuk mengelola state dan side effects
import { useState, useEffect } from "react";
// Import axios untuk melakukan HTTP request
import axios from "axios";
// Import useNavigate untuk navigasi dan useParams untuk mengambil parameter URL
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditKategori() {
  // useNavigate hook untuk redirect
  const navigate = useNavigate();
  // useParams hook untuk mengambil id dari URL
  const { id } = useParams();

  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    kategoriMenu: "",
    deskripsi: "",
  });

  // State untuk menyimpan pesan error
  const [error, setError] = useState(null);

  // State untuk menandakan proses loading
  const [loading, setLoading] = useState(false);

  // State untuk menandakan proses loading saat fetch data
  const [isLoadingData, setIsLoadingData] = useState(true);

  // useEffect untuk fetch data kategori berdasarkan id
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        setIsLoadingData(true);
        const response = await axios.get(
          `https://tugas-2-paw-2.vercel.app/api/kategori/${id}`
        );
        // Set data ke form
        setFormData({
          kategoriMenu: response.data.kategoriMenu,
          deskripsi: response.data.deskripsi,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching kategori:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Terjadi kesalahan saat mengambil data"
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchKategori();
  }, [id]); // Dependency array berisi id, akan dijalankan ulang jika id berubah

  // Fungsi untuk handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Fungsi untuk handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!formData.kategoriMenu || !formData.deskripsi) {
      setError("Semua field harus diisi!");
      return;
    }

    // Tandai proses pengiriman data ke API
    setLoading(true);
    // Reset error
    setError(null);

    try {
      // Kirim patch request ke API untuk update data
      const response = await axios.patch(
        `https://tugas-2-paw-2.vercel.app/api/kategori/${id}`,
        {
          kategoriMenu: formData.kategoriMenu,
          deskripsi: formData.deskripsi,
        }
      );

      console.log("Kategori updated:", response.data);
      
      // Tampilkan notifikasi sukses
      Swal.fire({
        title: "Berhasil!",
        text: "Data kategori berhasil diperbarui.",
        icon: "success"
      });

      // Redirect ke halaman list menu
      navigate("/kategori");
    } catch (err) {
      console.error("Error updating kategori:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat mengupdate data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Tampilkan loading saat data sedang diambil
  if (isLoadingData) {
    return <div className="container-fluid mt-5">Loading...</div>;
  }

  // Render form edit
  return (
    <div className="container-fluid mt-5">
      <h2 className="mb-4">Edit Kategori</h2>

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

      {/* Form untuk input data kategori */}
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
            disabled={loading}
          />
        </div>

        {/* Input field untuk deskripsi */}
        <div className="mb-3">
          <label htmlFor="deskripsi" className="form-label">
            Deskripsi
          </label>
          <textarea
            className="form-control"
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            placeholder="Contoh: Kategori untuk makanan utama"
            disabled={loading}
            rows="3"
          />
        </div>

        {/* Tombol submit */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Mengupdate..." : "Update"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/kategori")}
            disabled={loading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}