import { TokenProcessState } from "@/types/TokenProcessState";
import TokenListElement from "@/components/token/token";
export function TokenList({
  tokenProcessState,
}: {
  tokenProcessState: TokenProcessState[];
}) {
  return (
    <div className="w-80 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto px-2">
      {tokenProcessState.map((token) => (
        <TokenListElement token={token} key={token.contract} />
      ))}
    </div>
  );
}
