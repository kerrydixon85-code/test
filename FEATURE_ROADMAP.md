# AirMiles Flight Search - Feature Roadmap & API Integration Proposal

## Part 1: Seats.aero Feature Implementation Plan

Based on analysis of seats.aero, the leading award flight search platform, here are all features to implement:

---

## 🎯 Core Search Features

### ✅ Already Implemented
- [x] Basic route search (origin to destination)
- [x] 6-month date range search
- [x] Calendar view with pricing
- [x] Sort by miles or date
- [x] Round trip search
- [x] Filter by cabin class
- [x] Filter by airlines
- [x] Filter by stops

### 🚀 To Implement

#### 1. **Advanced Search Capabilities**
- [ ] Multi-city search (up to 5 segments)
- [ ] Flexible date search (+/- 7 days for free, +/- 180 days for Pro)
- [ ] One-way, round-trip, and multi-city toggle
- [ ] Search by airline alliance (Star Alliance, OneWorld, SkyTeam)
- [ ] Non-stop only filter
- [ ] Maximum connection time filter

#### 2. **Live Search vs Cached Results**
- [ ] **Free Tier**: Cached results (updated every few minutes)
- [ ] **Pro Tier**: Real-time live search directly from airline sources
- [ ] Background continuous scanning (every few seconds like seats.aero)
- [ ] Last updated timestamp display
- [ ] Manual refresh button

#### 3. **Extended Date Range**
- [ ] **Free**: 60 days ahead
- [ ] **Pro**: Full year (365 days) ahead
- [ ] Award release date tracking (when new inventory becomes available)
- [ ] Award release calendar tool

---

## 📊 Calendar & Visualization Features

### 4. **Enhanced Calendar View**
- [ ] Month-by-month grid view (currently have basic version)
- [ ] Heat map showing availability density
- [ ] Multiple months displayed simultaneously (3-6 months)
- [ ] Hover tooltips showing flight count and lowest fare
- [ ] Click to filter by selected date
- [ ] Award chart pricing by program
- [ ] Saver vs standard award indicators

### 5. **Timeline View**
- [ ] Horizontal date picker with pricing bars
- [ ] Quick date range selection
- [ ] Visual price trends over time
- [ ] Best price indicators

---

## 🔔 Alert & Notification System

### 6. **Flight Alerts**
- [ ] Set alerts for specific routes
- [ ] Alert when award space opens up
- [ ] Alert for price drops (miles required)
- [ ] Alert for cabin class upgrades available
- [ ] **Free**: Email notifications only
- [ ] **Pro**: SMS + Email notifications
- [ ] Unlimited alerts for Pro users
- [ ] Alert management dashboard
- [ ] Alert history and tracking

### 7. **Hotel Alerts**
- [ ] Hotel award availability alerts
- [ ] Points redemption alerts
- [ ] Price monitoring for hotel stays

---

## 🛠️ Specialized Finder Tools

### 8. **Premium Cabin Finders**
Priority implementation order:

1. **First Class Finders**
   - [ ] ANA First Class availability finder
   - [ ] JAL First Class availability finder
   - [ ] Lufthansa First Class availability finder
   - [ ] Emirates First Class availability finder
   - [ ] Singapore Airlines Suites availability finder

2. **Business Class Finders**
   - [ ] Qatar Qsuites finder
   - [ ] Delta One finder
   - [ ] Emirates Business Class finder
   - [ ] ANA "The Room" finder
   - [ ] Virgin Atlantic Upper Class finder

3. **Premium Economy Finders**
   - [ ] Route-specific premium economy availability

### 9. **Upgrade Tools**
- [ ] Air Canada eUpgrade finder
- [ ] United PlusPoints finder
- [ ] British Airways Avios upgrade finder
- [ ] Emirates Skywards upgrade finder
- [ ] Automatic upgrade availability scanner

---

## 🌍 Route & Program Coverage

### 10. **Airline Program Support** (Target: 24+ programs)

**Star Alliance:**
- [ ] United MileagePlus
- [ ] Air Canada Aeroplan
- [ ] Lufthansa Miles & More
- [ ] ANA Mileage Club
- [ ] Singapore Airlines KrisFlyer
- [ ] Turkish Airlines Miles&Smiles

