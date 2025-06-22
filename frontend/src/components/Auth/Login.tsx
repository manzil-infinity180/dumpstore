import { Link } from "react-router-dom";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { GoArrowUpRight } from "react-icons/go";
function Login() {
  return (
    <>
      {/* <div>
        <button
          className="w-1/4 p-2 rounded-xl bg-slate-400"
          onClick={() =>
            window.open("http://localhost:3008/auth/google", "_self")
          }
        >
          Login
        </button> */}
      {/* </div> */}
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundImage: 'radial-gradient(#cbd5e0 1.20px, transparent 1px)', backgroundSize: '20px 20px'}}>
        <div className="w-full max-w-md p-6 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Log in to DumpStore
          </h2>
          <AuthBox />
          <div className="text-center my-4">
            <span className="text-gray-500">or</span>
          </div>
          <div className="text-center flex items-center justify-center">
            <span className="text-gray-600">{`Don't have an account?`}</span>
            <Link
              to="/signup"
              className="text-blue-600 font-medium hover:text-blue-800"
            >
              &ensp;Sign up
            </Link>
            <GoArrowUpRight size={20} color="blue" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

export function AuthBox() {
  const url = `http://localhost:3008/auth`;
  return (
    <>
      <button
        onClick={() => window.open(`${url}/github`, "_self")}
        className=" flex items-center justify-center w-full py-4 px-3 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <FaGithub size={20} className="mr-2" />
        <span>Continue with Github</span>
      </button>
      <div className="space-y-2 my-2">
        <button
          onClick={() => window.open(`${url}/google`, "_self")}
          className=" flex items-center justify-center w-full py-4 px-3 bg-blue-600 hover:bg-blue-800 text-white font-bold rounded-xl transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <FaGoogle size={20} className="mr-2" />
          <span>Continue with Google</span>
        </button>
      </div>
    </>
  );
}
