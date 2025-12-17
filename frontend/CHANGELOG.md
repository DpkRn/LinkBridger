# Changelog

All notable changes to the frontend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed - 2024-12-19
+- **Added Missing Features to HomePage and Documentation**: Added two important features that were missing
+  - **All Links at One Place**: Added feature highlighting the hub link functionality
+    - Users can access all their links by visiting https://clickly.cv/username (without platform name)
+    - Creates a beautiful landing page showing all profiles in one place
+    - Perfect for sharing in bios, resumes, and business cards
+    - Added to HomePage features section with FaHome icon
+    - Updated in Documentation page with enhanced description
+  - **Real-Time Email Notifications**: Added email notification feature
+    - Get instant email notifications every time someone visits your links
+    - Stay informed about who's checking out your profiles in real-time
+    - Perfect for tracking engagement and knowing when potential clients or employers view your links
+    - Added to HomePage features section with FaEnvelope icon
+    - Added to Documentation page features section
+    - Mentioned in "How It Works" section for better visibility

+- **Documentation Page Complete Redesign**: Completely redesigned documentation page with modern animations and interactive elements
+  - Added interactive mouse-tracking gradient orbs that follow cursor movement
+  - Implemented glassmorphism design with backdrop blur effects throughout
+  - Enhanced all sections with smooth scroll animations using Framer Motion
+  - Redesigned feature cards with gradient icons, hover effects, and scale animations
+  - Added interactive FAQ section with smooth expand/collapse animations
+  - Enhanced "How It Works" section with step-by-step cards and icons
+  - Redesigned testimonials with star ratings and hover effects
+  - Added gradient buttons with hover animations
+  - Improved visual hierarchy with gradient text headings
+  - Added animated grid background pattern for depth
+  - Enhanced all links with hover effects and smooth transitions
+  - Redesigned future enhancements section with gradient cards
+  - Improved spacing, typography, and responsive design
+  - Added icon components from react-icons for better visual appeal
+  - Maintained all original content and functionality
+  - Fully responsive design optimized for all screen sizes
+  - **NEW: Use Cases Section**: Added comprehensive use cases for different user types
+    - Job Seekers, Content Creators, Developers, Students, Businesses, and Freelancers
+    - Each use case includes description, icon, gradient styling, and example applications
+    - Interactive cards with hover effects and smooth animations
+  - **NEW: Best Practices Section**: Added best practices guide for optimal LinkBridger usage
+    - Six key best practices with icons and detailed explanations
    - Tips on username selection, platform naming, link updates, analytics, testing, and sharing
+  - **NEW: Platform Support Section**: Added comprehensive list of supported platforms
+    - Visual grid showcasing 30+ supported platforms (LinkedIn, GitHub, Instagram, etc.)
+    - Interactive platform cards with hover effects
+    - Emphasizes that any platform with a URL can be supported
+  - **NEW: Security & Privacy Section**: Added security and privacy information
+    - Four key security features: Secure Authentication, Privacy First, HTTPS Encryption, Secure Infrastructure
+    - Gradient icon cards with detailed explanations
+    - Builds user trust and confidence
+  - **NEW: Troubleshooting Section**: Added comprehensive troubleshooting guide
+    - Six common issues with detailed solutions
+    - Color-coded icons for different issue types
+    - Contact information for additional support
+    - Interactive cards with hover effects

+- **Mouse Position Calculation Bug**: Fixed incorrect mouse position calculation in HomePage.jsx
+  - Previous calculation `(e.clientX / window.innerWidth - 0.5) * 20` produced values in -10 to 10 pixel range
+  - These small/negative values caused incorrect gradient positioning when used in CSS `radial-gradient`
+  - Changed to percentage-based calculation: `(e.clientX / window.innerWidth) * 100` for x and `(e.clientY / window.innerHeight) * 100` for y
+  - Updated gradient to use percentages (`${mousePosition.x}% ${mousePosition.y}%`) instead of pixels
+  - Gradient now correctly follows mouse cursor across entire viewport (0% to 100%)
+  - Fixed backgroundPosition animation to use percentages with proper bounds checking
+  - Eliminates off-screen gradient placement and ensures smooth mouse tracking

