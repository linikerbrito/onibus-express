import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReservationPage from './ReservationPage';
import { renderWithProviders } from '../../tests/test-utils';
import { Reservation } from '../../shared/types/trip';

const STORAGE_KEY = 'reservations_v1';

describe('ReservationPage', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  it('renders and shows not found for missing code', async () => {
    renderWithProviders(<ReservationPage />);
    const input = screen.getByLabelText(/código da reserva/i);
    await userEvent.type(input, 'nope');
    await userEvent.click(screen.getByRole('button', { name: /buscar reserva/i }));
    expect(await screen.findByText(/não encontrada/i)).toBeInTheDocument();
  });

  it('finds and cancels an existing reservation', async () => {
    const res: Reservation = {
      id: 'res-test',
      tripId: 'trip-1',
      passengerName: 'João',
      passengerCpf: '12345678901',
      passengerEmail: 'joao@example.com',
      seatId: 'A1',
      total: 100,
      status: 'Ativa',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([res]));

    renderWithProviders(<ReservationPage />);

    const input = screen.getByLabelText(/código da reserva/i);
    await userEvent.type(input, 'res-test');
    await userEvent.click(screen.getByRole('button', { name: /buscar reserva/i }));

    expect(await screen.findByText(/res-test/i)).toBeInTheDocument();
    expect(screen.getByText(/João/i)).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancelar reserva/i });
    await userEvent.click(cancelBtn);

    expect(await screen.findByText(/reserva cancelada/i)).toBeInTheDocument();
  });
});
