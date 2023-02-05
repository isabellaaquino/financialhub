import { text } from "node:stream/consumers";

interface Props {
  text: string;
}

function Banner(props: Props) {
  return (
    <div className="Banner">
      <div className="bg-yellow-100 mr-6 rounded-md mt-4 p-2 text-sm text-gray-500">
        <p>{props.text}</p>
      </div>
    </div>
  );
}

export default Banner;
