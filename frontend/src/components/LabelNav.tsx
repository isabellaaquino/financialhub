import { useAuth } from "../hooks/useAuth";

interface Props {
  text: string;
}

function LabelNav(props: Props) {
  const { isSideNavOpen } = useAuth();
  return (
    <p
      className={`${
        !isSideNavOpen && "hidden"
      } text-gray-100 mt-5 text-xs uppercase`}
    >
      {props.text}
    </p>
  );
}

export default LabelNav;
