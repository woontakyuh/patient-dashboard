export default function FooterSection() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900">
              <svg
                className="h-4 w-4 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <circle cx="10" cy="3" r="2" />
                <circle cx="10" cy="7.5" r="1.8" />
                <circle cx="10" cy="11.5" r="1.6" />
                <circle cx="10" cy="15" r="1.4" />
                <circle cx="10" cy="18" r="1.2" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-slate-900">
              SpineTrack
            </span>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} SpineTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
