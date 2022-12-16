import { useState } from 'react';

import './App.css';
import Router from './core/router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Router />
      </div>
    </QueryClientProvider>
  );
}

export default App;
