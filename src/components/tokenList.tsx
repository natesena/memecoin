import Link from "next/link";

interface UniqueToken {
  _id: string;
  contract: string;
  ticker: string;
}

export function TokenList({ tokens }: { tokens: UniqueToken[] }) {
  return (
    <div className="w-80 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto px-2">
      {tokens.map((token) => (
        <Link
          href={`/tokens/${token.contract}`}
          key={token.contract}
          className="block mb-4"
        >
          <div className="border p-3 rounded-lg transition-all duration-200 hover:border-green-500 hover:shadow-md hover:scale-[1.02] cursor-pointer">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 truncate">{token.ticker}</p>
                <p className="text-xs text-gray-400 truncate">
                  {token.contract}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
