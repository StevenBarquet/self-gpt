import { Layout } from './layout/Layout';
import { Providers } from './providers/Providers';
import { Routes } from './Routes';

function App() {
  return (
    <Providers>
      <Layout>
        <Routes />
      </Layout>
    </Providers>
  );
}

export default App;
