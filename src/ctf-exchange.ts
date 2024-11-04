import { TokenRegistered as TokenRegisteredEvent } from "../generated/CTFExchange/CTFExchange";
import { Market } from "../generated/schema";
import { log } from "@graphprotocol/graph-ts";

// Helper function to define human-readable names for known market IDs
function getMarketName(marketId: string): string {
  const names = new Map<string, string>();
  names.set("100002649754046976236777458421672109661155194998083996335685969219064025530697", "Example Market A");
  names.set("10000250964337833121513756931256508142748634464847545039606029080452682260353", "Example Market B");

  // Default to "Market [ID]" if not predefined
  return names.get(marketId) || `Market ${marketId.substring(0, 8)}`;
}

// Event handler for TokenRegistered event
export function handleTokenRegistered(event: TokenRegisteredEvent): void {
  // Log to ensure we receive the event
  log.info("Received TokenRegistered event with transaction hash: {}", [event.transaction.hash.toHex()]);

  // Check and log each field in the event
  log.info("TokenRegistered event parameters - token0: {}, complement: {}, conditionId: {}", [
    event.params.token0.toString(),
    event.params.complement.toString(),
    event.params.conditionId.toHexString()
  ]);

  // Access token0 parameter as a string and use it as the ID
  const marketId = event.params.token0.toString();

  // Load or create a new Market entity
  let market = Market.load(marketId);
  if (!market) {
    log.info("Creating new Market entity with ID: {}", [marketId]);
    market = new Market(marketId);
    market.marketId = event.params.token0;
    market.name = getMarketName(marketId);
    market.save();
    log.info("Market entity created and saved with name: {}", [market.name]);
  } else {
    log.info("Market entity already exists with ID: {}", [marketId]);
  }
}
