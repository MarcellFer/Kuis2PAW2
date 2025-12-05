// Import useState dan useEffect untuk mengelola state dan side effects
import { useState, useEffect } from "react";
// Import axios untuk melakukan HTTP request
import axios from "axios";
// Import useNavigate untuk navigasi dan useParams untuk mengambil parameter URL
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditMenu() {
  // useNavigate hook untuk redirect
  const navigate = useNavigate();
  // useParams hook untuk mengambil id dari URL
  const { id } = useParams();

  // State untuk menyimpan nilai input form
  const [formData, setFormData] = useState({
    namaMenu: "",
    harga: "",
    rating: "",
    kategori_id: "",
  });

  // State untuk menyimpan data kategori
  const [kategori, setKategori] = useState([]);

  // State untuk menyimpan pesan error
  const [error, setError] = useState(null);

  // State untuk menandakan proses loading
  const [loading, setLoading] = useState(false);

  // State untuk menandakan proses loading saat fetch data
  const [isLoadingData, setIsLoadingData] = useState(true);

  // useEffect untuk fetch data menu berdasarkan id
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoadingData(true);
        const response = await axios.get(
          `https://tugas-2-paw-2.vercel.app/api/menu/${id}`
        );
        // Set data ke form
        setFormData({
          namaMenu: response.data.namaMenu,
          harga: response.data.harga,
          rating: response.data.rating,
          kategori_id: response.data.kategori_id?._id || response.data.kategori_id,
        });
        setError(null);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Terjadi kesalahan saat mengambil data"
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchMenu();
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
    if (!formData.namaMenu || !formData.harga || !formData.rating || !formData.kategori_id) {
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
        `https://tugas-2-paw-2.vercel.app/api/menu/${id}`,
        {
          namaMenu: formData.namaMenu,
          harga: formData.harga,
          rating: formData.rating,
          kategori_id: formData.kategori_id
        }
      );

      console.log("Menu updated:", response.data);
      
      // Tampilkan notifikasi sukses
      Swal.fire({
        title: "Berhasil!",
        text: "Data menu berhasil diperbarui.",
        icon: "success"
      });

      // Redirect ke halaman list menu
      navigate("/menu");
    } catch (err) {
      console.error("Error updating menu:", err);
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
      <h2 className="mb-4">Edit Menu</h2>

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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          >
            <option value="">Pilih Kategori</option>
            {kategori.map((kat) => (
              <option key={kat._id} value={kat._id}>
                {kat.kategoriMenu}
              </option>
            ))}
          </select>
        </div>

        {/* Tombol submit */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Mengupdate..." : "Update"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/menu")}
            disabled={loading}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
