// pages/index.js
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../lib/firebaseClient";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [dietFilter, setDietFilter] = useState("all");

  useEffect(() => {
    async function fetchUsers() {
      const snap = await get(ref(db, "users"));
      const data = snap.exists() ? snap.val() : {};
      const arr = Object.entries(data).map(([uid, v]) => ({
        uid,
        ...v,
        pola_makan: v.pola_makan ? Object.values(v.pola_makan) : [],
        saranList: v.saran
          ? Object.entries(v.saran).map(([id, s]) => ({
              id,
              ...s,
              pola_makan: s.pola_makan ? Object.values(s.pola_makan) : []
            }))
          : []
      }));
      setUsers(arr);
      setFilteredUsers(arr);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    let results = users;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply gender filter
    if (genderFilter !== "all") {
      results = results.filter(user => user.gender === genderFilter);
    }
    
    // Apply diet filter
    if (dietFilter !== "all") {
      results = results.filter(user => 
        user.pola_makan.some(diet => diet.toLowerCase().includes(dietFilter.toLowerCase()))
      );
    }
    
    setFilteredUsers(results);
  }, [searchTerm, genderFilter, dietFilter, users]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!users.length) return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tidak ada data pengguna</h1>
        <p className="text-gray-600">Belum ada pengguna yang terdaftar dalam sistem.</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Daftar Pengguna & Riwayat Saran
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Manajemen data pengguna dan riwayat rekomendasi kesehatan
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Filter */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Cari Pengguna
              </label>
              <input
                type="text"
                id="search"
                placeholder="Nama atau email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Gender Filter */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Filter Gender
              </label>
              <select
                id="gender"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="all">Semua Gender</option>
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
            </div>
            
            {/* Diet Filter */}
            <div>
              <label htmlFor="diet" className="block text-sm font-medium text-gray-700 mb-1">
                Filter Pola Makan
              </label>
              <select
                id="diet"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={dietFilter}
                onChange={(e) => setDietFilter(e.target.value)}
              >
                <option value="all">Semua Pola Makan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten">Gluten Free</option>
                <option value="dairy">Dairy Free</option>
                {/* Add more diet options as needed */}
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-500">
            Menampilkan {filteredUsers.length} dari {users.length} pengguna
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-6">
          {filteredUsers.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-medium text-gray-900">Tidak ada hasil yang cocok</h3>
              <p className="mt-2 text-gray-500">Coba ubah kriteria filter Anda</p>
            </div>
          ) : (
            filteredUsers.map(u => (
              <div key={u.uid} className="bg-white overflow-hidden shadow rounded-lg transition-all hover:shadow-lg">
                <div className="px-6 py-5 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">{u.name}</h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {u.saranList.length} saran
                    </span>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-sm text-gray-900">{u.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Gender</p>
                      <p className="mt-1 text-sm text-gray-900 capitalize">{u.gender}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Pola Makan Utama</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {u.pola_makan.length ? u.pola_makan.join(", ") : "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Health Recommendation</p>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                      {u.health_recommendation}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="text-sm font-medium text-gray-700">Riwayat Saran</span>
                      <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </summary>
                    
                    <div className="mt-4 space-y-4">
                      {u.saranList.map(s => (
                        <div key={s.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-xs font-medium text-gray-500">Tanggal</p>
                              <p className="mt-1 text-sm text-gray-900">
                                {new Date(s.tanggal).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500">Gejala</p>
                              <p className="mt-1 text-sm text-gray-900">{s.gejala}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500">Durasi</p>
                              <p className="mt-1 text-sm text-gray-900">{s.durasi}</p>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-500">Pola Makan Pemicu</p>
                            <p className="mt-1 text-sm text-gray-900">
                              {s.pola_makan.length ? s.pola_makan.join(", ") : "-"}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-xs font-medium text-gray-500">Saran</p>
                            <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                              {s.saran}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}