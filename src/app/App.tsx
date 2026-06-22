import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '../shared/components/AppLayout';
import { PageLoader } from '../shared/components/ui/PageLoader';

const SearchTripsPage = lazy(() => import('../features/search-trips/SearchTripsPage'));
const SeatSelectionPage = lazy(() => import('../features/seat-selection/SeatSelectionPage'));
const CheckoutPage = lazy(() => import('../features/checkout/CheckoutPage'));
const SuccessPage = lazy(() => import('../features/success/SuccessPage'));
const ReservationPage = lazy(() => import('../features/reservation/ReservationPage'));

export function App() {
  return (
    <AppLayout>
      <Suspense fallback={<PageLoader />}> 
        <Routes>
          <Route path="/" element={<SearchTripsPage />} />
          <Route path="/trips/:tripId/seats" element={<SeatSelectionPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}

export default App;
