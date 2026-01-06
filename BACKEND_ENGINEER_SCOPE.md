# Backend Engineer Scope - Client Dashboard Integration

## Overview

This document outlines the complete scope of work needed to integrate the `clientdashboard` frontend with the `street-client` backend, including data aggregation, API endpoints, and real-time metrics tracking.

---

## Current State

### ✅ Completed (Frontend)
- Next.js frontend with Supabase authentication
- GitHub App installation flow
- Basic dashboard UI with navigation
- Authentication system (Supabase)
- GitHub integration UI components

### ✅ Completed (Backend - street-client)
- GitHub App webhook handling
- GitHub activity summarization
- Supabase JWT authentication support
- User/client management
- Installation linking by email/GitHub login

### ⚠️ Partially Complete
- GitHub activity display (frontend ready, needs backend data)
- Installation detection (works but needs refinement)

---

## Required Backend Work

### 1. GitHub Activity Integration ✅ (Mostly Done)

**Status:** Backend exists, needs minor fixes

**What's Needed:**
- ✅ Webhook handler for GitHub App installations (exists)
- ✅ User linking by email/GitHub login (exists)
- ⚠️ Ensure installation detection works reliably
- ⚠️ Add endpoint to fetch individual activity items (currently only summaries)

**Endpoints Needed:**
- `GET /api/clients/:clientId/summary/:period` - ✅ Exists (7days, 30days, all)
- `GET /api/clients/:clientId/activities` - ⚠️ May need to add for detailed activity list
- `GET /api/clients/:clientId/installations` - ✅ Exists

**Data Structure:**
```typescript
interface GitHubActivitySummary {
  total_activities: number
  commits: number
  pull_requests: number
  issues: number
  releases: number
  activities: GitHubActivity[] // Array of individual activities
}

interface GitHubActivity {
  id: string
  type: 'commit' | 'pull_request' | 'issue' | 'release'
  title: string
  author: string
  repository: string
  url: string
  timestamp: string
}
```

---

### 2. Token Price & Chart Integration 🆕

**Status:** Not implemented

**Requirements:**
- Fetch token price from blockchain/API (e.g., CoinGecko, DEX aggregator, or direct chain query)
- Store historical price data
- Provide real-time and historical price endpoints

**Endpoints Needed:**
```
GET /api/clients/:clientId/token/price
  Response: {
    current_price: number
    price_change_24h: number
    price_change_percentage_24h: number
    last_updated: string
  }

GET /api/clients/:clientId/token/history
  Query params: ?period=24h|7d|30d|1y
  Response: {
    prices: Array<{ timestamp: string, price: number }>
    volume_24h: number
    market_cap: number
  }
```

**Data Sources to Consider:**
- CoinGecko API (if token is listed)
- DEX aggregators (Uniswap, SushiSwap, etc.)
- Direct blockchain queries (if custom token)
- Price oracle services

**Storage:**
- Store historical prices in database (hourly/daily snapshots)
- Cache current price (update every 1-5 minutes)

---

### 3. X (Twitter) Followers & Engagement 🆕

**Status:** Not implemented

**Requirements:**
- Track Twitter/X follower count
- Track engagement metrics (likes, retweets, replies, impressions)
- Store historical data for charts
- Update metrics periodically (hourly/daily)

**Endpoints Needed:**
```
GET /api/clients/:clientId/social/twitter
  Response: {
    followers: number
    following: number
    engagement: {
      likes_24h: number
      retweets_24h: number
      replies_24h: number
      impressions_24h: number
    }
    last_updated: string
  }

GET /api/clients/:clientId/social/twitter/history
  Query params: ?period=7d|30d|90d|1y
  Response: {
    followers: Array<{ timestamp: string, count: number }>
    engagement: Array<{
      timestamp: string
      likes: number
      retweets: number
      replies: number
      impressions: number
    }>
  }
```

**Data Sources:**
- Twitter API v2 (requires Twitter Developer account)
- Alternative: Web scraping (less reliable, may violate ToS)
- Third-party services (Social Blade, etc.)

**Implementation Notes:**
- Twitter API requires OAuth 2.0 authentication
- Rate limits: 300 requests per 15 minutes (for basic tier)
- Store snapshots to avoid hitting rate limits
- Background job to update metrics periodically

---

### 4. Token Volume 🆕

**Status:** Not implemented

