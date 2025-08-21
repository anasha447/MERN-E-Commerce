import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserListPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get("/api/admin/users", config);
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    } else {
      // Redirect to login or show unauthorized message
    }
  }, [userInfo]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/admin/users/${id}`, config);
        setUsers(users.filter((user) => user._id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-12 bg-[var(--color-white)]">
      <h1 className="text-4xl font-bold text-center mb-12 text-[var(--color-darkgreen)] font-heading">
        User Management
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[var(--color-darkgreen)] text-[var(--color-craemy)]">
              <tr>
                <th className="py-3 px-6 text-left font-heading">ID</th>
                <th className="py-3 px-6 text-left font-heading">Name</th>
                <th className="py-3 px-6 text-left font-heading">Email</th>
                <th className="py-3 px-6 text-left font-heading">Admin</th>
                <th className="py-3 px-6 text-left font-heading">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(users) &&
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">{user._id}</td>
                    <td className="py-4 px-6">{user.name}</td>
                    <td className="py-4 px-6">{user.email}</td>
                    <td className="py-4 px-6">
                      {user.isAdmin ? (
                        <span className="text-green-500 font-bold">Yes</span>
                      ) : (
                        <span className="text-red-500 font-bold">No</span>
                      )}
                    </td>
                    <td className="py-4 px-6 flex items-center gap-4">
                      <Link
                        to={`/admin/user/${user._id}/edit`}
                        className="text-[var(--color-green)] hover:text-[var(--color-lightgreen)]"
                      >
                        <FaEdit size={20} />
                      </Link>
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="text-[var(--color-orange)] hover:text-red-700"
                      >
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
