import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const PlatformStats = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({
    totalPaymentAmount: 0,
    totalUsers: 0,
    ordersPending: 0,
    ordersDelivered: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosSecure.get("/admin/platform-stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [axiosSecure]);

  if (loading)
    return <p className="text-center py-10 text-lg">Loading stats...</p>;

  const orderData = [
    { name: "Pending", value: stats.ordersPending },
    { name: "Delivered", value: stats.ordersDelivered },
  ];

  const paymentData = [{ name: "Total Payments", amount: stats.totalPaymentAmount }];

  return (
    <div className="p-4 md:p-6 text-black space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">
        📊 Platform Statistics
      </h1>

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="shadow-lg bg-white p-4 text-center rounded-lg border">
          <h2 className="text-lg font-semibold">Total Payment Amount</h2>
          <p className="text-2xl md:text-3xl font-bold mt-2">${stats.totalPaymentAmount}</p>
        </div>

        <div className="shadow-lg bg-white p-4 text-center rounded-lg border">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl md:text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>

        <div className="shadow-lg bg-white p-4 text-center rounded-lg border">
          <h2 className="text-lg font-semibold">Orders Pending</h2>
          <p className="text-2xl md:text-3xl font-bold mt-2 text-yellow-500">{stats.ordersPending}</p>
        </div>

        <div className="shadow-lg bg-white p-4 text-center rounded-lg border">
          <h2 className="text-lg font-semibold">Orders Delivered</h2>
          <p className="text-2xl md:text-3xl font-bold mt-2 text-green-600">{stats.ordersDelivered}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
        {/* Orders Pie Chart */}
        <div className="shadow-lg bg-white p-4 rounded-lg border w-full">
          <h2 className="text-xl font-semibold text-center mb-3">Orders Summary</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {orderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "#facc15" : "#22c55e"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Bar Chart */}
        <div className="shadow-lg bg-white p-4 rounded-lg border w-full">
          <h2 className="text-xl font-semibold text-center mb-3">Payment Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;
