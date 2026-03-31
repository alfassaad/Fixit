# **App Name**: FixIt

## Core Features:

- Multi-Role Authentication: Secure login system enabling citizens and administrators to access role-specific interfaces with appropriate layouts.
- Citizen Report Submission: A multi-step, guided form for citizens to easily report broken infrastructure, including category selection, location pinpointing on a simulated map, and photo uploads.
- Citizen Map & Issue Visualization: An interactive, simulated map displaying all reported issues as color-coded pins, allowing citizens to visualize and tap for brief summaries.
- AI Category Suggestion Tool: An AI-powered tool that suggests relevant categories and offers descriptive refinements during the report submission process, enhancing report accuracy.
- Admin Dashboard & Analytics: A comprehensive admin dashboard featuring key performance indicators (KPIs), monthly issue trends, category breakdowns, and resolution time charts using mock data.
- Admin Issue Management: Full data tables for viewing and filtering all reported issues, along with an intuitive Kanban board for managing issue statuses through drag-and-drop actions.
- Citizen Notification & Tracking: A personal notification center for citizens to track status updates, comments, and other important alerts related to their reported issues, with 'mark all read' functionality.

## Style Guidelines:

- Primary Color: #1A5276 (Deep Navy Blue) to convey a sense of reliability and official civic presence for branding and key elements.
- Accent Color: #2E86C1 (Bright Blue) to highlight interactive elements, calls to action, and indicate progress within the user interface.
- Background Color: #D6EAF8 (Pale Blue) and #F2F3F4 (Light Gray) for subtle, professional light backgrounds that ensure content readability.
- Semantic Colors: Utilize #1D8348 (Success Green) for resolved statuses, #D35400 (Warning Orange) for in-progress items, and #C0392B (Danger Red) for critical or open issues.
- Font family: 'Inter' (sans-serif) for all text elements, providing a modern and legible interface. Note: currently only Google Fonts are supported.
- Headings: Bold weight, set in the primary deep navy blue (#1A5276) for clear hierarchy and emphasis.
- Body Text: Regular weight, using a dark gray (#1C2833) for optimal readability across various content sections.
- Icons: Leverage 'Lucide React' for a comprehensive set of crisp, scalable vector icons, augmented by contextual emojis for categories and states (e.g., 🚧 for Roads).
- Adaptive Layouts: Implement mobile-first responsiveness for citizen-facing features with a bottom navigation bar, and desktop-first design for the admin panel featuring a left sidebar.
- Subtle Interactions: Smooth `transition-all duration-200` on interactive elements, with cards featuring subtle lift effects on hover (`hover:shadow-lg hover:-translate-y-0.5`).
- Feedback Animations: Implement loading spinners for page transitions, skeleton loaders for content areas, slide-in toast notifications for user actions, and a distinct green checkmark animation for submission success.
- Prominent Actions: A pulsing ring animation on the Floating Action Button (FAB) (`animate-ping`) to visually draw attention to the report submission function.