import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{!error.statusText ? "403 Forbiden" :error.statusText}</i>
        <i>{ error.message}</i>
      </p>
    </div>
  );
}