**Requirements:**
- Track trading volume (24h, 7d, 30d, all-time)
- Calculate volume trends
- Store historical volume data

**Endpoints Needed:**
```
GET /api/clients/:clientId/token/volume
  Query params: ?period=24h|7d|30d|all
  Response: {
    volume: number
    volume_change_percentage: number
    transactions_count: number
    average_transaction_size: number
    period: string
  }

GET /api/clients/:clientId/token/volume/history
  Query params: ?period=7d|30d|90d|1y
  Response: {
    volumes: Array<{ timestamp: string, volume: number, transactions: number }>
  }
```

**Data Sources:**
- Blockchain explorers (Etherscan, BSCScan, etc.)
- DEX APIs (Uniswap, PancakeSwap, etc.)
- On-chain analytics (The Graph, Dune Analytics)

**Implementation:**
- Query blockchain for token transfers
- Aggregate by time period
- Store daily/hourly snapshots

---

### 5. Revenue Tracking 🆕

**Status:** Not implemented

**Requirements:**
- Track revenue from various sources (token sales, fees, etc.)
- Calculate revenue trends
- Store historical revenue data

**Endpoints Needed:**
```
GET /api/clients/:clientId/revenue
  Query params: ?period=24h|7d|30d|all
  Response: {
    revenue: number
    revenue_change_percentage: number
    sources: {
      token_sales: number
      fees: number
      other: number
    }
    period: string
  }

GET /api/clients/:clientId/revenue/history
  Query params: ?period=7d|30d|90d|1y
  Response: {
    revenue: Array<{ timestamp: string, amount: number, source: string }>
  }
```

**Data Sources:**
- Blockchain transactions (token sales, fee collection)
- Payment processors (Stripe, PayPal, etc.)
- Custom business logic

**Implementation:**
- Track revenue-generating transactions
- Categorize by source
- Store daily snapshots

---

### 6. Holder Amount (Token Holders) 🆕

**Status:** Not implemented

**Requirements:**
- Track number of unique token holders
- Calculate holder distribution
- Store historical holder count

**Endpoints Needed:**
```
GET /api/clients/:clientId/token/holders
  Response: {
    total_holders: number
    unique_addresses: number
    holder_distribution: {
      whales: number      // >1% of supply
      large: number       // 0.1-1%
      medium: number      // 0.01-0.1%
      small: number       // <0.01%
    }
    last_updated: string
  }

GET /api/clients/:clientId/token/holders/history
  Query params: ?period=7d|30d|90d|1y
  Response: {
    holders: Array<{ timestamp: string, count: number }>
  }
```

**Data Sources:**
- Blockchain queries (ERC-20 token holder tracking)
- Token contract events
- Blockchain explorers

**Implementation:**
- Query token contract for holder addresses
- Calculate distribution by holding size
- Store daily snapshots

---

## Technical Requirements

### Authentication
- ✅ Supabase JWT tokens (already implemented)
- ✅ Session-based auth (fallback, already implemented)
- All endpoints must support both authentication methods

### Database Schema Additions

```sql
-- Token price history
CREATE TABLE token_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  price DECIMAL(18, 8) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  volume_24h DECIMAL(18, 8),
  market_cap DECIMAL(18, 8),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Twitter metrics
CREATE TABLE twitter_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  followers INTEGER NOT NULL,
  following INTEGER,
  likes_24h INTEGER,
  retweets_24h INTEGER,
  replies_24h INTEGER,
  impressions_24h INTEGER,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Token volume
CREATE TABLE token_volumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  volume DECIMAL(18, 8) NOT NULL,
  transactions_count INTEGER,
  period VARCHAR(20) NOT NULL, -- '24h', '7d', '30d', 'all'
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Revenue tracking
CREATE TABLE revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  amount DECIMAL(18, 8) NOT NULL,
  source VARCHAR(50) NOT NULL, -- 'token_sales', 'fees', 'other'
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Token holders
CREATE TABLE token_holders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  holder_count INTEGER NOT NULL,
  unique_addresses INTEGER,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Background Jobs

**Required Scheduled Tasks:**
1. **Token Price Updater** - Every 5 minutes
   - Fetch current token price
   - Store in database
   - Update cache

2. **Twitter Metrics Updater** - Every hour
   - Fetch follower count
   - Fetch engagement metrics
   - Store historical snapshots

3. **Token Volume Calculator** - Every hour
   - Query blockchain for transactions
   - Calculate volume
   - Store snapshots

4. **Holder Count Updater** - Every 6 hours
   - Query token contract
   - Count unique holders
   - Store snapshot

5. **Revenue Aggregator** - Every hour
   - Aggregate revenue from various sources
   - Store daily totals

### API Response Format

All endpoints should follow this structure:

```typescript
// Success Response
{
  data: T,
  meta?: {
    last_updated: string
    cache_ttl?: number
  }
}

