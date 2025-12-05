// Import hooks dari React untuk state management dan side effects
import { useState, useEffect } from "react";
// Import axios untuk melakukan HTTP request ke API
import axios from "axios";
// Import Navlink untuk navigasi antar route
import { NavLink } from "react-router-dom";
import Swal  from "sweetalert2";


export default function MenuList() {
  // State untuk menyimpan data menu dari API
  const [menu, setMenu] = useState([]);
  // State untuk menandakan proses loading data
  const [loading, setLoading] = useState(true);
  // State untuk menyimpan pesan error jika terjadi kesalahan
  const [error, setError] = useState(null);

    // Fungsi untuk delete
  const handleDelete = (id, namaMenu) => {
    Swal.fire({
  title: "Are you sure wanna delete " + namaMenu + "?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
  }).then((result) => {
  if (result.isConfirmed) {
    axios.delete(`https://tugas-2-paw-2.vercel.app/api/menu/${id}`).then((response) => {
      //Hapus menu 
      setMenu(menu.filter((f) => f.id !== id));
      // Tampilkan notifikasi sukses
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    }).catch((error) => {
      console.error("Error deleting data:", error); //Menangani error
      Swal.fire(
        "Error",
        "There was an issue deleting the data.",
        "error"
        );
      });
    };
    });
  };

  // useEffect akan dijalankan sekali saat komponen pertama kali di-render
  useEffect(() => {
    // Fungsi async untuk fetch data dari API
    const fetchMenu = async () => {
      try {
        // Set loading true sebelum fetch data
        setLoading(true);
        // Mengambil data dari API menggunakan axios
        const response = await axios.get(
          "https://tugas-2-paw-2.vercel.app/api/menu"
        );
        // Simpan data yang diterima ke state fakultas
        setMenu(response.data);
        // Reset error jika fetch berhasil
        setError(null);
      } catch (err) {
        // Jika terjadi error, simpan pesan error ke state
        setError(err.message);
        console.error("Error fetching menu:", err);
      } finally {
        // Set loading false setelah proses selesai (berhasil atau gagal)
        setLoading(false);
      }
    };

    // Panggil fungsi fetchFakultas
    fetchMenu();
  }, []); // Dependency array kosong = hanya dijalankan sekali saat mount

  // Tampilkan pesan loading jika data masih diambil
  if (loading) return <div>Loading...</div>;
  // Tampilkan pesan error jika ada kesalahan
  if (error) return <div>Error: {error}</div>;

  // Render tabel fakultas jika data sudah tersedia
  return (
    <div>
      <h1>Menu List</h1>
      <NavLink to="/menu/create" className="btn btn-primary mb-3">
        Tambah Menu
      </NavLink>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Nama Menu</th>
            <th>Harga</th>
            <th>Rating</th>
            <th>kategori</th>
            <th>Edit</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop data fakultas dan tampilkan dalam baris tabel */}
          {menu.map((menu) => (
            // key={fak._id} untuk identifikasi unik setiap baris
            <tr key={menu._id}>
              <td>{menu.namaMenu}</td>
              <td>{menu.harga}</td>
              <td>{menu.rating}</td>
              <td>{menu.kategori_id ? menu.kategori_id.kategoriMenu : null}</td>
              <NavLink to={`/menu/edit/${menu._id}`} className="btn btn-warning me-2">Edit</NavLink>
              <td><button className="btn btn-danger" onClick={() => handleDelete(menu._id, menu.namaMenu)}>Hapus</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
