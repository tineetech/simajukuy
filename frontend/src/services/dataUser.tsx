import { useEffect, useState } from "react";

export interface UserData {
    username?: string;
    email?: string;
    user_id?: number;
    id?: number;
    avatar?: string;
    // properti lain
  }

const DataUser = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('fa');
  const token = localStorage.getItem('authToken') ?? '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
    //   setError(null);

      if (token === '') {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_USER_SERVICE}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorMessage = await response.json() || `Gagal mendapatkan data: Status ${response.status}`;
          
          // setError(errorMessage);
          // Swal.fire({
          //   title: "Gagal Mendapatkan Data",
          //   text: errorMessage,
          //   icon: "error",
          // });
          console.log(errorMessage)
        } else {
          const resData = await response.json();
          setData(resData.results ? resData.results[0] : resData); // Menangani jika 'results' tidak ada
        }
      } catch (e) {
        console.error("Error fetching user data:", e);
        // setError("Terjadi kesalahan saat menghubungi server.");
        // Swal.fire({
        //   title: "Gagal Mendapatkan Data",
        //   text: "Terjadi kesalahan saat menghubungi server.",
        //   icon: "error",
        // });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]); // Hanya jalankan fetch jika token berubah

  return { data, loading };
};

export default DataUser;