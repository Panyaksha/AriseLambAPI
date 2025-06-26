// pages/index.js
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../lib/firebaseClient";
import Sidebar from "../../components/Sidebar";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


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
    
    setFilteredUsers(results);
  }, [searchTerm, users]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-400"></div>
        <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-4 border-blue-400/30"></div>
        <div className="mt-4 text-center">
          <p className="text-gray-300 text-sm font-medium">Memuat data...</p>
        </div>
      </div>
    </div>
  );

  if (!users.length) return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl text-center border border-gray-700">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Tidak ada data pengguna</h1>
        <p className="text-gray-400">Belum ada pengguna yang terdaftar dalam sistem.</p>
      </div>
    </div>
  );

  return (
    <main className="ml-[64px] min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <Sidebar />
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent sm:text-5xl">
            Daftar Pengguna & Riwayat Saran
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
            Manajemen data pengguna dan riwayat rekomendasi kesehatan dengan antarmuka modern
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl mb-8 border border-gray-700">
          <div className="max-w-md mx-auto">
            {/* Search Filter */}
            <div className="space-y-2">
              <label htmlFor="search" className="block text-sm font-semibold text-gray-300">
                🔍 Cari Pengguna
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Nama atau email..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">
                Menampilkan <span className="text-white font-semibold">{filteredUsers.length}</span> dari <span className="text-white font-semibold">{users.length}</span> pengguna
              </span>
            </div>
            {filteredUsers.length > 0 && (
              <div className="text-xs text-gray-500">
                Data diperbarui secara real-time
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-6">
          {filteredUsers.length === 0 ? (
            <div className="bg-gray-800 p-12 rounded-2xl shadow-2xl text-center border border-gray-700">
              <div className="w-20 h-20 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Tidak ada hasil yang cocok</h3>
              <p className="text-gray-400">Coba ubah kriteria filter Anda untuk menemukan pengguna</p>
            </div>
          ) : (
            filteredUsers.map(u => (
              <div key={u.uid} className="bg-gradient-to-r from-gray-800 to-gray-800 overflow-hidden shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-3xl hover:scale-[1.02] border border-gray-700">
                {/* User Header */}
                <div className="px-6 py-5 border-b border-gray-700 bg-gradient-to-r from-gray-700 to-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {u.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{u.name}</h2>
                        <p className="text-gray-400 text-sm">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        {u.saranList.length} saran
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* User Details */}
                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400">Gender</p>
                          <p className="text-sm text-white font-medium capitalize">{u.gender}</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center mt-1">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-400">Pola Makan Utama</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {u.pola_makan.length ? u.pola_makan.map((diet, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                {diet}
                              </span>
                            )) : (
                              <span className="text-gray-500 text-sm">-</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-300">Health Recommendation</p>
                    </div>
                    <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">
                      {u.health_recommendation}
                    </p>
                  </div>
                </div>

                {/* History Section */}
                <div className="bg-gray-700/30 px-6 py-4 border-t border-gray-700">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer list-none hover:bg-gray-700/50 p-3 rounded-xl transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-200">Riwayat Saran ({u.saranList.length})</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </summary>
                    
                    <div className="mt-4 space-y-4">
                      {u.saranList.map(s => (
                        <div key={s.id} className="bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-600 hover:border-gray-500 transition-all duration-200">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-400">Tanggal</p>
                                <p className="text-sm text-white font-medium">
                                  {new Date(s.tanggal).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-400">Gejala</p>
                                <p className="text-sm text-white font-medium">{s.gejala}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-yellow-500 rounded-lg flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-400">Durasi</p>
                                <p className="text-sm text-white font-medium">{s.durasi}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                </svg>
                              </div>
                              <p className="text-xs font-semibold text-gray-300">Pola Makan Pemicu</p>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {s.pola_makan.length ? s.pola_makan.map((diet, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  {diet}
                                </span>
                              )) : (
                                <span className="text-gray-500 text-sm">-</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                              </div>
                              <p className="text-xs font-semibold text-gray-300">Saran</p>
                            </div>
                            <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">
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