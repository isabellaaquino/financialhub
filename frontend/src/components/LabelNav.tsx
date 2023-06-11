interface Props {
  text: string;
  sideNavState: boolean;
}

function LabelNav(props: Props) {
  return (
    <p
      className={`${
        !props.sideNavState && "hidden"
      } text-gray-100 mt-8 text-xs uppercase`}
    >
      {props.text}
    </p>
  );
}

export default LabelNav;
