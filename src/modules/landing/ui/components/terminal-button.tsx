interface TerminalButtonProps {
    isTerminalVisible: boolean;
    setIsTerminalVisible: (isTerminalVisible: boolean) => void;
  }
  export default function TerminalButton({
    isTerminalVisible,
    setIsTerminalVisible,
  }: TerminalButtonProps) {
    return (
      <>
        <div className="relative flex items-center justify-center mt-16 lg:mt-32">
          <button
            type="button"
            onClick={() => setIsTerminalVisible(!isTerminalVisible)}
            className="group relative inline-flex items-center gap-x-2 rounded border-2 
                       border-green-600/40 bg-white/90 text-green-700 
                       shadow-lg shadow-green-600/10 
                       dark:border-green-500/50 dark:bg-black/80 dark:text-green-400 
                       dark:shadow-green-500/20 
                       px-6 py-5 font-mono text-sm font-bold backdrop-blur-sm 
                       transition-all duration-300 
                       hover:border-green-600 hover:bg-green-50/95 hover:text-green-800 
                       hover:shadow-xl hover:shadow-green-600/20 
                       dark:hover:border-green-400 dark:hover:bg-green-950/50 dark:hover:text-green-300 
                       dark:hover:shadow-green-500/40 
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 
                       dark:focus-visible:outline-green-500 
                       cursor-pointer active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-green-600 dark:text-green-500 animate-pulse text-2xl">&gt;</span>
              <span className="tracking-wide text-xl">
                I code for living, show me the terminal
              </span>
            </span>
            {/* Matrix-like glow effect */}
            <span className="absolute inset-0 rounded bg-linear-to-r from-transparent via-green-600/5 dark:via-green-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            {/* Scanline effect */}
            <span className="pointer-events-none absolute inset-0 rounded 
                           bg-[linear-gradient(transparent_50%,rgba(22,101,52,0.02)_50%)] 
                           dark:bg-[linear-gradient(transparent_50%,rgba(34,197,94,0.03)_50%)] 
                           bg-size-[100%_4px]" />
          </button>
        </div>
      </>
    );
  }
  