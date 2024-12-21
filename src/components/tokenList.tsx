import { TokenProcessState } from "@/types/TokenProcessState";
import TokenListElement from "@/components/token/token";

export function TokenList({
  tokenProcessState,
}: {
  tokenProcessState: TokenProcessState[];
}) {

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {tokenProcessState.map((token) => (
          <TokenListElement token={token} key={token.contract} />
        ))}
      </div>
    </div>
  );
}
