# SafeRide - Welcome Screen

This is the welcome screen for the SafeRide fleet management application. It features a clean, light theme design with bright blue accents.

## Features

- **Light Theme**: Clean, modern light background with excellent readability
- **Bright Blue Color Scheme**: Uses #3B82F6 (blue-500) as the primary brand color
- **SVG Icons**: Custom SVG icons for better scalability and performance
- **Role-based Navigation**: Two main user roles supported:
  - **Operator**: Access to fleet management dashboard with analytics
  - **Driver**: Access to driving interface with route information
- **Testing Mode**: Toggle for quick role switching during development
- **Responsive Design**: Works on different screen sizes with proper safe area handling

## Components

### WelcomeScreen.tsx

The main welcome screen component that includes:

- Logo and branding
- Welcome message
- Two role selection cards
- Testing mode toggle
- Version information

### SVG Icons Used

1. **LogoIcon**: Blue rounded rectangle with vehicle/bus icon
2. **DashboardIcon**: Analytics/dashboard representation with charts
3. **RoadIcon**: Road with car icon for drivers
4. **ArrowRightIcon**: Navigation arrow for buttons

## Design Elements

- **Typography**: Clear hierarchy with bold headings and readable body text
- **Shadows**: Subtle shadows for depth and card separation
- **Rounded Corners**: Modern rounded rectangle design language
- **Interactive Elements**: Touch feedback with scale animations
- **Color Palette**:
  - Primary Blue: #3B82F6
  - Dark Blue: #1D4ED8
  - Light Blue: #EFF6FF
  - Gray Scale: Various shades for text and backgrounds

## Usage

```tsx
import WelcomeScreen from './WelcomeScreen';

<WelcomeScreen
  onOperatorPress={() => {
    // Navigate to operator dashboard
  }}
  onDriverPress={() => {
    // Navigate to driver interface
  }}
/>;
```

## Dependencies

- react-native-svg: For scalable vector graphics
- react-native-safe-area-context: For safe area handling
- nativewind: For Tailwind CSS styling

The design maintains the same layout and functionality as the original dark theme version but with a bright, professional light theme appearance suitable for daytime use and better accessibility.
