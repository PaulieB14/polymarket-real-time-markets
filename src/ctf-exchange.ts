import { TokenRegistered as TokenRegisteredEvent } from "../generated/CTFExchange/CTFExchange"
import { Market } from "../generated/schema"

export function handleTokenRegistered(event: TokenRegisteredEvent): void {
  // Use token0 as the unique identifier for the market
  let market = Market.load(event.params.token0.toString())
  
  if (!market) {
    // Create a new Market entity if it does not exist
    market = new Market(event.params.token0.toString())
    market.marketId = event.params.token0

    // Assign a human-readable name (you may replace this with more dynamic logic if available)
    market.name = `Market ${event.params.token0.toString()}`
  }

  // Save the Market entity
  market.save()
}
