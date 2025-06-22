import { useState } from "react";
import { Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { uploadBookmarkFile } from "../utils/http";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UploadBookmarFile() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: uploadBookmarkFile,
    onSuccess: (data) => {
      toast.success("Bookmark Data Uploaded to Database");
      console.log(data);
      navigate('/')
    },
    onError: (err) => {
      console.log(err.message);
      toast.error(err.message);
    },
  });
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null && event.target.files[0]) {
      const file = event.target.files[0];
      setFile(file);
      setFileName(file.name);
    }
  };
  function handleUploadFile() {
    if (file) {
      const formData = new FormData();
      formData.append("bookmark", file);
      mutate(formData);
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen" style={{backgroundImage: 'radial-gradient(#cbd5e0 1.20px, transparent 1px)', backgroundSize: '20px 20px'}}>
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Upload HTML File</h2>
          <p className="text-sm text-gray-500">
            Drag and drop or click to select
          </p>
        </div>
        <label
          htmlFor="file-input"
          className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:border-blue-500 group"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-12 h-12 mb-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
            <p className="mb-2 text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 group-hover:text-blue-500/70 transition-colors duration-300">
              HTML files only, Only Chrome Exported data supportes
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            accept=".html"
            className="hidden"
            onChange={handleFileChange}
          />
          {fileName && (
            <div className="absolute bottom-3 left-3 right-3 p-2 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-600 truncate">{fileName}</p>
            </div>
          )}
        </label>
        <div className="mt-6">
          <button
            type="button"
            disabled={!file && true}
            className={`${
              !file && "opacity-50"
            } w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300`}
            onClick={handleUploadFile}
          >
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
}
