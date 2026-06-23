import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CheckoutPage from './CheckoutPage';
import { renderWithProviders } from '../../tests/test-utils';
import { useReservationStore } from '../../stores/reservation.store';
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

describe('CheckoutPage', () => {
  beforeEach(() => {
    useReservationStore.setState({ selectedTrip: null, selectedSeatId: null, reservation: null });
  });

  it('validates required name field', async () => {
    useReservationStore.setState({ selectedTrip: trip, selectedSeatId: 'seat-1', reservation: null });

    renderWithProviders(<CheckoutPage />);

    await userEvent.click(screen.getByRole('button', { name: /confirmar e pagar/i }));

    expect(await screen.findByText(/Informe o nome completo/i)).toBeInTheDocument();
  });

  it('validates invalid CPF and email', async () => {
    useReservationStore.setState({ selectedTrip: trip, selectedSeatId: 'seat-1', reservation: null });

    renderWithProviders(<CheckoutPage />);

    await userEvent.type(screen.getByLabelText(/nome completo/i), 'Teste');
    await userEvent.type(screen.getByLabelText(/cpf/i), '123');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: /confirmar e pagar/i }));

    expect(await screen.findByText(/CPF deve ter 11 dígitos numéricos/i)).toBeInTheDocument();
    expect(screen.getByText(/Informe um email válido/i)).toBeInTheDocument();
  });

  it('allows confirming reservation with valid data', async () => {
    useReservationStore.setState({ selectedTrip: trip, selectedSeatId: 'seat-1', reservation: null });

    renderWithProviders(
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/success" element={<div>Reserva concluída</div>} />
      </Routes>,
      {
        wrapper: ({ children }) => (
          <MemoryRouter initialEntries={['/']}>
            {children}
          </MemoryRouter>
        ),
      },
    );

    await userEvent.type(screen.getByLabelText(/nome completo/i), 'Maria Silva');
    await userEvent.type(screen.getByLabelText(/cpf/i), '12345678901');
    await userEvent.type(screen.getByLabelText(/e-mail/i), 'maria@example.com');
    await userEvent.click(screen.getByRole('button', { name: /confirmar e pagar/i }));

    expect(await screen.findByText(/Reserva concluída/i)).toBeInTheDocument();
  });
});
