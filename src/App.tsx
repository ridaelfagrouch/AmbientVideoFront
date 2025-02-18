import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AmbientVideoGenerator from './components/AmbientVideoGenerator';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      networkMode: 'online'
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AmbientVideoGenerator />
      {/* {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />} */}
    </QueryClientProvider>
  );
}

export default App;