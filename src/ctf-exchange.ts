import { TokenRegistered as TokenRegisteredEvent } from "../generated/CTFExchange/CTFExchange";
import { Market } from "../generated/schema";

// Function to get human-readable names for markets based on their IDs
function getMarketName(marketId: string): string {
  let names = new Map<string, string>();
  names.set("100002649754046976236777458421672109661155194998083996335685969219064025530697", "Example Market A");
  names.set("10000250964337833121513756931256508142748634464847545039606029080452682260353", "Example Market B");

  // If marketId has a predefined name, return it; otherwise, return a default name
  return names.has(marketId) ? names.get(marketId) as string : `Market ${marketId.substring(0, 8)}`;
}

// Event handler for the TokenRegistered event
export function handleTokenRegistered(event: TokenRegisteredEvent): void {
  let market = Market.load(event.params.token0.toString());
  if (!market) {
    market = new Market(event.params.token0.toString());
  }

  market.marketId = event.params.token0;
  market.name = getMarketName(event.params.token0.toString());

  market.save();
}
