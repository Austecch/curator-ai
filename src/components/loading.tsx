export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-[#faf8fe] flex items-center justify-center z-[100]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#005cbb] flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg
            className="w-8 h-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <p className="text-[#5b5f6b] font-medium animate-pulse">Curator AI</p>
      </div>
    </div>
  );
}