+- **State Update on Unmounted Component**: Fixed memory leak warnings in AuthPage.jsx
+  - Removed `setLoading(false)` calls before `navigate()` in both `handleSignUp` and `handleLogin`
+  - After navigation, component unmounts, causing finally block's `setLoading(false)` to update unmounted component
+  - Now only the finally block handles `setLoading(false)`, preventing state updates on unmounted components
+  - Moved form state resets (`setLoginEmail`, `setLoginPassword`) before navigation to ensure they execute
+  - Eliminates React warnings about memory leaks and state updates on unmounted components

+- **AuthPage Complete Redesign**: Completely redesigned login/signup page with modern animations
+  - Removed old CSS-based design that had z-index conflicts preventing input clicks
+  - Created new modern design with glassmorphism effects and gradient backgrounds
+  - Added interactive mouse-tracking gradient orbs that follow cursor movement
+  - Implemented smooth form transitions with Framer Motion AnimatePresence
+  - Added animated toggle buttons with layoutId for smooth tab switching
+  - Modern input fields with icons, focus states, and proper z-index hierarchy
+  - Gradient buttons with hover animations and loading states
+  - Animated grid background pattern for depth
+  - Feature pills showcasing key benefits
+  - Fully responsive design for all screen sizes
+  - All input fields now properly clickable and functional
+  - Maintained all original authentication logic and functionality
+  - Added password visibility toggles with eye icons
+  - Username availability indicator with animated icons
+  - Smooth entrance animations for all form elements

+- **Mouse Position Throttling Logic Bug**: Fixed incorrect throttle timestamp update in RAF callback
+  - `lastUpdateTime` was being updated inside RAF callback, causing continuous unnecessary RAF scheduling
+  - When RAF was scheduled, `lastUpdateTime` remained old, so subsequent mousemove events would see `now - lastUpdateTime < throttleDelay` as true
+  - This caused multiple RAFs to be scheduled unnecessarily, even though `rafId === null` check prevented duplicates
+  - Fixed by updating `lastUpdateTime` immediately when scheduling RAF, not inside the callback
+  - Now subsequent mousemove events correctly see we're still within throttle window
+  - Prevents unnecessary RAF scheduling and improves performance

+- **Mouse Position Throttling Bug**: Fixed stale mouse position in RAF callback
+  - RAF callback was capturing event coordinates from first mousemove event via closure
+  - When multiple mousemove events fired before RAF executed, it used stale coordinates
+  - Added `latestMousePositionRef` to store latest position, updated on every mousemove
+  - RAF callback now reads from ref at execution time, ensuring latest position is used
+  - Eliminates lag in mouse tracking gradient effect
+  - Mouse tracking now smoothly follows actual cursor movement

+- **AuthPage Functionality**: Fixed login and signup forms not working properly
+  - Added Font Awesome CDN link to index.html for icon support
+  - Changed button types from "button" to "submit" for proper form submission
+  - Added `onSubmit` handlers to forms instead of `onClick` on buttons
+  - Added form validation with `required` and `minLength` attributes
+  - Added `disabled` state to buttons during loading to prevent multiple submissions
+  - Improved user experience with proper form validation and loading states
+  - Fixed email input types to use `type="email"` for better validation

