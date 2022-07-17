export default function ActionButton({ children }) {
  return (
    <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-200">
      {children}
    </div>
  );
}
