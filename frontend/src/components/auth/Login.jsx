import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 via-white to-indigo-100">
        <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-12"
          >
            <h1 className="font-extrabold text-3xl text-indigo-700 mb-6 text-center">
              Welcome Back 👋
            </h1>
            <form onSubmit={submitHandler} className="space-y-6">
              {/* Email */}
              <div>
                <Label className="text-gray-700 font-medium">Email</Label>
                <Input
                  type="email"
                  value={input.email}
                  name="email"
                  onChange={changeEventHandler}
                  placeholder="patel@gmail.com"
                  className="
                    rounded-2xl border border-gray-300 
                    px-4 py-3 w-full
                    text-gray-700 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                    shadow-sm hover:shadow-md
                    transition duration-200 ease-in-out
                  "
                />
              </div>

              {/* Password */}
              <div>
                <Label className="text-gray-700 font-medium">Password</Label>
                <Input
                  type="password"
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  placeholder="********"
                  className="
                    rounded-2xl border border-gray-300 
                    px-4 py-3 w-full
                    text-gray-700 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                    shadow-sm hover:shadow-md
                    transition duration-200 ease-in-out
                  "
                />
              </div>

              {/* Role Selection */}
              <div>
                <Label className="text-gray-700 font-medium">Role</Label>
                <div className="flex gap-4 mt-3">
                  {["student", "recruiter"].map((role) => (
                    <Button
                      key={role}
                      type="button"
                      variant={input.role === role ? "default" : "outline"}
                      onClick={() => setInput({ ...input, role })}
                      className={`capitalize flex-1 py-3 rounded-2xl font-medium transition-all duration-200 ${
                        input.role === role
                          ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                          : "bg-white border border-gray-300 text-gray-600 hover:bg-indigo-50"
                      }`}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              {loading ? (
                <Button className="w-full py-3 rounded-2xl">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition duration-200"
                >
                  Login
                </Button>
              )}
              <p className="text-sm text-gray-600 text-center">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Signup
                </Link>
              </p>
            </form>
          </motion.div>

          {/* Right: Illustration / Branding */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-10"
          >
            <h2 className="text-3xl font-bold mb-4">Welcome Back 🚀</h2>
            <p className="text-lg mb-6 text-center">
              Log in to explore new opportunities and manage your career
              journey.
            </p>
            <img
              src="/office_remove.png"
              alt="login"
              className="w-64 drop-shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
