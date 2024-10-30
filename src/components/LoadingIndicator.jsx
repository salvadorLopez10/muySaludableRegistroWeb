function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center absolute inset-0 bg-gray-700 bg-opacity-50">
      {/* Indicador de carga */}
      <svg
        className="animate-spin h-10 w-10 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>

      {/* Texto de carga */}
      <p className="text-white text-lg mt-3 font-medium">Cargando...</p>
    </div>
  );
}

export default LoadingIndicator;
