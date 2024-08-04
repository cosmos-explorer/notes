import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <section id="error-page" className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto lg:py-16 lg:px-6">
        <div className="mx-auto text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">Oops!</h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Sorry, an unexpected error has occurred.</p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">{error.statusText || error.message}</p>
        </div>
      </div>
    </section>
  );
}