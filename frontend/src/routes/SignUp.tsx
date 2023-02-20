import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="Login flex justify-center items-center mt-10">
      <div className="flex flex-col w-86">
        <div>
          <div className="h-40 w-40 bg-gray-200 rounded-full m-auto mb-16">
            <button className="material-symbols-rounded rounded-full bg-blue-800 text-white p-2 hover:bg-blue-900">
              edit
            </button>
          </div>
        </div>
        <div className="flex flex-row gap-3">
          <div className="flex flex-col">
            <label className="text-left text-sm text-gray-700">
              First Name
            </label>
            <input
              type="text"
              placeholder="First name"
              className="text-sm border-b-2 p-3 mb-8 rounded-none w-full focus:outline-none focus:border-b-blue-800"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              className="text-sm border-b-2 p-3 mb-8 rounded-none w-full focus:outline-none focus:border-b-blue-800"
            />
          </div>
        </div>
        <label className="text-sm text-gray-700">Email</label>
        <input
          type="text"
          placeholder="Type your email"
          className="text-sm border-b-2 p-3 mb-8 rounded-none w-full focus:outline-none focus:border-b-blue-800"
        />
        <label className="text-sm text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Type your password"
          className="text-sm border-b-2 p-3 mb-8 rounded-none w-full focus:outline-none focus:border-b-blue-800"
        />
        <label className="text-sm text-gray-700">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your password"
          className="text-sm border-b-2 p-3 mb-8 rounded-none w-full focus:outline-none focus:border-b-blue-800"
        />
        <button
          type="submit"
          className="bg-blue-800 text-white p-3 mb-3 w-full rounded-md hover:bg-blue-900 text-sm"
        >
          Sign In
        </button>
        <span className="text-gray-500 text-center text-sm">
          Already have an account?{" "}
          <Link
            className="text-blue-800 cursor-pointer font-medium"
            to={`/signin`}
          >
            Sign in
          </Link>
        </span>
      </div>
    </div>
  );
}

export default SignUp;
