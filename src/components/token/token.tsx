import Link from "next/link";
import { TokenProcessState } from "@/types/TokenProcessState";

export default function TokenListElement({
  token,
}: {
  token: TokenProcessState;
}) {
  return (
    <Link
      href={`/tokens/${token.contract}`}
      key={token.contract}
      className="block mb-4"
    >
      <div className="border p-3 rounded-lg transition-all duration-200 hover:border-green-500 hover:shadow-md hover:scale-[1.02] cursor-pointer">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 truncate">{token.name}</p>
              <p className="text-xs text-gray-400 truncate">
                {`${token.contract.slice(0, 6)}...${token.contract.slice(-4)}`}
              </p>
              <div className="flex items-center gap-2">
                {token.completed && (
                  <p className="text-xs text-green-500">Done</p>
                )}
                {token.loading && (
                  <p className="text-xs text-blue-500">Loading</p>
                )}
                {token.error && <p className="text-xs text-red-500">Error</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
