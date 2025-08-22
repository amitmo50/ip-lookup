# IP Lookup Tool

A React-based application for looking up geographical information of IP addresses including country, flag, and local timezone.

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

## How to Use

1. Enter an IP address in the input field
2. Press Enter or click the lookup button
3. View the results showing country, flag, and local time
4. Add more IP addresses using the "+" button
5. Remove entries using the "×" button

## API

Uses the [ipwho.is](https://ipwho.is) API for IP geolocation data.