**OneWorld:**
- [ ] American AAdvantage
- [ ] British Airways Executive Club
- [ ] Qantas Frequent Flyer
- [ ] JAL Mileage Bank
- [ ] Qatar Airways Privilege Club
- [ ] Cathay Pacific Asia Miles

**SkyTeam:**
- [ ] Delta SkyMiles
- [ ] Air France/KLM Flying Blue
- [ ] Virgin Atlantic Flying Club

**Independent:**
- [ ] Emirates Skywards
- [ ] Etihad Guest
- [ ] JetBlue TrueBlue
- [ ] Southwest Rapid Rewards
- [ ] Alaska Mileage Plan

### 11. **Route Tracking**
- [ ] Route database (all tracked routes)
- [ ] Route statistics (avg availability, avg cost per day)
- [ ] Route request system (Pro users can request new routes)
- [ ] Popular routes dashboard
- [ ] Route performance analytics

---

## 👤 User Account & Management

### 12. **User Profile**
- [ ] Save favorite routes
- [ ] Saved searches
- [ ] Search history
- [ ] Loyalty program balance tracking
- [ ] Points expiration warnings
- [ ] Multiple traveler profiles

### 13. **Subscription Tiers**

**Free Tier:**
- Search 60 days ahead
- Cached results only
- Email alerts
- Basic filters
- Limited route coverage

**Pro Tier ($9.99/month or $99.99/year):**
- Search 365 days ahead
- Real-time live search
- SMS + Email alerts
- All premium cabin finders
- Upgrade tools
- Route statistics
- Unlimited alerts
- Priority support
- Advanced filters

---

## 📱 Additional Features

### 14. **Seat Map Viewer**
- [ ] Visual seat maps for flights
- [ ] Available award seats highlighted
- [ ] Seat selection preview
- [ ] Seat features (lie-flat, extra legroom, etc.)

### 15. **Fare Class Viewer**
- [ ] Booking class availability (Y, J, F, etc.)
- [ ] Award chart reference
- [ ] Miles required by booking class
- [ ] Fare rules and restrictions

### 16. **Booking Integration**
- [ ] Deep links to airline booking pages
- [ ] Pre-filled search parameters
- [ ] Points transfer calculator
- [ ] Miles + cash options display

### 17. **Analytics Dashboard**
- [ ] Award availability trends
- [ ] Best time to book analytics
- [ ] Seasonal pricing patterns
- [ ] Competition metrics (how many seats left)

### 18. **Mobile App**
- [ ] iOS app
- [ ] Android app
- [ ] Push notifications for alerts
- [ ] Offline saved searches

### 19. **Social & Sharing**
- [ ] Share flight finds with others
- [ ] Award travel community forum
- [ ] Success stories
- [ ] Trip planning collaboration

---

## 🎨 UI/UX Enhancements

### 20. **Interface Improvements**
- [ ] Dark mode
- [ ] Customizable dashboard
- [ ] Quick filters sidebar
- [ ] Map view of routes
- [ ] Price/availability graphs
- [ ] Comparison tool (compare multiple routes side-by-side)
- [ ] Trip planner (multi-destination itinerary builder)

---

## Part 2: Real-Time Airline API Integration Proposal

---

## 🔌 API Integration Strategy

### Option 1: Global Distribution Systems (GDS) - **NOT RECOMMENDED for Award Flights**

**Providers:**
- Amadeus
- Sabre
- Travelport (Galileo)

**Pros:**
- Comprehensive paid ticket inventory
- Established systems
- Good documentation

**Cons:**
- ❌ **No award availability data** (only paid tickets)
- ❌ Expensive licensing fees
- ❌ Complex integration
- ❌ Not suitable for loyalty program searches

**Verdict:** GDS systems are designed for booking paid tickets, not award availability. **Do not pursue this route.**

---

### Option 2: Airline Loyalty Program APIs - **RECOMMENDED (Long-term)**

**Direct Integration Approach:**

#### Partner Airlines with Public APIs:

1. **United Airlines MileagePlus**
   - Has developer portal
   - Award search API available
   - Requires partnership agreement

2. **Air Canada Aeroplan**
   - API access for partners
   - Real-time availability

