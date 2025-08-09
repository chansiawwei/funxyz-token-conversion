import { QueryClientProvider } from '@tanstack/react-query';
import { SwapInterface } from './components/SwapInterface';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
          <div className="flex-1 py-8 px-4">
            <div className="max-w-7xl mx-auto">
              {/* Header with theme toggle */}
              <div className="flex justify-end mb-6">
                <ThemeToggle />
              </div>
              
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Crypto Token Swap Interface
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Explore potential token swaps by entering a USD amount and selecting two tokens to see their equivalent values.
                </p>
              </div>

              {/* Main Interface */}
              <div className="flex justify-center">
                <SwapInterface />
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Built with React and powered by Funkit API
                </p>
              </div>
            </div>
          </footer>
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;