import React from "react";
import API_BASE_URL from "../../../api/getApiURL";
import { IoCloseCircleSharp } from "react-icons/io5";

const ImageViewer = ({ isOpen, onClose, details, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex flex-col items-center max-w-lg gap-4 p-6 rounded-md shadow-md sm:py-8 sm:px-12 bg-white text-black">
        <button
          onClick={onClose}
          className="absolute top-2 right-2"
          style={{
            padding: "0",
            color: "black",
            backgroundColor: "transparent",
          }}
        >
          <IoCloseCircleSharp size={40} />
        </button>

        <h2 className="text-2xl font-semibold leading-tight tracking-wide">
          Deposit Document
        </h2>

        <div className="mb-4 h-full">
          <img
            src={`${API_BASE_URL}/${details.documents}`}
            alt="doc"
            style={{ maxHeight: "70vh", width: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
