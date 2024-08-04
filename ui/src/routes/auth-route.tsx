import { Outlet } from "react-router-dom"


export default function AuthRoute() {
  return (
    <>
      <div className="container h-[800px] flex-col items-center justify-center lg:max-w-none lg:px-0">
        <div
          className="z-20 flex mt-20 mb-10 text-6xl font-extrabold gap-3 justify-center items-center text-lg font-medium">
          Allobrain Notes
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Outlet/>
          </div>
        </div>
      </div>
    </>
  )
}