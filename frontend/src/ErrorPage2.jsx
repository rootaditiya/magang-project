import { useLocation } from "react-router";

const ErrorPage2 = () => {
  const location = useLocation();
  const { message, statusText } = location.state || {};

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{statusText || "403 Forbidden"}</i>
      </p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorPage2;
