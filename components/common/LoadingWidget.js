import { CgSpinner } from "react-icons/cg";

const Widget = ({ message }) => {
  return (
    <div className="relative flex flex-col justify-center items-center h-screen">
      <div className="inline-block motion-safe:animate-spin ease duration-300 mx-2 mb-4">
        <CgSpinner className="text-2xl" />
      </div>
      <div className="inline-block h-5 mx-2">{message}</div>
    </div>
  );
};

export default Widget;
