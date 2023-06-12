import { useRouteError } from "react-router-dom";

function Error() {
  const error: any = useRouteError();

  return (
    <div id="error-page" className="text-white flex flex-col justify-center items-center gap-3 mt-40">
      <span className="text-gray-500 text-8xl font-logo">{error.status}</span>
      <h1 className="mt-5">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-500">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}

export default Error;
