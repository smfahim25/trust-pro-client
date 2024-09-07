import React, { useState } from "react";
import headerLogo from "../../Assets/images/header-logo.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api/getApiURL";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import useConversation from "../../zustand/useConversation";

const Login = () => {
  const { setUser, setLoading } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    password: "",
    remember: false,
  });
  const { setSelectedConversation, setMessages } = useConversation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        emailOrMobile: formData.emailOrMobile,
        password: formData.password,
      });
      const userData = response.data;
      if (userData.role === "user" && userData?.status === "active") {
        setLoading(false);
        setUser(userData);
        setMessages([]);
        setSelectedConversation(null);
        toast.success("Login successful!");
        navigate("/");
      } else if (userData?.status === "active") {
        setLoading(false);
        setUser(userData);
        setMessages([]);
        setSelectedConversation(null);
        toast.success("Login successful!");
        navigate("/");
      }
      // Handle successful login here (e.g., redirect to another page)
    } catch (error) {
      setLoading(false);

      console.error("Login failed:", error.response.data);
      toast.error(error.response.data.error);
      // Handle login failure here (e.g., show error message)
    }
  };
  return (
    <div>
      <div className="user-panel">
        <div className="top-wrapper">
          <div className="top_container">
            <h1 className="title mt-10">{"TrustPro"}</h1>
            <div className="an_title">
              <div className="info">
                <div className="desc">
                  <p>Your one-stop solution for trading needs.</p>
                </div>
              </div>
              <img src={headerLogo} className="shap" alt="Header Logo" />
            </div>
          </div>
        </div>
        <section className="">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-gray-100 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900">
                  Sign in to your account
                </h1>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label
                      htmlFor="emailOrMobile"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="emailOrMobile"
                      id="emailOrMobile"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="name@company.com"
                      value={formData.emailOrMobile}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Sign in
                  </button>
                  <p className="text-sm font-light text-gray-500">
                    Don’t have an account yet?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-primary-600 hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
