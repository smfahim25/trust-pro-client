import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../../../context/UserContext';
import API_BASE_URL from '../../../api/getApiURL';

const AdminLogin = () => {
    const { setUser, setAdminUser, setLoading } = useUser();
    const [emailOrMobile, setEmailOrMobile] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const loginData = { emailOrMobile, password };

    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, loginData);
      
      const userData = response.data;
      if (userData.role==='superadmin' || userData.role==='admin') {
        setAdminUser(userData);
        navigate("/cradmin");

      } else {
        setUser(userData); 
      }

      toast.success('Login successful!');
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
    return (
        <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-900 text-gray-100">
            <div className="mb-8 text-center">
            <h1 className="my-3 text-4xl font-bold text-white">Sign in</h1>
            <p className="text-sm text-gray-400">Sign in to access your account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-4">
                <div>
                <label htmlFor="emailOrMobile" className="block mb-2 text-sm">Email or Mobile</label>
                <input
                    type="text"
                    name="emailOrMobile"
                    id="emailOrMobile"
                    value={emailOrMobile}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    placeholder="leroy@jenkins.com"
                    className="w-full px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
                    required
                />
                </div>
                <div>
                <div className="flex justify-between mb-2">
                    <label htmlFor="password" className="text-sm">Password</label>
                    <Link rel="noopener noreferrer" to={''} className="text-xs hover:underline text-gray-400">Forgot password?</Link>
                </div>
                <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*****"
                className="w-full px-3 py-2 border rounded-md border-gray-700 bg-gray-900 text-gray-100"
                required
              />
                </div>
            </div>
            <div className="space-y-2">
                <div>
                <button type="submit" className="w-full px-8 py-3 font-semibold rounded-md bg-violet-400 text-gray-900">Sign in</button>
                </div>
                <p className="px-6 text-sm text-center text-gray-400">Please login  with your admin credentials.
                </p>
            </div>
            </form>
        </div>
    </div>

        
    );
};

export default AdminLogin;

