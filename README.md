# Alpatech Onboard Hub

A comprehensive onboarding and training management system for Alpatech Training Centre.

## Project Overview

The Alpatech Onboard Hub is a web application designed to streamline the onboarding process for trainees and provide training management tools for staff. The system includes:

- Secure trainee login with passcode validation
- Structured onboarding flow with dynamic form assignment
- Training management for coordinators and supervisors
- Supabase integration for data persistence
- Comprehensive form management and validation

## Key Features

### Trainee Experience
- Secure login with coordinator-generated passcodes
- Step-by-step onboarding process
- Form submission with validation
- Dashboard for tracking progress and assigned trainings

### Staff Experience
- Passcode generation and management
- Training assignment for trainees
- Form review and approval
- Comprehensive reporting and management tools

## Technical Implementation

### Frontend
- React with TypeScript
- Shadcn UI components
- React Router for navigation
- Zustand for state management

### Backend
- Supabase for database and authentication
- SQL schema for structured data storage
- RESTful API integration

## Onboarding Flow

The trainee onboarding process follows this sequence:

1. **Trainee Login**: Secure access with coordinator-generated passcode
2. **AENL No Gift Policy**: Acknowledgment of company policies
3. **Course Registration**: Personal and course details
4. **Medical Screening**: Health assessment for training suitability
5. **Dynamic Training Forms**: Additional forms based on assigned training modules
6. **Dashboard Access**: Upon completion, access to training materials and resources

## Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Mikecode2005/alpatech-onboard-hub.git
cd alpatech-onboard-hub
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file with the following variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Database Schema

The application uses the following main tables in Supabase:

- `users`: User accounts and roles
- `passcodes`: Generated access codes for trainees
- `welcome_policy_forms`: No Gift Policy acknowledgments
- `course_registration_forms`: Course registration details
- `medical_screening_forms`: Medical assessment information
- `training_assignments`: Assigned training modules
- `bosiet_forms`, `fire_watch_forms`, `cser_forms`: Training-specific forms
- `requests_complaints`: User requests and complaints

## Recent Updates

- Implemented trainee login with passcode validation
- Reordered onboarding flow to match requirements
- Added Supabase integration for data persistence
- Created passcode management interface for coordinators
- Updated form pages to save data to Supabase
- Added dynamic form assignment based on training supervisor selections

## Future Enhancements

- Email notifications for passcode generation
- Mobile-responsive design improvements
- Advanced reporting and analytics
- Integration with external training systems
- Offline support for remote training locations

## Contributors

- [Mike Code](https://github.com/Mikecode2005)

## Project info

**URL**: https://lovable.dev/projects/994ccf8a-a705-4982-a602-5dd479e09842

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/994ccf8a-a705-4982-a602-5dd479e09842) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.