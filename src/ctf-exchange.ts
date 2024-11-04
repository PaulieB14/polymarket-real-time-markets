import { TokenRegistered as TokenRegisteredEvent } from "../generated/CTFExchange/CTFExchange";
import { Market } from "../generated/schema";
import { Bytes, ByteArray, log } from "@graphprotocol/graph-ts";

// Helper function to define human-readable names for known market IDs
function getMarketName(marketId: string): Bytes {
  const names = new Map<string, string>();
  names.set("100002649754046976236777458421672109661155194998083996335685969219064025530697", "Example Market A");
  names.set("10000250964337833121513756931256508142748634464847545039606029080452682260353", "Example Market B");

  // Default to "Market [ID]" if not predefined
  const name = names.get(marketId) || `Market ${marketId.substring(0, 8)}`;
  return Bytes.fromUTF8(name); // Convert to Bytes
}

// Event handler for TokenRegistered event
export function handleTokenRegistered(event: TokenRegisteredEvent): void {
  const marketId = event.params.token0.toString(); // Use the token ID as string for ID

  // Load or create new Market entity
  let market = Market.load(marketId);
  if (!market) {
    market = new Market(marketId);
    market.marketId = event.params.token0;
    market.name = getMarketName(marketId);
    market.save();

    // Convert Bytes back to string for logging
    log.info("Market entity created and saved with name: {}", [market.name.toString()]);
  }
}
