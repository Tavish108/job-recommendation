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
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const [preview, setPreview] = useState(null);

  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) formData.append("file", input.file);

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 via-white to-indigo-100">
        <div className="max-w-6xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-12"
          >
            <h1 className="font-extrabold text-3xl text-indigo-700 mb-6 text-center">
              Create Your Account
            </h1>

            {/* ✅ Only ONE form here */}
            <form onSubmit={submitHandler} className="space-y-6">
              {/* Full Name */}
              <div>
                <Label className="text-gray-700 font-medium">Full Name</Label>
                <Input
                  type="text"
                  value={input.fullname}
                  name="fullname"
                  onChange={changeEventHandler}
                  placeholder="John Doe"
                  className="rounded-2xl border border-gray-300 px-4 py-3 w-full
                    text-gray-700 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                    shadow-sm hover:shadow-md transition duration-200 ease-in-out"
                />
              </div>

              {/* Email */}
              <div>
                <Label className="text-gray-700 font-medium">Email</Label>
                <Input
                  type="email"
                  value={input.email}
                  name="email"
                  onChange={changeEventHandler}
                  placeholder="john@gmail.com"
                  className="rounded-2xl border border-gray-300 px-4 py-3 w-full
                    text-gray-700 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                    shadow-sm hover:shadow-md transition duration-200 ease-in-out"
                />
              </div>

              {/* Phone Number */}
              <div>
                <Label className="text-gray-700 font-medium">Phone Number</Label>
                <Input
                  type="text"
                  value={input.phoneNumber}
                  name="phoneNumber"
                  onChange={changeEventHandler}
                  placeholder="8080808080"
                  className="rounded-2xl border border-gray-300 px-4 py-3 w-full
                    text-gray-700 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                    shadow-sm hover:shadow-md transition duration-200 ease-in-out"
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
                  className="rounded-2xl border border-gray-300 px-4 py-3 w-full
                    text-gray-700 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                    shadow-sm hover:shadow-md transition duration-200 ease-in-out"
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

              {/* File Upload with Preview */}
              <div>
                <Label>Profile Photo</Label>
                <Input
                  accept="image/*"
                  type="file"
                  onChange={changeFileHandler}
                  className="cursor-pointer mt-2"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-3 h-20 w-20 rounded-full object-cover border-2 border-indigo-400 shadow-md"
                  />
                )}
              </div>

              {/* Submit / Loader */}
              {loading ? (
                <Button className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition duration-200"
                >
                  Sign Up
                </Button>
              )}

              {/* Already have account */}
              <p className="text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 font-medium">
                  Login
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
            <h2 className="text-3xl font-bold mb-4">Welcome to JobPortal 🚀</h2>
            <p className="text-lg mb-6 text-center">
              Join our platform to explore opportunities, showcase your skills,
              and connect with recruiters worldwide.
            </p>
            <img src="/office_remove.png" alt="signup" className="w-64" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;






































// import React, { useEffect, useState } from 'react'
// import Navbar from '../shared/Navbar'
// import { Label } from '../ui/label'
// import { Input } from '../ui/input'
// import { RadioGroup } from '../ui/radio-group'
// import { Button } from '../ui/button'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { USER_API_END_POINT } from '@/utils/constant'
// import { toast } from 'sonner'
// import { useDispatch, useSelector } from 'react-redux'
// import { setLoading } from '@/redux/authSlice'
// import { Loader2 } from 'lucide-react'

// const Signup = () => {

//     const [input, setInput] = useState({
//         fullname: "",
//         email: "",
//         phoneNumber: "",
//         password: "",
//         role: "",
//         file: ""
//     });
//     const {loading,user} = useSelector(store=>store.auth);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const changeEventHandler = (e) => {
//         setInput({ ...input, [e.target.name]: e.target.value });
//     }
//     const changeFileHandler = (e) => {
//         setInput({ ...input, file: e.target.files?.[0] });
//     }
//     const submitHandler = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();    //formdata object
//         formData.append("fullname", input.fullname);
//         formData.append("email", input.email);
//         formData.append("phoneNumber", input.phoneNumber);
//         formData.append("password", input.password);
//         formData.append("role", input.role);
//         if (input.file) {
//             formData.append("file", input.file);
//         }

//         try {
//             dispatch(setLoading(true));
//             const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
//                 headers: { 'Content-Type': "multipart/form-data" },
//                 withCredentials: true,
//             });
//             if (res.data.success) {
//                 navigate("/login");
//                 toast.success(res.data.message);
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error.response.data.message);
//         } finally{
//             dispatch(setLoading(false));
//         }
//     }

//     useEffect(()=>{
//         if(user){
//             navigate("/");
//         }
//     },[])
//     return (
//         <div>
//             <Navbar />
//             <div className='flex items-center justify-center max-w-7xl mx-auto'>
//                 <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
//                     <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
//                     <div className='my-2'>
//                         <Label>Full Name</Label>
//                         <Input
//                             type="text"
//                             value={input.fullname}
//                             name="fullname"
//                             onChange={changeEventHandler}
//                             placeholder="john doe"
//                         />
//                     </div>
//                     <div className='my-2'>
//                         <Label>Email</Label>
//                         <Input
//                             type="email"
//                             value={input.email}
//                             name="email"
//                             onChange={changeEventHandler}
//                             placeholder="john@gmail.com"
//                         />
//                     </div>
//                     <div className='my-2'>
//                         <Label>Phone Number</Label>
//                         <Input
//                             type="text"
//                             value={input.phoneNumber}
//                             name="phoneNumber"
//                             onChange={changeEventHandler}
//                             placeholder="8080808080"
//                         />
//                     </div>
//                     <div className='my-2'>
//                         <Label>Password</Label>
//                         <Input
//                             type="password"
//                             value={input.password}
//                             name="password"
//                             onChange={changeEventHandler}
//                             placeholder="john@123"
//                         />
//                     </div>
//                     <div className='flex items-center justify-between'>
//                         <RadioGroup className="flex items-center gap-4 my-5">
//                             <div className="flex items-center space-x-2">
//                                 <Input
//                                     type="radio"
//                                     name="role"
//                                     value="student"
//                                     checked={input.role === 'student'}
//                                     onChange={changeEventHandler}
//                                     className="cursor-pointer"
//                                 />
//                                 <Label htmlFor="r1">Student</Label>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <Input
//                                     type="radio"
//                                     name="role"
//                                     value="recruiter"
//                                     checked={input.role === 'recruiter'}
//                                     onChange={changeEventHandler}
//                                     className="cursor-pointer"
//                                 />
//                                 <Label htmlFor="r2">Recruiter</Label>
//                             </div>
//                         </RadioGroup>
//                         <div className='flex items-center gap-2'>
//                             <Label>Profile</Label>
//                             <Input
//                                 accept="image/*"
//                                 type="file"
//                                 onChange={changeFileHandler}
//                                 className="cursor-pointer"
//                             />
//                         </div>
//                     </div>
//                     {
//                         loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Signup</Button>
//                     }
//                     <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Signup