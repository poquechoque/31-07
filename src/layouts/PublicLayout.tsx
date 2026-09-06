import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

function PublicLayout() {
  return (
    <div className="site-shell">
      <Header />
      <main style={{ minHeight: 'calc(100vh - 150px)' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;