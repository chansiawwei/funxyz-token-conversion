# Storybook Setup

This project has been configured with Storybook for component development and testing.

## Requirements

- Node.js 20 or higher (current version: 18.14.0)
- npm or yarn

## Installation

Storybook has been pre-configured with the following packages:
- `@storybook/react@9.1.1`
- `@storybook/react-vite@9.1.1`
- `react-docgen@8.0.0`

## Configuration

### Main Configuration (`.storybook/main.ts`)
- Stories location: `src/**/*.stories.@(js|jsx|ts|tsx|mdx)`
- Framework: React with Vite
- Addons: essentials, interactions, links, onboarding
- TypeScript support enabled

### Preview Configuration (`.storybook/preview.ts`)
- Global styles imported from `../src/index.css`
- Controls addon configured
- Theme toolbar for testing light/dark modes

## Available Scripts

```bash
# Start Storybook development server (requires Node.js 20+)
npm run storybook

# Build Storybook for production
npm run build-storybook
```

## Created Stories

### 1. ThemeToggle Component (`src/components/ThemeToggle.stories.tsx`)
- **Default**: Basic theme toggle functionality
- **Dark Mode**: Theme toggle in dark mode context

### 2. Skeleton Components (`src/components/Skeleton.stories.tsx`)
- **Default**: Basic skeleton with customizable props
- **WithoutAnimation**: Static skeleton without pulse animation
- **Rectangle**: Large rectangular skeleton
- **TextSingleLine**: Single line text skeleton
- **TextMultipleLines**: Multi-line text skeleton
- **TextManyLines**: Five-line text skeleton
- **Card**: Complete card skeleton layout
- **SpinnerSmall/Medium/Large**: Loading spinners in different sizes
- **Button**: Button skeleton
- **AvatarSmall/Medium/Large**: Avatar skeletons in different sizes
- **CombinedExample**: Showcase of multiple skeleton components
- **DarkMode**: All skeletons in dark mode

### 3. ChainSelector Component (`src/components/ChainSelector.stories.tsx`)
- **Default**: Basic chain selector with supported chains
- **WithCustomStyling**: Chain selector with custom CSS classes
- **NoSelection**: Chain selector with no initial selection
- **DarkMode**: Chain selector in dark mode
- **SupportedChains**: Shows all configured supported chains

### 4. VirtualizedTokenSelector Component (`src/components/VirtualizedTokenSelector.stories.tsx`)
- **Default**: Basic token selector with mock data
- **WithSelectedToken**: Token selector with pre-selected token
- **BigDataSimulation**: Tests with 1,000+ tokens for virtualization performance
- **LoadingState**: Shows skeleton loading states
- **ErrorState**: Demonstrates error handling
- **WithExcludedToken**: Token selector with excluded tokens
- **CustomLabel**: Custom labels and placeholders
- **DarkMode**: Token selector in dark mode
- **MassiveDataset**: Extreme test with 10,000+ tokens

## Big Data Simulation Features

The VirtualizedTokenSelector stories include several scenarios for testing large datasets:

1. **BigDataSimulation**: 1,000 tokens to test standard virtualization
2. **MassiveDataset**: 10,000 tokens for stress testing
3. **Mock Data Generator**: Creates realistic token data with:
   - Random chain assignments
   - Varied token symbols and names
   - Placeholder logos
   - Realistic addresses

## Usage After Node.js Upgrade

Once you upgrade to Node.js 20 or higher:

1. **Start Storybook**:
   ```bash
   npm run storybook
   ```
   This will start the development server on `http://localhost:6006`

2. **Build for Production**:
   ```bash
   npm run build-storybook
   ```
   This creates a static build in the `storybook-static` directory

3. **View Stories**: Navigate through the sidebar to explore different components and their variations

4. **Interactive Controls**: Use the Controls panel to modify component props in real-time

5. **Test Scenarios**: Use the big data simulation stories to test performance with large datasets

## Development Workflow

1. **Component Development**: Create components in isolation using Storybook
2. **Visual Testing**: Test different states and props combinations
3. **Performance Testing**: Use the big data stories to ensure virtualization works correctly
4. **Documentation**: Stories serve as living documentation for component usage
5. **Design System**: Maintain consistency across components

## Adding New Stories

To add stories for new components:

1. Create a `.stories.tsx` file next to your component
2. Follow the existing patterns in the created stories
3. Include multiple scenarios (default, loading, error, edge cases)
4. Add interactive controls for key props
5. Include dark mode variants when applicable

## Notes

- All stories are configured to work with the existing TypeScript setup
- Mock data generators are included for testing with large datasets
- Stories include proper error boundaries and loading states
- Dark mode support is configured for all components