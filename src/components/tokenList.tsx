import { TokenProcessState } from "@/types/TokenProcessState";
import TokenListElement from "@/components/token/token";

export function TokenList({
  tokenProcessState,
  inputValue,
  handleSearchChange,
  clearSearch,
  loading
}: {
  tokenProcessState: TokenProcessState[];
  inputValue: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 pb-4">
        <div className="relative">
          <input
            type="search"
            value={inputValue}
            onChange={handleSearchChange}
            placeholder="Search by token or contract"
            className="w-full px-3 py-2 pr-10 border rounded-lg 
              bg-gray-50 dark:bg-gray-800 
              text-gray-900 dark:text-gray-100
              border-gray-200 dark:border-gray-700
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600"
          />
          {inputValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2
                text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300
                focus:outline-none text-xl font-medium"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {tokenProcessState.map((token) => (
          <TokenListElement token={token} key={token.contract} />
        ))}
      </div>

      {loading && (
        <div className="h-20 w-full flex items-center justify-center">
          <div className="animate-pulse text-sm text-gray-500">
            Loading more tokens...
          </div>
        </div>
      )}
    </div>
  );
}
