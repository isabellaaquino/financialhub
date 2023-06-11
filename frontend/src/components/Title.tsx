interface Props {
  text: string;
}

function Title(props: Props) {
  return <h2 className="text-lg text-white text-left mb-4">{props.text}</h2>;
}

export default Title;