+- **AuthPage CSS Overlap Issue**: Fixed login page overlapping HomePage
+  - Scoped all AuthPage CSS classes to `.auth-container` to prevent global style conflicts
+  - Added `isolation: isolate` to create new stacking context for AuthPage
+  - Updated all `.container` references in App.css to `.auth-container` to prevent affecting other pages
+  - Scoped form, input-field, panel, button, and animation styles to AuthPage only
+  - Prevents AuthPage styles from leaking to HomePage and other components
+  - Ensures proper z-index isolation between pages
+
+- **AnimatedCounter Performance Issue**: Fixed component recreation on every parent re-render
+  - Moved `AnimatedCounter` component outside of `HomePage` to prevent recreation on re-renders
+  - `AnimatedCounter` was being recreated on every `mousePosition` state update, causing unmount/remount cycles
+  - This interrupted animations and canceled pending `requestAnimationFrame` calls
+  - Component is now stable and only re-renders when its own props change
+  - Added `statsInView` as a prop instead of using closure to maintain proper dependency tracking
+  - Optimized mouse position updates with throttling (16ms delay, ~60fps) to reduce unnecessary re-renders
+  - Added `passive: true` to mouse event listener for better performance
+  - Proper cleanup of `requestAnimationFrame` in mouse handler cleanup function
+
+- **AnimatedCounter Memory Leak**: Fixed memory leak in AnimatedCounter component
+  - Added proper cleanup for `requestAnimationFrame` using `cancelAnimationFrame`
+  - Added `isMountedRef` to prevent state updates on unmounted components
+  - Stored animation frame ID in `animationFrameRef` for proper cancellation
+  - Prevents React warnings about updating state on unmounted components
+  - Eliminates memory leaks when component unmounts during animation
+
+- **Twitter Icon Import Error**: Fixed import error for Twitter icon
+  - Changed `SiTwitter` to `SiX` from `react-icons/si` (Twitter rebranded to X)
+  - Resolves "does not provide an export named 'SiTwitter'" error
+  - Updated to use correct export name for X/Twitter icon
+
+### Added - 2024-12-19
+- **Interactive Home Page**: Completely redesigned landing page with modern animations and investor-friendly content
+  - Hero section with typewriter effect and gradient text animations
+  - Flip words animation for platform names (LinkedIn, GitHub, Instagram, etc.)
+  - Mouse-tracking background effects for interactive experience
+  - Animated scroll indicator with smooth transitions
+  - Platform icons showcase with hover animations
+  - Statistics section with animated counters (10,000+ users, 50,000+ links, 1M+ clicks, 99% uptime)
+  - Interactive feature cards with gradient icons and hover effects
+  - Benefits section for three target audiences (Professionals, Creators, Developers)
+  - Final CTA section with gradient background
+  - Navigation header for non-authenticated users with logo and action buttons
+  - Fully responsive design optimized for mobile, tablet, and desktop devices
+    - Mobile-first approach with breakpoints: sm (640px), md (768px), lg (1024px)
+    - Responsive text sizes: text-2xl sm:text-3xl md:text-4xl lg:text-5xl
+    - Flexible grid layouts: grid-cols-2 md:grid-cols-4 for stats, md:grid-cols-2 lg:grid-cols-3 for features
+    - Responsive padding and spacing: px-4 sm:px-6 lg:px-8, gap-4 sm:gap-6 md:gap-8
+    - Mobile-optimized buttons: full-width on mobile, auto-width on larger screens
+    - Responsive navigation: logo text hidden on very small screens, compact button sizes
+    - Touch-friendly interactive elements with appropriate sizing for mobile devices
+  - Dark mode support throughout all sections
+  - Smooth scroll animations using Framer Motion
+  - Performance optimized with `useInView` hooks for scroll-triggered animations
+
+- **Enhanced Typography**: Upgraded font system for better visual appeal
+  - Added Poppins font family for body text (weights 300-900)
+  - Added Montserrat font family for headings (weights 300-900)
+  - Maintained Inter font as fallback
+  - Improved font weights and letter spacing for better readability
+  - Enhanced typography hierarchy across the application
+
+- **Routing Updates**: Updated App.jsx to use new HomePage as landing page
+  - Changed root route (`/`) to display new interactive HomePage
+  - HomePage now serves as the primary landing experience for non-authenticated users
+  - Maintains existing Documentation page at `/doc` route
+
+### Changed - 2024-12-19
- **Edit Link Functionality**: Redesigned edit link feature to reuse CreateBridge component
  - Removed prompt dialog for editing links
  - Edit button now populates CreateBridge form with existing link data
  - Platform field is now editable during edit mode (both platform and destination can be changed)
  - Added custom warning modal dialog when platform name is changed (old link becomes invalid)
  - Replaced browser prompt with professional styled modal component
  - Modal includes warning icon, color-coded old/new links, and clear action buttons
  - Warning only appears for platform changes, not destination changes
  - Modal shows old and new link URLs with visual distinction (red for old, green for new)
  - Fully styled with dark mode support and smooth transitions
  - Button text changes from "Create New" to "Update Bridge" in edit mode
  - Added "Cancel" button to exit edit mode
  - Added visual indicator showing link ID being edited
  - Automatic scroll to CreateBridge form when edit is triggered
  - Reuses same form component for both create and update operations
  - Platform changes update the source state in real-time during editing

### Added - 2024-12-19
- **Dark Mode Support**: Complete dark mode implementation with toggle button in navbar
  - Added dark mode toggle button with sun/moon icons in navigation bar
  - Dark mode preference persisted in localStorage
  - Smooth transitions between light and dark modes
  - Dark mode class applied to document root for Tailwind CSS dark mode support

- **Font Improvements**: Professional typography enhancements
  - Upgraded Inter font family with extended weight range (300-800)
  - Added font smoothing for better rendering across browsers
  - Improved line heights and letter spacing for better readability
  - Enhanced typography hierarchy for headings and paragraphs

