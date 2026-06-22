export default function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Carregando...</p>
      </div>
    </div>
  );
}
