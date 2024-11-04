import { TokenRegistered as TokenRegisteredEvent } from "../generated/CTFExchange/CTFExchange";
import { Market } from "../generated/schema";

// Define a function to map market IDs to human-readable names
function getMarketName(marketId: string): string {
  const names: { [key: string]: string } = {
    "100002649754046976236777458421672109661155194998083996335685969219064025530697": "Example Market A",
    "10000250964337833121513756931256508142748634464847545039606029080452682260353": "Example Market B",
    // Add more known marketId mappings here as needed.
  };
  return names[marketId] || `Market ${marketId.substring(0, 8)}`; // Default fallback if no match
}

// Event handler for TokenRegistered
export function handleTokenRegistered(event: TokenRegisteredEvent): void {
  // Create or load a Market entity based on the `token0` value (marketId)
  let market = new Market(event.params.token0.toString());

  // Set the marketId and use the mapping function to assign a human-readable name
  market.marketId = event.params.token0.toString();
  market.name = getMarketName(market.marketId);

  // Store the condition ID or any other relevant data
  market.conditionId = event.params.conditionId;

  // Save the Market entity
  market.save();
}
