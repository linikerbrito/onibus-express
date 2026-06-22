import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchTripsPage from './SearchTripsPage';
import { renderWithProviders } from '../../tests/test-utils';

describe('SearchTripsPage', () => {
  it('renders search form with origin, destination and date fields', () => {
    renderWithProviders(<SearchTripsPage />);

    expect(screen.getByLabelText(/origem/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destino/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar/i })).toBeInTheDocument();
  });

  it('allows filling the search fields', async () => {
    renderWithProviders(<SearchTripsPage />);

    await userEvent.type(screen.getByLabelText(/origem/i), 'São Paulo');
    await userEvent.type(screen.getByLabelText(/destino/i), 'Rio de Janeiro');
    await userEvent.type(screen.getByLabelText(/data/i), '2026-07-15');

    expect(screen.getByLabelText(/origem/i)).toHaveValue('São Paulo');
    expect(screen.getByLabelText(/destino/i)).toHaveValue('Rio de Janeiro');
    expect(screen.getByLabelText(/data/i)).toHaveValue('2026-07-15');
  });

  it('shows autocomplete suggestions while typing origin', async () => {
    renderWithProviders(<SearchTripsPage />);

    const originInput = screen.getByLabelText(/origem/i);
    await userEvent.click(originInput);
    await userEvent.type(originInput, 'São');

    expect(await screen.findByText(/São Paulo, SP/i)).toBeInTheDocument();

    await userEvent.click(screen.getByText(/São Paulo, SP/i));
    expect(originInput).toHaveValue('São Paulo, SP');
  });

  it('swaps origin and destination values when inverter is clicked', async () => {
    renderWithProviders(<SearchTripsPage />);

    const originInput = screen.getByLabelText(/origem/i);
    const destinationInput = screen.getByLabelText(/destino/i);

    await userEvent.type(originInput, 'São Paulo');
    await userEvent.type(destinationInput, 'Rio de Janeiro');

    await userEvent.click(screen.getByRole('button', {
      name: /inverter origem e destino/i,
    }));

    expect(originInput).toHaveValue('Rio de Janeiro');
    expect(destinationInput).toHaveValue('São Paulo');
  });

  it('shows available trips after search', async () => {
    renderWithProviders(<SearchTripsPage />);

    await userEvent.type(screen.getByLabelText(/origem/i), 'São Paulo');
    await userEvent.type(screen.getByLabelText(/destino/i), 'Rio de Janeiro');
    await userEvent.type(screen.getByLabelText(/data/i), '2026-07-15');
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }));

    expect(await screen.findByText(/São Paulo → Rio de Janeiro/i)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 189.90/i)).toBeInTheDocument();
  });

  it('shows empty state when no trips match the search', async () => {
    renderWithProviders(<SearchTripsPage />);

    await userEvent.type(screen.getByLabelText(/origem/i), 'Natal');
    await userEvent.type(screen.getByLabelText(/destino/i), 'Fortaleza');
    await userEvent.type(screen.getByLabelText(/data/i), '2026-07-15');
    await userEvent.click(screen.getByRole('button', { name: /buscar/i }));

    expect(await screen.findByText(/Nenhuma viagem encontrada/i)).toBeInTheDocument();
  });
});
