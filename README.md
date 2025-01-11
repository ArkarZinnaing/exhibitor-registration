# Exhibitor Registration Form

A mobile-responsive web application that allows exhibitors to register their colleagues during onsite events. Built with Angular and Bootstrap, this application provides a streamlined registration process with real-time validation and multi-user registration capabilities.

## Features

- Event-based company filtering
- Dynamic exhibitor card management (add/remove)
- Real-time form validation
- Multi-user registration support
- Mobile responsive design
- Progress indicator for multiple registrations
- Save registration confirmation as image
- API integration with error handling

## Prerequisites

- Node.js (v14 or higher)
- Angular CLI (v14 or higher)
- npm package manager

## Installation

1. Clone the repository:
```bash
git clone [https://github.com/ArkarZinnaing/exhibitor-registration.git]
cd exhibitor-registration
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Navigate to `http://localhost:4200` in your browser

## Tech Stack

- **Angular 14+**: Frontend framework
- **TypeScript**: Programming language
- **Bootstrap 5.x**: UI framework
- **RxJS**: Reactive programming library
- **html2canvas**: For saving registration confirmation as image

## Third-Party Libraries


- **html2canvas**: HTML to canvas conversion
  - Purpose: Enables saving registration confirmation as image
  - Version: 1.4.1


## API Integration

Base URL: `https://staging-fha-2024.occamlab.com.sg/api/`

Endpoints:
- `/exhibitor-company-list`: GET - Retrieves company list filtered by event
- `/add-exhibitor`: POST - Registers new exhibitor(s)

Note: API is CORS-protected and only accepts requests from `localhost:4200`

## Browser Support

- Chrome 
- Firefox 
- Safari
- Mobile browsers 

## Known Limitations & Future Improvements

1. Advanced Features & Extensibility
  - Add multi-language support for international events
  - Create an exhibitor dashboard to view all registrations
  - Add integration with event calendar systems

2. User Experience
  - Add form state persistence to prevent data loss on accidental refresh
  - Implement batch validation for multiple exhibitor cards
  - Add preview functionality before final submission
  - Enhance QR code scanning integration
  - Improve error message display and formatting
  - Add confirmation step before removing exhibitor cards
  - Implement progressive form filling to reduce initial cognitive load

3. Technical Debt
  - Add comprehensive unit tests
  - Implement E2E testing
  - Add error boundary handling
  - Improve type safety