3. **British Airways Executive Club**
   - Limited API access
   - Requires business partnership

#### Implementation Plan:

**Phase 1: Single Airline Partnership (Months 1-3)**
- Target: United MileagePlus or Air Canada Aeroplan
- Requirements:
  - Business entity registration
  - Partnership application
  - Legal agreements (NDA, Terms of Use)
  - API credentials and access tokens
  - Rate limiting compliance

**Phase 2: Expand Coverage (Months 4-12)**
- Add 3-5 additional airline partnerships
- Focus on major alliances
- Build standardized integration layer

**Phase 3: Full Coverage (Year 2)**
- Target 20+ airline programs
- Complete alliance coverage
- Automated fallback mechanisms

**Cost Estimate:**
- Partnership fees: $5,000 - $50,000 per airline/year
- Development: $50,000 - $150,000
- Ongoing API usage: $1,000 - $10,000/month

---

### Option 3: Third-Party Aggregator APIs - **RECOMMENDED (Short-term)**

#### **A. AwardWallet APIs**

**Available APIs:**

1. **Web Parsing API**
   - Supports 600+ loyalty programs
   - Retrieves account balances, elite status, expiration dates
   - JSON format responses
   - OAuth2 authentication

2. **Email Parsing API**
   - Extracts reservation data from confirmation emails
   - Returns structured JSON
   - Automatic parsing

3. **Account Access API**
   - OAuth2 protocol
   - Structured JSON data
   - Real account access

**Pricing:** Contact for enterprise pricing

**Pros:**
- ✅ 600+ programs supported
- ✅ Established, reliable service
- ✅ Good documentation
- ✅ OAuth2 security

**Cons:**
- ❌ May not include real-time award availability search
- ❌ Focused on account balance tracking
- ❌ Subscription-based pricing

#### **B. Milez.biz API**

**Features:**
- JSON format data delivery
- Subscription-based access
- User-friendly integration

**Pros:**
- ✅ Straightforward API
- ✅ Award availability focus

**Cons:**
- ❌ Less comprehensive than seats.aero
- ❌ Pricing unknown

#### **C. AwardFares Partnership**

**Features:**
- Real-time search
- 1:1 accuracy with airline programs
- Comprehensive coverage

**Approach:**
- White-label partnership
- API reselling agreement
- Revenue sharing model

**Pros:**
- ✅ Proven real-time accuracy
- ✅ No direct airline partnerships needed
- ✅ Faster time to market

**Cons:**
- ❌ Dependent on third party
- ❌ Revenue sharing reduces margins
- ❌ Limited customization

---

### Option 4: Web Scraping (How Seats.aero Started) - **LEGAL RISK**

**Approach:**
- Automated scraping of airline websites
- Headless browsers (Puppeteer, Selenium)
- Proxy rotation to avoid blocking
- Data normalization layer

**Pros:**
- ✅ No API fees
- ✅ Complete control
- ✅ Any airline can be scraped

**Cons:**
- ❌ Legal gray area (Terms of Service violations)
- ❌ Constant maintenance (websites change)
- ❌ IP blocking risks
- ❌ Unreliable and slow
- ❌ Resource intensive

**Verdict:** **Only use as temporary fallback**, not primary strategy.

---

## 📋 Recommended Implementation Roadmap

### **Phase 1: MVP with Dummy Data (Current - Month 2)**
✅ **Status: 90% Complete**

- Enhanced dummy data generation
- All UI features from seats.aero
- Alert system (email only)
- Free tier functionality
- Beta testing

### **Phase 2: Third-Party API Integration (Months 2-4)**
🎯 **Primary Goal: Real Data**

**Choose ONE:**

**Option A: AwardWallet API** (Recommended if focused on account tracking)
- Integrate Web Parsing API
- Add account balance tracking
- Implement email parsing
- Build alert system on top

**Option B: White-label Partnership with AwardFares/Point.me**
- Negotiate API access
- Revenue sharing agreement
- Faster to market with real data

**Option C: Build Proprietary Scraping Infrastructure**
- Only if budget < $50k
- Use as temporary bridge
- Plan migration path

### **Phase 3: Direct Airline Partnerships (Months 5-12)**
🤝 **Strategic Partnerships**

