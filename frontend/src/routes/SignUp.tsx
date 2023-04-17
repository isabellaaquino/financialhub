import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setSourceMapRange } from "typescript";
import { useAuth } from "../hooks/useAuth";

export interface UserInput {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

function SignUp() {
  const navigate = useNavigate();
  const { SignUp } = useAuth();
  const [error, setError] = useState("");
  const [userInput, setUserInput] = useState<UserInput>({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserInput((prevState) => {
        return { ...prevState, [e.target.name]: e.target.value };
      });
    },
    [userInput]
  );

  const registerUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await SignUp(userInput);
    if (response) navigate("/sign-in");
    else setError("Register error");
  };
  return (
    <div className="Login flex flex-col justify-center items-center mt-10">
      <p className="text-red-500">{error}</p>
      <form onSubmit={(e) => registerUser(e)} className="flex flex-col w-86">
        {/* <div>
          <div className="h-40 w-40 bg-gray-200 rounded-full m-auto mb-16">
            <button className="material-symbols-rounded rounded-full bg-blue-800 text-white p-2 hover:bg-blue-900">
              edit
            </button>
          </div>
        </div> */}
        <div className="flex flex-row gap-3">
          <div className="flex flex-col">
            <label className="text-left text-sm text-gray-700">
              First Name
            </label>
            <input
              type="text"
              placeholder="First name"
              name="firstName"
              className="text-sm border-b-2 p-3 mb-8 rounded-none w-full focus:outline-none focus:border-b-blue-800"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-700">Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              name="lastName"
              className="text-sm border-b-2 p-3 mb-8 rounded-none w-full focus:outline-none focus:border-b-blue-800"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <label className="text-sm text-gray-700">Email</label>
        <input
          type="text"
          placeholder="Type your email"
          name="email"
          className="text-sm border-b-2 p-3 mb-8 rounded-none w-full focus:outline-none focus:border-b-blue-800"
          onChange={handleInputChange}
        />
        <label className="text-sm text-gray-700">Password</label>
        <input
          type="password"
          placeholder="Type your password"
          name="password"
          className="text-sm border-b-2 p-3 mb-8 rounded-none w-full focus:outline-none focus:border-b-blue-800"
          onChange={handleInputChange}
        />
        <label className="text-sm text-gray-700">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your password"
          name="password"
          className="text-sm border-b-2 p-3 mb-8 rounded-none w-full focus:outline-none focus:border-b-blue-800"
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="bg-blue-800 text-white p-3 mb-3 w-full rounded-md hover:bg-blue-900 text-sm"
        >
          Register
        </button>
        <span className="text-gray-500 text-center text-sm">
          Already have an account?{" "}
          <Link
            className="text-blue-800 cursor-pointer font-medium"
            to={`/sign-in`}
          >
            Sign in
          </Link>
        </span>
      </form>
    </div>
  );
}

export default SignUp;
