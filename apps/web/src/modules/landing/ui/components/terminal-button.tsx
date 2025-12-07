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
        <div className="relative flex items-center justify-center mt-4 mb-4">
          <button
            type="button"
            onClick={() => setIsTerminalVisible(!isTerminalVisible)}
            className="group relative inline-flex items-center gap-x-2 rounded border 
                       border-gray-200 bg-transparent text-gray-500 
                       dark:border-gray-800 dark:text-gray-500
                       px-3 py-1.5 font-mono text-xs backdrop-blur-sm 
                       transition-all duration-300 
                       hover:border-green-600/40 hover:text-green-600 
                       dark:hover:border-green-500/40 dark:hover:text-green-400 
                       cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">&gt;</span>
              <span className="tracking-wide">
                open_terminal
              </span>
            </span>
          </button>
        </div>
      </>
    );
  }
  