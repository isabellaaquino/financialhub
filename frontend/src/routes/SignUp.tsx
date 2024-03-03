import SignUpForm from "../components/forms/SignUpForm";

export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

function SignUp() {
  return <SignUpForm />;
}

export default SignUp;