- **Redux State Management**: Added edit link state management
  - Added `editLinkData` state to `pageSlice.js` for managing edit mode
  - Added `setEditLinkData` and `clearEditLinkData` actions
  - Enables communication between Linkcard and CreateBridge components

- **Component Dark Mode Styling**: All components updated with dark mode support
  - App.jsx: Dark mode initialization and background gradients
  - Nav.jsx: Dark mode toggle button and dark mode styling
  - Content.jsx: Dark mode background and text colors
  - CreateBridge.jsx: Dark mode form styling and input fields
  - LinkPage.jsx: Dark mode card and text styling
  - Linkcard.jsx: Dark mode card backgrounds and text colors
  - Documentation.jsx: Complete dark mode support for all sections
  - Footer.jsx: Dark mode styling for all footer elements
  - NotFound.jsx: Dark mode background and text styling
  - Profile.jsx: Dark mode form and input styling
  - Notification.jsx: Dark mode notification styling

- **Image Visibility**: Enhanced image visibility in dark mode
  - Added brightness and contrast filters for images in dark mode
  - Logo inversion in dark mode for better visibility
  - Profile images with ring borders for better definition
  - Feature images with adjusted brightness/contrast

### Changed - 2024-12-19
- **Default Theme**: Changed default theme from system preference to light mode
  - Updated `pageSlice.js` to default to `false` (light mode)
  - Updated `App.jsx` initialization to default to light mode instead of system preference

- **Font Configuration**: Enhanced font system
  - Updated `fonts.css` with comprehensive font styling rules
  - Added font smoothing and improved typography defaults
  - Standardized font weights and line heights across the application

- **Tailwind Configuration**: Added dark mode support
  - Enabled `darkMode: 'class'` in `tailwind.config.js`
  - Configured for class-based dark mode switching

- **App.css**: Added dark mode styles for authentication forms
  - Dark mode styles for input fields
  - Dark mode styles for form titles
  - Dark mode styles for placeholders and icons

### Fixed - 2024-12-19
- **Grammar and Spelling**: Fixed multiple grammatical errors throughout the application
  - "Linkdin" → "LinkedIn" (multiple occurrences)
  - "linkdin" → "linkedin" (lowercase)
  - "Persionalized" → "Personalized"
  - "Plateform" → "Platform"
  - "linktree is live live on" → "linktree is live on"
  - "forgot password?" → "Forgot password?"
  - "you have no any new clicks" → "You have no new clicks"
  - "mark as read" → "Mark as Read"
  - "bridge has been made successfully" → "Bridge has been created successfully"
  - "Link Bridger" → "LinkBridger" (consistent branding)
  - "No links found. add new link..." → "No links found. Add a new link..."
  - "Codeforce" → "Codeforces"
  - Fixed various capitalization and punctuation issues

- **Link Edit Functionality**: Fixed broken edit link feature
  - Updated `handleEditLink` function in `Linkcard.jsx` to properly handle link editing
  - Added prompt dialog for editing destination URL
  - Fixed undefined variable reference (`tempArr`)
  - Improved error handling and user feedback

- **Link Update State Management**: Fixed silent failure when updating deleted links
  - Added check to verify link exists in Redux state before updating
  - If link is missing from state (e.g., deleted during edit), the updated link is now added back to the array
  - Added user warning notification when link is restored during update
  - Prevents silent data loss when link state is out of sync
  - Ensures successful backend updates are always reflected in frontend state

- **Error Handling Logic**: Fixed operator precedence bug in authentication error handling
  - Fixed incorrect condition `if(!err.status===401)` which evaluated as `(!err.status) === 401` (always false)
  - Changed to `if(err.response?.status !== 401)` to correctly skip error toasts for 401 authentication errors
  - Added proper optional chaining for `err.response?.status` since axios errors have status in response object
  - Prevents showing error toasts for expected 401 (unauthorized) errors during token verification

- **Form Validation**: Fixed submit button type to enable HTML5 validation
  - Changed submit button from `type="button"` to `type="submit"` in CreateBridge component
  - Added `onSubmit={handleSubmit}` handler to form element (was missing, causing form not to submit)
  - Enables native HTML5 form validation for required fields (platform and destination)
  - Prevents form submission with empty fields, reducing unnecessary API calls
  - Added `disabled` attribute to buttons during loading state to prevent multiple submissions
  - Form now properly validates inputs before calling `handleSubmit` function

