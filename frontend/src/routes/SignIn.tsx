import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/Logo";

interface UserInput {
  email: string;
  password: string;
}

function Login() {
  let navigate = useNavigate();
  const { SignIn } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userInput, setUserInput] = useState<UserInput>({
    email: "",
    password: "",
  });

  function handleSubmit(event: any) {
    event.preventDefault();
    try {
      SignIn(userInput.email, userInput.password);
      navigate("/");
    } catch (error) {
      !error ? console.log("No server response") : console.log(error);
    }
    setIsLoggingIn(false);
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
  console.log(isLoggingIn);
  return (
    <div className="Login mt-20">
      <Logo style="text-4xl" />

      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex justify-center items-center m-10"
      >
        <div className="flex flex-col w-80 gap-5">
          <div>
            <label className="text-sm text-white">Email</label>
            <input
              type="text"
              value={userInput.email}
              onChange={(event) => handleEmailChange(event.target.value)}
              placeholder="Type your email"
              className="mt-2 w-full text-sm text-white pl-3 pr-5 py-2 rounded-md bg-black-300 focus:outline-none focus:ring-2 focus:ring-green-500 autofill:bg-black-300"
              autoFocus
            />
          </div>
          <div>
            <label className="text-sm text-white">Password</label>
            <input
              type="password"
              value={userInput.password}
              onChange={(event) => handlePasswordChange(event.target.value)}
              placeholder="Type your password"
              className="mt-2 w-full text-sm text-white pl-3 pr-5 py-2 rounded-md bg-black-300 focus:outline-none focus:ring-2 focus:ring-green-500 autofill:bg-black-300"
            />
          </div>
          <button
            type="submit"
            onClick={() => setIsLoggingIn(true)}
            disabled={isLoggingIn}
            className={`${
              isLoggingIn && "bg-green-600"
            } bg-green-500 text-white font-semibold p-3 mt-2 w-full rounded-md hover:bg-green-600 text-sm`}
          >
            {isLoggingIn ? "Logging in..." : "Sign In"}
          </button>
          <span className="text-gray-500 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-green-500 cursor-pointer font-medium"
            >
              Sign up
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;
