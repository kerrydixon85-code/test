# AirMiles Flight Search ✈️

A beautiful, modern web application for searching and booking flights using airmiles. Search flights from any UK airport to international destinations worldwide.

![AirMiles Flight Search](https://img.shields.io/badge/Built%20with-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- 🔍 **Smart Search** - Search flights from any UK airport to 40+ international destinations
- 🎨 **Beautiful UI** - Modern glass-morphism design inspired by roame.travel premium
- 📅 **Flexible Dates** - Search with ±3 days flexibility
- ✈️ **Comprehensive Filters**:
  - Cabin class (Economy, Premium Economy, Business, First)
  - Maximum stops (Non-stop, 1 stop, 2 stops)
  - Airlines (20+ major carriers)
  - Miles range
- 💺 **Live Availability** - See real-time seat availability
- 🏆 **Award Miles** - View flights sorted by miles required
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd airmiles-search
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📦 Build for Production

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🌐 Deploy to GitHub Pages

### Option 1: Manual Deployment

1. Build and deploy:
```bash
npm run deploy
```

This will build the app and deploy it to the `gh-pages` branch.

### Option 2: Automatic Deployment with GitHub Actions

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the main branch.

To enable it:

1. Go to your repository Settings
2. Navigate to Pages (in the sidebar)
3. Under "Build and deployment", select "GitHub Actions" as the source
4. Push to main branch and the site will automatically deploy

Your site will be available at: `https://<username>.github.io/<repository>/`

## 🎯 How to Use

1. **Select Origin** - Choose your departure airport (all major UK airports available)
2. **Select Destination** - Choose your destination from 40+ international airports
3. **Pick a Date** - Select your departure date
4. **Choose Cabin Class** - Economy, Premium Economy, Business, or First
5. **Enable Flexible Dates** (optional) - Search ±3 days around your selected date
6. **Click Search** - View available flights
7. **Apply Filters** - Refine results by airline, stops, cabin class, or miles
8. **Book** - Click the book button on your preferred flight

## 🛠️ Tech Stack

- **Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.3
- **Styling**: Tailwind CSS 4.1 with custom glass-morphism effects
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Deployment**: GitHub Pages

## 📁 Project Structure

```
airmiles-search/
├── src/
│   ├── components/
│   │   ├── SearchBar.tsx      # Search interface
│   │   ├── FlightCard.tsx     # Flight result card
│   │   └── FilterSidebar.tsx  # Filters panel
│   ├── data/
│   │   ├── airports.ts        # UK & international airports
│   │   ├── airlines.ts        # Major airlines
│   │   └── flights.ts         # Dummy flight data generator
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   ├── App.tsx                # Main application
│   ├── index.css              # Global styles
│   └── main.tsx               # Entry point
├── public/                    # Static assets
└── dist/                      # Production build
```

## 🎨 Design Features

- **Glass Morphism** - Modern frosted glass effect on cards and panels
- **Gradient Backgrounds** - Smooth color transitions
- **Hover Effects** - Interactive card animations
- **Responsive Grid** - Adapts to all screen sizes
- **Color-coded Availability** - Visual indicators for seat availability
- **Cabin Class Badges** - Easy identification of flight class

## 📊 Data

Currently, the app uses **dummy data** for demonstration purposes:
- 12 UK Airports
- 40+ International Airports
- 20+ Airlines
- 500+ Generated Flights

## 🔮 Future Enhancements

- Integration with real flight APIs
- User authentication and saved searches
- Price alerts and notifications
- Multi-city search
- Return flight booking
- Points calculator
- Loyalty program integration
- Advanced calendar view

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- UI/UX inspired by [roame.travel](https://roame.travel) premium
- Icons by [Lucide](https://lucide.dev)
- Built with [Vite](https://vitejs.dev) and [React](https://react.dev)

---

Built with ❤️ for travelers who love to maximize their airmiles