// Error Response
{
  error: string
  message: string
  code?: string
}
```

### Caching Strategy

- **Current metrics**: Cache for 1-5 minutes (Redis or in-memory)
- **Historical data**: Cache for 1 hour
- **Charts data**: Cache for 15 minutes

### Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user
- Use Redis for rate limiting

---

## Frontend Integration Points

### 1. Dashboard Page (`/dashboard`)
**Needs:**
- Token price card with mini chart
- Follower count card
- Revenue card
- Holder count card
- GitHub activity summary card

### 2. Dev Update Page (`/dev-update`)
**Needs:**
- ✅ GitHub activity summary (partially done)
- ✅ GitHub activity list (partially done)
- Installation status (done)

### 3. New Pages Needed

**Token Analytics Page (`/token-analytics`)**
- Price chart (line/area chart)
- Volume chart
- Holder distribution chart
- Trading metrics

**Social Analytics Page (`/social-analytics`)**
- Follower growth chart
- Engagement metrics chart
- Post performance

**Revenue Page (`/revenue`)**
- Revenue chart
- Revenue by source
- Revenue trends

---

## Environment Variables Needed

```env
# Token/Blockchain
TOKEN_CONTRACT_ADDRESS=
BLOCKCHAIN_RPC_URL=
ETHERSCAN_API_KEY=  # or BSCScan, etc.
COINGECKO_API_KEY=   # optional

# Twitter/X
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_BEARER_TOKEN=
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=

# Revenue Tracking
STRIPE_SECRET_KEY=   # if using Stripe
PAYMENT_WEBHOOK_SECRET=

# Caching
REDIS_URL=           # optional, for caching
```

---

## Priority Order

### Phase 1: Core Metrics (Week 1-2)
1. ✅ GitHub activity integration (finish remaining work)
2. 🆕 Token price & chart
3. 🆕 Token volume

### Phase 2: Social & Engagement (Week 3)
4. 🆕 Twitter followers & engagement
5. 🆕 Historical charts for all metrics

### Phase 3: Business Metrics (Week 4)
6. 🆕 Revenue tracking
7. 🆕 Holder amount

### Phase 4: Polish (Week 5)
8. Performance optimization
9. Caching implementation
10. Error handling improvements

---

## Testing Requirements

- Unit tests for all new endpoints
- Integration tests for data aggregation
- E2E tests for critical user flows
- Load testing for high-traffic endpoints
- Data accuracy validation (compare with external sources)

---

## Documentation Needed

- API documentation (OpenAPI/Swagger)
- Database schema documentation
- Background job documentation
- Data source documentation
- Deployment guide

---

## Questions to Resolve

1. **Token Contract Details:**
   - What blockchain? (Ethereum, BSC, Polygon, etc.)
   - Token contract address?
   - Token standard? (ERC-20, BEP-20, etc.)

2. **Twitter/X Account:**
   - Twitter handle/username?
   - Do we have Twitter Developer API access?
   - What metrics are most important?

3. **Revenue Sources:**
   - What generates revenue? (Token sales, fees, subscriptions?)
   - How is revenue tracked currently?
   - Payment processors used?

4. **Data Update Frequency:**
   - How often should metrics update?
   - Real-time vs. periodic updates?

5. **Historical Data:**
   - Do we need to backfill historical data?
   - How far back should we go?

---

## Success Criteria

- ✅ All metrics display correctly on frontend
- ✅ Charts render with historical data
- ✅ Data updates within acceptable timeframes
- ✅ API response times < 200ms (cached) or < 2s (uncached)
- ✅ 99.9% uptime for data collection jobs
- ✅ Accurate data (validated against external sources)

---

## Notes

- Frontend is ready to consume all these endpoints
- Use existing authentication system (Supabase JWT)
- Follow existing code patterns in `street-client`
- All endpoints should be RESTful
- Use TypeScript for type safety
- Follow existing error handling patterns

