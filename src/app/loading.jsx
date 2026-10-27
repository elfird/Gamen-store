export default function RootLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-4" />
      <p className="text-xs tracking-wider uppercase text-secondary font-medium animate-pulse">
        Memuat Gamen Store...
      </p>
    </div>
  );
}
