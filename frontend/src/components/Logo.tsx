import { Link } from "react-router-dom";

interface Props {
  style: string;
}
export default function Logo(props: Props) {
  return (
    <Link
      to="/"
      className={`text-white font-medium font-logo text-2xl mx-5 lg:mx-0 text-center ${props.style}`}
    >
      <h1>
        Financial<strong className="text-green-500">hub</strong>
      </h1>
    </Link>
  );
}
