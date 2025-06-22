import { Link } from "react-router-dom";
import { AuthBox } from "./Login";
import { GoArrowUpRight } from "react-icons/go";

function SignUp() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundImage: 'radial-gradient(#cbd5e0 1.20px, transparent 1px)', backgroundSize: '20px 20px'}}>
        <div className="w-full max-w-md p-6 rounded-2xl">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Sign up to DumpStore
          </h2>
          <AuthBox />
          <div className="text-center my-4">
            <span className="text-gray-500">or</span>
          </div>
          <div className="text-center flex items-center justify-center">
            <span className="text-gray-600">{`Already have an account?`}</span>
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:text-blue-800"
            >
              &ensp;Log in
            </Link>
            <GoArrowUpRight size={20} color="blue" />
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
