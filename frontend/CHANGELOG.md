# Changelog

All notable changes to the frontend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