1. Apply for airline partnership programs
2. Start with United or Air Canada
3. Build standardized integration framework
4. Add 2-3 airlines per quarter
5. Expand to 10+ programs by year-end

### **Phase 4: Scale & Monetization (Year 2)**
💰 **Business Model**

- Free tier: 60-day cached results
- Pro tier: $9.99/month (real-time, alerts, finders)
- Enterprise tier: $49.99/month (API access, white-label)

**Revenue projections:**
- Year 1: 10,000 free users, 1,000 paid = $120k ARR
- Year 2: 50,000 free users, 5,000 paid = $600k ARR
- Year 3: 200,000 free users, 20,000 paid = $2.4M ARR

---

## 🏗️ Technical Architecture

### Recommended Stack:

**Backend:**
- Node.js / Python (FastAPI) for API layer
- PostgreSQL for flight data storage
- Redis for caching layer
- Bull/Celery for background jobs (scraping, alerts)
- AWS Lambda for serverless scraping
- RabbitMQ for message queue

**Frontend:**
- Keep existing React + TypeScript + Vite
- Add React Query for data fetching
- Add Zustand for global state
- WebSockets for real-time updates

**Infrastructure:**
- AWS or Google Cloud
- CDN (CloudFront/Cloudflare)
- Monitoring (DataDog/Sentry)
- CI/CD (GitHub Actions)

---

## 💰 Cost Analysis

### Initial Development (6 months):
- Development team (2-3 devs): $150,000 - $300,000
- API integrations: $50,000 - $100,000
- Infrastructure: $5,000 - $10,000
- Legal (partnerships): $10,000 - $25,000
- **Total: $215,000 - $435,000**

### Monthly Operating Costs:
- Infrastructure (AWS): $2,000 - $5,000
- API fees: $1,000 - $10,000
- Staff: $25,000 - $50,000
- **Total: $28,000 - $65,000/month**

### Break-even Analysis:
- Need 2,800 - 6,500 Pro subscribers ($9.99/mo)
- Or 1,400 - 3,250 annual subscribers ($99/yr)
- Achievable in 12-18 months with proper marketing

---

## 🎯 Immediate Next Steps (Priority Order)

### Week 1-2:
1. ✅ Complete remaining UI features from seats.aero
2. ✅ Build alert system infrastructure (email)
3. ✅ Implement all finder tools (dummy data)
4. ✅ Add subscription tier UI

### Week 3-4:
5. 🔍 Research and contact potential API partners:
   - Email AwardWallet for API pricing
   - Contact AwardFares for partnership
   - Reach out to Point.me for white-label
   - Apply for United MileagePlus API access

### Month 2:
6. 🤝 Sign agreement with chosen API provider
7. 💻 Integrate first real-time data source
8. 🧪 Beta test with 100 users
9. 📱 Launch MVP with real data

### Month 3-4:
10. 📈 Scale infrastructure
11. 🚀 Public launch
12. 💰 Enable Pro subscriptions
13. 📊 Analytics and optimization

---

## 📚 Sources & References

- [How to use Seats.aero - The Points Guy](https://thepointsguy.com/travel/seats-aero/)
- [Seats.aero Award Search Tool Review - NerdWallet](https://www.nerdwallet.com/travel/learn/seats-aero-review)
- [Guide to Seats.aero - AwardWallet](https://awardwallet.com/travel/seats-aero-guide/)
- [Seats.aero Review - One Mile at a Time](https://onemileatatime.com/guides/seats-aero/)
- [How To Use Seats.aero - Upgraded Points](https://upgradedpoints.com/travel/airlines/seats-aero/)
- [AwardWallet Travel & Loyalty APIs](https://awardwallet.com/api/main)
- [Flight API Integration Overview](https://coaxsoft.com/blog/airline-flight-booking-apis)
- [Amadeus vs Sabre vs Travelport Comparison](https://www.trawex.com/travelport-vs-amadeus-vs-sabre-gds.php)
- [Best Travel Data Providers 2026](https://medium.com/@datajournal/best-travel-data-providers-501da5884cd7)

---

**Document Version:** 1.0
**Last Updated:** January 11, 2026
**Next Review:** February 2026
