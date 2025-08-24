# IP Lookup Tool

A React-based application for looking up geographical information of IP addresses including country, flag, and local timezone.
<img width="1419" height="428" alt="Screenshot 2025-08-23 at 20 02 02" src="https://github.com/user-attachments/assets/10d71996-abfb-465e-8b3d-3060928e9de2" />

<img width="1416" height="281" alt="Screenshot 2025-08-23 at 20 02 19" src="https://github.com/user-attachments/assets/6ed61acd-7f8f-4e38-975e-8a15d2d65f76" />

## Features

- Look up multiple IP addresses simultaneously
- Display country, flag, and current local time for each IP
- Real-time validation and error handling
- Clean, responsive UI built with TailwindCSS and Radix UI

## Requirements

- Node.js 18 or higher
- npm

## Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

Build for production:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run the test suite:

```bash
npm run test
```

Run tests in watch mode (automatically re-runs tests when files change):

```bash
npm run test:watch
```

The project includes comprehensive unit tests for components and hooks using:

- **Vitest** - Fast test runner
- **Testing Library** - Component testing utilities
- **Jest DOM** - Custom Jest matchers for DOM elements

## How to Use

1. Enter an IP address in the input field
2. Press Enter or click the lookup button
3. View the results showing country, flag, and local time
4. Add more IP addresses using the "+" button
5. Remove entries using the "×" button

## API

Uses the [ipwho.is](https://ipwho.is) API for IP geolocation data.