- **Warning Modal and Update Functionality**: Fixed issues with link update and warning modal
  - Fixed missing `onSubmit` handler on form element that prevented form submission
  - Moved warning modal outside form element to prevent form submission interference
  - Added `type="button"` to modal buttons to prevent accidental form submission
  - Added `.trim()` to platform comparison and data handling for better reliability
  - Fixed update functionality for both platform and destination changes
  - Warning modal now properly displays when platform is changed
  - Update now works correctly whether platform is changed or only destination is changed
  - Fixed stale data issue: `handleConfirmUpdate` now uses current form state instead of `pendingUpdate`
  - Prevents outdated values from being applied if user modifies form while modal is open
  - Added input field disabling while modal is open to prevent confusion and ensure data consistency
  - Fixed platform change detection: Normalize platform value when populating from `editLinkData`
  - Ensures consistent case comparison even if database has mixed-case platform names (e.g., "LinkedIn")
  - Prevents false positive warnings when only destination is being updated
  - Platform value is now normalized to lowercase when form is populated, ensuring accurate change detection
  - Fixed duplicate API calls: Added `disabled={loading}` to "Continue Anyway" button in warning modal
  - Prevents multiple clicks and duplicate update requests while update is in progress
  - Added loading state text ("Updating...") to provide user feedback
  - Also disabled Cancel button during loading to prevent modal closure during update
  - Added disabled styling (opacity and cursor) for better UX
  - Fixed race condition: Made `handleConfirmUpdate` async and added `await` to `performUpdate` call
  - Prevents modal from closing and state from clearing before API call completes
  - Ensures proper sequencing: modal closes only after update completes
  - Matches the pattern used in `handleSubmit` for consistency
  - Prevents race conditions where toast messages and state updates may not display correctly
  - Fixed submit button state: Added `showWarningModal` to disabled condition
  - Submit button now disabled when warning modal is displayed, preventing duplicate form submissions
  - Prevents bypassing platform change validation by clicking submit while modal is open
  - Also disabled Cancel button during warning modal for consistency
  - Added disabled styling classes for better visual feedback
  - Fixed loading state bug: Added `finally` block to `performUpdate` function
  - Ensures loading state is always reset, even if API returns 200 with `success: false`
  - Added explicit handling for successful HTTP responses with `success: false`
  - Prevents UI from getting stuck in loading state
  - Matches the pattern used in create link function for consistency
  - User now sees error message when update fails, instead of silent failure
  - Fixed duplicate loading state reset: Removed redundant `setLoading(false)` from create link success path
  - Create link function now only resets loading in `finally` block, matching edit path pattern
  - Added explicit handling for create link responses with `success: false`
  - Ensures consistent behavior between create and update operations
  - Prevents unnecessary duplicate state updates

- **Dark Mode Initialization**: Removed redundant localStorage read
  - Removed duplicate `useEffect` in `App.jsx` that was re-reading localStorage and dispatching `setDarkMode`
  - Dark mode is already correctly initialized from localStorage in `pageSlice.js` via `getInitialDarkMode()`
  - Eliminates redundant state updates and prevents potential visual flash on initial page load
  - Removed unused `setDarkMode` import from `App.jsx`
  - Dark mode class is now applied once based on the correctly initialized Redux state

- **Accessibility**: Fixed label-input associations
  - Fixed `htmlFor` attribute mismatch in AuthPage signup form
  - Removed incorrect `aria-describedby` attribute
  - Ensured proper label-input associations for checkboxes

- **Dark Mode Visibility**: Fixed text and image visibility issues in dark mode
  - All text now has proper contrast in dark mode
  - Images are visible with appropriate filters
  - Background gradients updated for dark mode
  - Form inputs have proper dark mode styling

### Enhanced - 2024-12-19
- **User Experience**: Improved overall design consistency
  - Consistent color transitions across all components
  - Improved hover states and interactive elements
  - Better visual hierarchy and spacing
  - Enhanced button styles with dark mode support

- **Component Styling**: Enhanced visual design
  - Improved card designs with dark mode support
  - Better form styling with dark mode variants
  - Enhanced button gradients and hover effects
  - Improved spacing and layout consistency

## [Previous Versions]

### Initial Release
- Basic authentication system
- Link management functionality
- User profile management
- Documentation page
- Responsive design with Tailwind CSS

