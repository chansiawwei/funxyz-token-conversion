import { QueryClientProvider } from '@tanstack/react-query';
import { SwapInterface } from './components/SwapInterface';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Crypto Token Swap Interface
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Built with React and powered by Funkit API
              </p>
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;