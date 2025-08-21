import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import md5 from "md5";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const API_URL = "http://localhost:5000/api";

const ProfilePage = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getGravatarURL = (email) => {
    if (!email) return "";
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=150`;
  };

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || "");
      setEmail(userInfo.email || "");
      setPhone(userInfo.phone || "");
      setAddress(
        userInfo.address || { street: "", city: "", postalCode: "", country: "" }
      );
    }
  }, [userInfo]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `${API_URL}/users/profile`,
        { name, email, phone, address, password },
        config
      );
      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Profile updated successfully!");
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      toast.error(message);
    }
  };

  if (!userInfo) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-white)] py-12">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <img
              src={getGravatarURL(userInfo.email)}
              alt={userInfo.name}
              className="w-32 h-32 rounded-full mb-4 border-4 border-[var(--color-craemy)]"
            />
            <h1 className="text-4xl font-bold text-[var(--color-darkgreen)] font-heading">
              {userInfo.name}'s Profile
            </h1>
          </div>
          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-[var(--color-green)] font-heading mb-4">
                  Personal Details
                </h2>
              </div>
              <div>
                <label
                  className="block text-[var(--color-darkgreen)] font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label
                  className="block text-[var(--color-darkgreen)] font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  className="block text-[var(--color-darkgreen)] font-bold mb-2"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="md:col-span-2 mt-8">
                <h2 className="text-2xl font-bold text-[var(--color-green)] font-heading mb-4">
                  Address
                </h2>
              </div>
              <div>
                <label
                  className="block text-[var(--color-darkgreen)] font-bold mb-2"
                  htmlFor="street"
                >
                  Street
                </label>
                <input
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
                  id="street"
                  name="street"
                  type="text"
                  value={address.street}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <label
                  className="block text-[var(--color-darkgreen)] font-bold mb-2"
                  htmlFor="city"
                >
                  City
                </label>
                <input
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
                  id="city"
                  name="city"
                  type="text"
                  value={address.city}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <label
                  className="block text-[var(--color-darkgreen)] font-bold mb-2"
                  htmlFor="postalCode"
                >
                  Postal Code
                </label>
                <input
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={address.postalCode}
                  onChange={handleAddressChange}
                />
              </div>
              <div>
                <label
                  className="block text-[var(--color-darkgreen)] font-bold mb-2"
                  htmlFor="country"
                >
                  Country
                </label>
                <input
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
                  id="country"
                  name="country"
                  type="text"
                  value={address.country}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="md:col-span-2 mt-8">
                <h2 className="text-2xl font-bold text-[var(--color-green)] font-heading mb-4">
                  Update Password
                </h2>
              </div>
              <div>
                <label
                  className="block text-[var(--color-darkgreen)] font-bold mb-2"
                  htmlFor="password"
                >
                  New Password
                </label>
                <input
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
                  id="password"
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label
                  className="block text-[var(--color-darkgreen)] font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm New Password
                </label>
                <input
                  className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
                  id="confirmPassword"
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-center mt-10">
              <button
                className="bg-[var(--color-orange)] hover:opacity-90 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline text-lg"
                type="submit"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
