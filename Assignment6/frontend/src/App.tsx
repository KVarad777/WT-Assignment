import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { CataloguePage } from './pages/CataloguePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

type Page = 'home' | 'catalogue' | 'login' | 'register';

function BookstoreApp() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFilter = (category: string) => {
    setSelectedCategoryFilter(category);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-200">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectCategoryFilter={handleSelectCategoryFilter}
          />
        )}
        {currentPage === 'catalogue' && (
          <CataloguePage initialCategory={selectedCategoryFilter} />
        )}
        {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookstoreApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
