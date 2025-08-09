import { QueryClientProvider } from '@tanstack/react-query';
import { SwapInterface } from './components/SwapInterface';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 transition-all duration-500 flex flex-col relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="flex-1 py-8 px-4 relative z-10">
            <div className="max-w-7xl mx-auto">
              {/* Header with theme toggle */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">Token swap</span>
                </div>
                <ThemeToggle />
              </div>
              
              <div className="text-center mb-12">
                <div className="inline-block">
                  <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
                    Crypto Token Explorer
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Explore potential token explorer. Enter a USD amount and select tokens to see their equivalent values in real-time.
                </p>
              </div>

              {/* Main Interface */}
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 transition-all duration-300 hover:shadow-3xl">
                    <SwapInterface />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <footer className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/50 py-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center">
                <div className="flex justify-center items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Built with React and powered by Funkit API
                </p>
                <div className="flex justify-center space-x-4 text-xs text-gray-400 dark:text-gray-500">
                  <span>© Assessment for fun.xyz</span>
                  <span>•</span>
                  <span>Chan Siaw Wei</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;