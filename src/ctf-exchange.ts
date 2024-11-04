import { TokenRegistered as TokenRegisteredEvent } from "../generated/CTFExchange/CTFExchange";
import { Market } from "../generated/schema";
import { Bytes, log } from "@graphprotocol/graph-ts";

// Helper function to define human-readable names for known market IDs
function getMarketName(marketId: string): Bytes {
  const names = new Map<string, Bytes>();
  names.set(
    "95694627565725615019234034751263708018078773570114394909580057891995676392551",
    Bytes.fromUTF8("Example Market A")
  );
  names.set(
    "45701511219602880361246795515729229956843579777723672251724041809672358053949",
    Bytes.fromUTF8("Example Market B")
  );

  return names.get(marketId) || Bytes.fromUTF8(`Market ${marketId.substring(0, 8)}`);
}

// Event handler for TokenRegistered event
export function handleTokenRegistered(event: TokenRegisteredEvent): void {
  let marketId = event.params.token0.toHex(); // Convert token0 to a hex string for mapping
  let market = Market.load(marketId);

  if (!market) {
    market = new Market(marketId);
    market.marketId = Bytes.fromHexString(event.params.token0.toHex()); // Convert hex string to Bytes
    market.name = getMarketName(marketId); // Store name as Bytes
    market.conditionId = event.params.conditionId; // Store conditionId as Bytes
    market.save();

    log.info("Market entity created with ID: {}, name: {}", [
      marketId,
      market.name.toHexString()
    ]);
  }
}
