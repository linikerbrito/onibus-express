import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

interface AppLayoutProps {
  readonly children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 h-[90px]">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4">
          <a href="/" className="inline-flex items-center gap-3">
            <img src={logo} alt="OniBus Express" width={160} height={40} />
          </a>
          <nav>
            <Link to="/reservation" className="text-sm text-slate-600 hover:text-slate-900">
              Consultar reserva
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 pt-0 pb-8 md:pb-10">
        <div className="max-w-7xl mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
}
