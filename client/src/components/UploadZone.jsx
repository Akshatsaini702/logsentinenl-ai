import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload, FileText } from "lucide-react";

const UploadZone = ({ onFileSelect, disabled = false }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) onFileSelect(acceptedFiles[0]);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    // Browsers report .log files inconsistently, so accept by extension too.
    accept: { "text/plain": [".log", ".txt"] },
    maxFiles: 1,
    multiple: false,
    disabled,
  });

  const borderTone = isDragReject
    ? "border-rose-500/60 bg-rose-500/5"
    : isDragActive
    ? "border-violet-400/70 bg-violet-500/10"
    : "border-white/15 hover:border-violet-500/50 hover:bg-white/[0.04]";

  return (
    <div
      {...getRootProps()}
      className={`group relative cursor-pointer rounded-2xl border-2 border-dashed px-6 py-12 text-center transition duration-300 ${borderTone} ${
        disabled ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <input {...getInputProps()} />

      <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
        {isDragActive && (
          <span className="absolute inset-0 animate-pulse-ring rounded-2xl bg-violet-500/40" />
        )}
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-500/25 transition group-hover:scale-105">
          {isDragActive ? (
            <FileText className="h-7 w-7 text-violet-200" />
          ) : (
            <CloudUpload className="h-7 w-7 text-violet-300" />
          )}
        </span>
      </div>

      {isDragReject ? (
        <p className="font-semibold text-rose-300">
          That file type isn&apos;t supported
        </p>
      ) : isDragActive ? (
        <p className="font-semibold text-violet-200">Drop it to load the file</p>
      ) : (
        <>
          <p className="heading text-base">Drag &amp; drop your log file</p>
          <p className="mt-1.5 text-sm text-slate-400">
            or <span className="text-violet-300 underline underline-offset-4">browse</span> to choose one
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Supports .log and .txt — up to 10&nbsp;MB
          </p>
        </>
      )}
    </div>
  );
};

export default UploadZone;
