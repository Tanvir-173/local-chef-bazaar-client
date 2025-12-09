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

  const paymentData = [
  { name: "Total Payments", amount: stats.totalPaymentAmount },
];

  return (
    <div className="p-6 space-y-6 text-black">
      <h1 className="text-3xl font-bold mb-4">📊 Platform Statistics</h1>

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="shadow-lg bg-white p-4 text-center rounded-lg border">
          <h2 className="text-lg font-semibold">Total Payment Amount</h2>
         <p className="text-3xl font-bold mt-2">${stats.totalPaymentAmount}</p>

        </div>

        <div className="shadow-lg bg-white p-4 text-center rounded-lg border">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>

        <div className="shadow-lg bg-white p-4 text-center rounded-lg border">
          <h2 className="text-lg font-semibold">Orders Pending</h2>
          <p className="text-3xl font-bold mt-2 text-yellow-500">
            {stats.ordersPending}
          </p>
        </div>

        <div className="shadow-lg bg-white p-4 text-center rounded-lg border">
          <h2 className="text-lg font-semibold">Orders Delivered</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {stats.ordersDelivered}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {/* Orders Pie Chart */}
        <div className="shadow-lg bg-white p-4 rounded-lg border">
          <h2 className="text-xl font-semibold text-center mb-3">
            Orders Summary
          </h2>
          <PieChart width={350} height={300} className="mx-auto">
            <Pie
              data={orderData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {orderData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#facc15" : "#22c55e"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Payment Bar Chart */}
        <div className="shadow-lg bg-white p-4 rounded-lg border">
          <h2 className="text-xl font-semibold text-center mb-3">
            Payment Overview
          </h2>
          <BarChart width={400} height={300} data={paymentData} className="mx-auto">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#3b82f6" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;
