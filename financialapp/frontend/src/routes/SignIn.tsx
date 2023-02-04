function Login() {
  return (
    <div className="Login flex justify-center items-center m-10">
      <div className="flex flex-col w-80">
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
        <button
          type="submit"
          className="bg-blue-800 text-white p-3 mb-3 w-full rounded-md hover:bg-blue-900 text-sm"
        >
          Sign In
        </button>
        <span className="text-gray-500 text-center text-sm">
          Don't have an account?{" "}
          <a className="text-blue-800 cursor-pointer font-medium">Sign up</a>
        </span>
      </div>
    </div>
  );
}

export default Login;
