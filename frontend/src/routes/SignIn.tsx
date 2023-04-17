import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface UserInput {
  email: string;
  password: string;
}

function Login() {
  let navigate = useNavigate();
  const { SignIn, user } = useAuth();
  const [userInput, setUserInput] = useState<UserInput>({
    email: "",
    password: "",
  });

  function handleSubmit(event: any) {
    event.preventDefault();
    try {
      SignIn(userInput.email, userInput.password);
      // setUserInput({ email: "", password: "" });
      navigate("/");
    } catch (error) {
      !error ? console.log("No server response") : console.log(error);
    }
  }

  function handleEmailChange(input: string) {
    setUserInput((prevState) => {
      return { ...prevState, email: input };
    });
  }

  function handlePasswordChange(input: string) {
    setUserInput((prevState) => {
      return { ...prevState, password: input };
    });
  }

  return (
    <div className="Login">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex justify-center items-center m-10"
      >
        <div className="flex flex-col w-80">
          <label className="text-sm text-gray-700">Email</label>
          <input
            type="text"
            value={userInput.email}
            onChange={(event) => handleEmailChange(event.target.value)}
            placeholder="Type your email"
            className="text-sm border-b-2 p-3 mb-8 rounded-none w-full focus:outline-none focus:border-b-blue-800"
            autoFocus
          />
          <label className="text-sm text-gray-700">Password</label>
          <input
            type="password"
            value={userInput.password}
            onChange={(event) => handlePasswordChange(event.target.value)}
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
            <Link to="/sign-up" className="text-blue-800 cursor-pointer font-medium">Sign up</Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;
