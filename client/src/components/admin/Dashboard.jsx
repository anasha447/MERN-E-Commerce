import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const { userInfo } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`${API_URL}/admin/stats`, config);
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (userInfo && userInfo.isAdmin) {
      fetchStats();
    } else {
      // Redirect or show unauthorized
      setLoading(false);
    }
  }, [userInfo]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-12 bg-[var(--color-white)]">
      <h1 className="text-4xl font-bold text-center mb-12 text-[var(--color-darkgreen)] font-heading">
        Admin Dashboard
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center border-t-4 border-[var(--color-orange)]">
              <h2 className="text-xl font-bold text-[var(--color-darkgreen)] font-heading">
                Total Sales
              </h2>
              <p className="text-4xl font-bold text-[var(--color-green)] mt-2">
                ${(stats.totalSales || 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-8 text-center border-t-4 border-[var(--color-yellow)]">
              <h2 className="text-xl font-bold text-[var(--color-darkgreen)] font-heading">
                Total Orders
              </h2>
              <p className="text-4xl font-bold text-[var(--color-green)] mt-2">
                {stats.totalOrders || 0}
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-8 text-center border-t-4 border-[var(--color-lightgreen)]">
              <h2 className="text-xl font-bold text-[var(--color-darkgreen)] font-heading">
                Total Users
              </h2>
              <p className="text-4xl font-bold text-[var(--color-green)] mt-2">
                {stats.totalUsers || 0}
              </p>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-8 text-[var(--color-darkgreen)] font-heading">
              Sales Over Time
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={stats.salesData || []}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSales" fill="#3E5F2D" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div>No stats available.</div>
      )}
    </div>
  );
};

export default Dashboard;
