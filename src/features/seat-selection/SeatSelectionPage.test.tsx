import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SeatSelectionPage from './SeatSelectionPage';
import { useReservationStore } from '../../stores/reservation.store';
import { renderWithProviders } from '../../tests/test-utils';
import type { Trip } from '../../shared/types/trip';

const trip: Trip = {
  id: 'trip-1',
  origin: 'São Paulo',
  destination: 'Rio de Janeiro',
  departureDate: '2026-07-15',
  departureTime: '08:00',
  arrivalTime: '14:30',
  duration: '6h 30m',
  category: 'Executivo',
  price: 189.9,
  availableSeats: 12,
};

describe('SeatSelectionPage', () => {
  beforeEach(() => {
    useReservationStore.setState({ selectedTrip: null, selectedSeatId: null, reservation: null });
  });

  it('renders empty state when no trip is selected', () => {
    renderWithProviders(<SeatSelectionPage />);

    expect(screen.getByText(/Viagem não encontrada/i)).toBeInTheDocument();
  });

  it('renders seat map and allows selecting a free seat', async () => {
    useReservationStore.setState({ selectedTrip: trip, selectedSeatId: null, reservation: null });

    renderWithProviders(
      <Routes>
        <Route path="/trips/:tripId/seats" element={<SeatSelectionPage />} />
      </Routes>,
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/trips/trip-1/seats']}>
            {children}
          </MemoryRouter>
        ),
      },
    );

    const availableSeat = await screen.findByRole('button', { name: /Assento 2 disponível/i });
    expect(availableSeat).toBeEnabled();

    await userEvent.click(availableSeat);

    const selectedInfo = await screen.findByText(/Assento selecionado/i);
    const seatValueElement = selectedInfo.closest('div')?.querySelector('p:last-child');
    expect(seatValueElement?.textContent).toMatch(/Assento 2/i);
  });

  it('does not allow selecting an occupied seat', async () => {
    useReservationStore.setState({ selectedTrip: trip, selectedSeatId: null, reservation: null });

    renderWithProviders(
      <Routes>
        <Route path="/trips/:tripId/seats" element={<SeatSelectionPage />} />
      </Routes>,
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/trips/trip-1/seats']}>
            {children}
          </MemoryRouter>
        ),
      },
    );

    const occupiedSeat = await screen.findByRole('button', { name: /Assento 1 ocupado/i });
    expect(occupiedSeat).toBeDisabled();
  });

  it('keeps continue button disabled when no seat is selected', async () => {
    useReservationStore.setState({ selectedTrip: trip, selectedSeatId: null, reservation: null });

    renderWithProviders(
      <Routes>
        <Route path="/trips/:tripId/seats" element={<SeatSelectionPage />} />
      </Routes>,
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/trips/trip-1/seats']}>
            {children}
          </MemoryRouter>
        ),
      },
    );

    expect(await screen.findByRole('button', { name: /continuar para checkout/i })).toBeDisabled();
  });
});
