# Crypto Token Swap Interface

A React-based web application that allows users to explore potential crypto token swaps by entering a USD amount and selecting two tokens to see their equivalent values.

## 🚀 Live Demo

[Deployed Application URL] - *Will be updated after deployment*

## 📋 Features

- **Chain-First Selection**: Users select network first, then available tokens
- **Multi-chain Support**: Supports tokens across Ethereum, Polygon, and Base networks
- **Real-time Price Calculation**: Get live token prices using the Funkit API
- **USD-based Conversion**: Enter a USD amount to see equivalent token values
- **Swap Preview**: Visual representation of token swap calculations
- **Responsive Design**: Modern, mobile-friendly interface with sticky footer
- **Virtualized Token Selection**: Efficient rendering of large token lists with pagination
- **Dynamic Token Fetching**: Token information fetched from Funkit API in real-time
- **Error Handling**: Graceful handling of API errors and edge cases
- **Loading States**: Visual feedback during API calls
- **Improved UX**: Enhanced token selector with intuitive icons and visual cues

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React + Heroicons
- **Component Library**: Headless UI (for accessible select components)
- **API**: @funkit/api-base package
- **State Management**: React Query for server state, React hooks for local state
- **Data Fetching**: React Query with caching and error handling

## 📦 Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-swap-interface
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## 🎯 Usage

1. **Enter USD Amount**: Input the USD value you want to convert
2. **Select Source Token**: Choose the token you want to convert from
3. **Select Target Token**: Choose the token you want to convert to
4. **View Results**: See the equivalent amounts in both tokens
5. **Swap Tokens**: Use the swap button to quickly reverse the token selection

## 🔧 Configuration

### Supported Networks and Tokens

The application supports multiple networks with tokens dynamically fetched from the Funkit API:

#### Ethereum Mainnet (Chain ID: 1)
- **USDC** - USD Coin
- **WBTC** - Wrapped Bitcoin

#### Polygon (Chain ID: 137)
- **USDT** - Tether USD

#### Base (Chain ID: 8453)
- **ETH** - Ethereum

*Token addresses, decimals, and names are fetched dynamically from the Funkit API using `getAssetErc20ByChainAndSymbol`. Users must first select a network, then choose from available tokens on that network.*

### API Configuration

The application uses the Funkit API with the provided development API key. The API service includes:

- **Caching**: 5-minute cache for token prices to reduce API calls
- **Error Handling**: Graceful fallbacks for API failures
- **Rate Limiting**: Built-in request management

## 🏛️ Architecture

### Project Structure

```
src/
├── components/
│   ├── SwapInterface.tsx           # Main swap interface component
│   ├── VirtualizedTokenSelector.tsx # Virtualized token selection with pagination
│   └── ChainSelector.tsx           # Network/chain selection component
├── hooks/
│   ├── useVirtualizedTokens.ts     # Custom hooks for virtualized token management
│   └── useImprovedSwapCalculation.ts # Enhanced swap calculation logic
├── services/
│   └── api.ts                      # API service layer
├── types/
│   └── index.ts                    # TypeScript type definitions
├── lib/
│   └── queryClient.ts              # React Query configuration
├── App.tsx                         # Main application component with sticky footer
├── main.tsx                       # Application entry point
└── index.css                      # Global styles and Tailwind imports
```

### Key Components

- **SwapInterface**: Main component handling swap logic and state management
- **VirtualizedTokenSelector**: Efficient virtualized token selection with pagination and search
- **ChainSelector**: Network selection component for multi-chain support
- **useVirtualizedTokens**: Custom hooks for managing virtualized token lists and pagination
- **useImprovedSwapCalculation**: Enhanced hook for swap calculations with React Query
- **TokenApiService**: Singleton service for API interactions with caching

## 🎨 Design Decisions

### UI/UX Choices

- **Clean, Modern Interface**: Minimalist design focusing on usability
- **Visual Feedback**: Loading states and error messages for better UX
- **Responsive Layout**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Technical Decisions

- **TypeScript**: For type safety and better developer experience
- **Vite**: Fast build tool with excellent development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling with flexbox layout
- **Headless UI**: Accessible, unstyled UI components for better UX
- **React Query**: Powerful data fetching with caching, background updates, and error handling
- **Virtualization**: Efficient rendering of large token lists using react-window for performance
- **Sticky Footer**: CSS flexbox layout ensuring footer stays at bottom of viewport
- **Chain-First Architecture**: Network selection drives available token options
- **Dynamic Token Fetching**: Uses `useTokenInfo` hook and `getAssetErc20ByChainAndSymbol` API
- **Real-time Token Data**: Addresses, decimals, and names fetched from Funkit API
- **Multi-Chain Support**: Supports tokens across different blockchain networks
- **Service Layer**: Abstracted API logic for maintainability
- **Caching Strategy**: Intelligent caching with React Query for optimal performance
- **Custom Hooks**: Modular hook architecture for reusable logic and state management

## 🔍 Assumptions Made

1. **Token Addresses**: For tokens without explicit addresses (like ETH), using placeholder addresses
2. **Price Accuracy**: Assuming API prices are reasonably current (5-minute cache)
3. **Chain Support**: Limited to the specified chains for each token
4. **Error Handling**: Graceful degradation when API calls fail
5. **User Intent**: Users want to see approximate values, not execute actual swaps

## 🚨 Known Limitations

- **Limited Token Support**: Only 4 tokens currently supported
- **No Real Swapping**: This is a preview tool, not an actual swap interface
- **API Dependency**: Relies on external API availability
- **Price Accuracy**: Prices are approximate and may not reflect real-time market conditions

## 🔮 Future Enhancements

- **More Tokens**: Expand the supported token list
- **Multiple Chains**: Support for more blockchain networks
- **Price Charts**: Historical price data visualization
- **Slippage Calculation**: More accurate swap estimations
- **Dark Mode**: Theme switching capability
- **Favorites**: Save frequently used token pairs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Funkit API for providing the token data and pricing information
- React team for the excellent framework
- Tailwind CSS for the utility-first styling approach
- Lucide React for the beautiful icons