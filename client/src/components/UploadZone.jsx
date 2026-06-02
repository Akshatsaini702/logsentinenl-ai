import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const UploadZone = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/plain': ['.log', '.txt'] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-gray-700 hover:border-purple-500 hover:bg-purple-500/5'
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-5xl mb-4">📂</div>
      {isDragActive ? (
        <p className="text-purple-400 text-lg font-semibold">Drop your log file here...</p>
      ) : (
        <>
          <p className="text-white text-lg font-semibold">
            Drag & drop your log file here
          </p>
          <p className="text-gray-400 text-sm mt-2">
            or click to browse — supports .log and .txt files
          </p>
          <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition">
            Browse File
          </button>
        </>
      )}
    </div>
  );
};

export default UploadZone;