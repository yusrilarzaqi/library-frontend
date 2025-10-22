// src/components/organisms/Dashboard.jsx
import { useEffect, useState } from 'react';
import borrowService from '../../services/borrowService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { toast } from 'react-toastify';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const StatCard = ({ title, value, subtitle, icon, color = "blue", trend }) => {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    orange: "border-orange-200 bg-orange-50",
    purple: "border-purple-200 bg-purple-50",
    red: "border-red-200 bg-red-50",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-600"
  }

  const icons = {
    user: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    books: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    borrowed: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
    returned: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    transaction: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    )
  }

  return (
    <div className={`border rounded-lg p-6 shadow-sm ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-1 text-xs ${trend.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value > 0 ? '↗' : '↘'} {Math.abs(trend.value)}%
              <span className="text-gray-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color].split(' ')[2]}`}>
          {icons[icon]}
        </div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [selectedRange, setSelectedRange] = useState("today");
  const [ranges, setRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRange();
  }, []);

  useEffect(() => {
    if (selectedRange) {
      fetchStats(selectedRange);
    }
  }, [selectedRange]);

  const fetchRange = async () => {
    try {
      const response = await borrowService.getRange();
      setRanges(response.data);
    } catch (error) {
      toast.error(`Failed to fetch range: ${error.message}`);
    }
  }

  const fetchStats = async (range) => {
    try {
      setLoading(true);
      setError("");
      const response = await borrowService.getStats(range);
      setStats(response.data);
    } catch (error) {
      setError(error.message);
      toast.error(`Failed to fetch stats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value);
  };

  // Process data from transaction chart
  const getTransactionChartData = () => {
    if (!stats) return null;

    if (selectedRange === "all") {
      // monthly data for alltime
      const monthlyGrouped = stats.monthlyData.reduce((acc, curr) => {
        const month = curr._id.month;
        if (!acc[month]) {
          acc[month] = { borrowed: 0, returned: 0 }
        }
        if (curr._id.status === "borrowed") {
          acc[month].borrowed += 1;
        } else {
          acc[month].returned += 1;
        }
        return acc;
      }, {});
      const labels = Object.keys(monthlyGrouped).sort();
      const borrwedData = labels.map(month => monthlyGrouped[month].borrowed);
      const returnedData = labels.map(month => monthlyGrouped[month].returned);

      return {
        labels,
        datasets: [
          {
            label: "Buku Dipinjam",
            data: borrwedData,
            backgroundColor: "rgba(249, 115, 22, 0.6)",
            borderColor: "rgba(249, 115, 22, 1)",
            borderWidth: 2,
          },
          {
            label: "Buku Dikembalikan",
            data: returnedData,
            backgroundColor: "rgba(16, 185, 129, 0.6)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 2,
          },
        ],
      };
    } else {
      // Daily data for other range
      const dailyGrouped = stats.dailyData.reduce((acc, item) => {
        const date = item._id.date;
        if (!acc[date]) {
          acc[date] = { borrowed: 0, returned: 0 };
        }
        if (item._id.status === "borrowed") {
          acc[date].borrowed = item.count;
        } else if (item._id.status === "returned") {
          acc[date].returned = item.count;
        }
        return acc;
      }, {});

      const labels = Object.keys(dailyGrouped).sort();
      const borrowedData = labels.map(date => dailyGrouped[date].borrowed);
      const returnedData = labels.map(date => dailyGrouped[date].returned);

      return {
        labels,
        datasets: [
          {
            label: "Buku Dipinjam",
            data: borrowedData,
            backgroundColor: "rgba(249, 115, 22, 0.6)",
            borderColor: "rgba(249, 115, 22, 1)",
            borderWidth: 2,
          },
          {
            label: "Buku Dikembalikan",
            data: returnedData,
            backgroundColor: "rgba(16, 185, 129, 0.6)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 2,
          },
        ],
      };
    }
  }

  // Process data for popular books chart
  const getPopularBooksChartData = () => {
    if (!stats || !stats.popularBooks) return null;

    return {
      labels: stats.popularBooks.map(book => book.title),
      datasets: [
        {
          label: 'Jumlah Dipinjam',
          data: stats.popularBooks.map(book => book.borrowCount),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const getRangeLabel = (value) => {
    const range = ranges.find(r => r.value === value)
    return range ? range.label : value
  }



  if (loading && !stats) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Memuat dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">📊 Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">
            Statistik lengkap peminjaman buku, pengguna, dan koleksi
          </p>
        </div>

        {/* Range Selector */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="w-full sm:w-64">
              <label htmlFor="range-select" className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Periode
              </label>
              <select
                id="range-select"
                value={selectedRange}
                onChange={handleRangeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                {ranges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <p className="text-gray-600">
                Menampilkan data untuk: <span className="font-semibold text-gray-900">{getRangeLabel(selectedRange)}</span>
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {stats && (
          <>
            {/* Main Staistic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Pengguna"
                value={stats.users.total}
                subtitle={`${stats.users.admin} admin, ${stats.users.user} user`}
                icon="user"
                color="indigo"
              />
              <StatCard
                title="Total Buku"
                value={stats.books.total}
                subtitle={`${stats.books.available} tersedia, ${stats.books.borrowed} dipinjam`}
                icon="books"
                color="blue"
              />
              <StatCard
                title="Buku Dipinjam"
                value={stats.borrowed}
                subtitle="Periode terpilih"
                icon="borrowed"
                color="orange"
              />
              <StatCard
                title="Buku Dikembalikan"
                value={stats.returned}
                subtitle="Periode terpilih"
                icon="returned"
                color="green"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Transaction Chart */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Statistik Peminjaman & Pengembalian
                </h3>
                <div className="h-80">
                  {getTransactionChartData() ? (
                    <Bar
                      data={getTransactionChartData()}
                      options={chartOptions}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-50">
                      Tidak Ada data transaksi untuk periode ini
                    </div>
                  )}
                </div>
              </div>

              {/* Popular Books Chart */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Buku Terpopuler
                </h3>
                <div className="h-80">
                  {getPopularBooksChartData() ? (
                    <Bar
                      data={getPopularBooksChartData()}
                      options={{
                        ...chartOptions,
                        indexAxis: 'y',
                      }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      Tidak ada data buku populer
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Loading Indicator */}
        {loading && stats && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Memperbarui data...
          </div>
        )}

      </div>
    </div >
  );
};

// const StatCard = ({label, value}) => (
//   <div className="bg-white shadow rounded-lg p-4 text-center">
//     <div className="text-sm text-gray-500">{label}</div>
//     <div className="text-2xl font-semibold text-blue-600">{value}</div>
//   </div>
// );

export default Dashboard;

