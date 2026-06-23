import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import logo from '../../assets/images/logo.png';
import PageContainer from './ui/PageContainer';

interface AppLayoutProps {
  readonly children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 h-[70px] overflow-hidden">
        <PageContainer
          maxWidth="xl"
          className="h-full !py-0 flex items-center justify-between gap-4"
        >
          <a href="/" className="inline-flex items-center gap-3">
            <img src={logo} alt="OniBus Express" width={160} height={40} />
          </a>
          <nav>
            <Link
              to="/reservation"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-blue-600 rounded-md hover:bg-blue-50"
            >
              <Ticket size={18} strokeWidth={2} className="flex-shrink-0" />
              Consultar reserva
            </Link>
          </nav>
        </PageContainer>
      </header>
      <main className="flex-1 pt-0 pb-8 md:pb-10">
        {children}
      </main>
    </div>
  );
}
