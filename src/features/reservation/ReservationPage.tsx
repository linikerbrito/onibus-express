import { useState } from 'react';
import { getReservationByCode, cancelReservation } from '../../shared/services/reservation.service';
import { Reservation } from '../../shared/types/trip';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import Input from '../../shared/components/ui/Input';

export default function ReservationPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setReservation(null);
    try {
      const res = await getReservationByCode(code.trim());
      if (res) {
        setReservation(res);
      } else {
        setError('Reserva não encontrada para o código informado.');
      }
    } catch (e) {
      console.error('Erro ao buscar reserva:', e);
      setError('Erro ao buscar reserva. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;
    setLoading(true);
    try {
      const updated = await cancelReservation(reservation.id);
      setReservation(updated ?? null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Consultar reserva</h1>
        <p className="text-slate-600 mt-2">Informe o código da sua reserva para visualizá-la.</p>
      </div>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Input
            label="Código da reserva"
            id="code"
            placeholder="ex: res-abc123"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="sm:col-span-2">
            <Button onClick={handleSearch} disabled={!code || loading} variant="primary">
              {loading ? 'Buscando...' : 'Buscar reserva'}
            </Button>
          </div>
        </div>
        {error && <p className="text-red-600 mt-4">{error}</p>}

        {reservation && (
          <Card className="mt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Reserva</h2>
                <span className="text-sm text-slate-600">{reservation.status || 'Ativa'}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-slate-600">Código</p>
                  <p className="font-semibold text-slate-900">{reservation.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Passageiro</p>
                  <p className="font-semibold text-slate-900">{reservation.passengerName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Origem / Destino</p>
                  <p className="font-semibold text-slate-900">{reservation.tripId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Assento</p>
                  <p className="font-bold text-lg text-blue-600">{reservation.seatId}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Preço</p>
                  <p className="font-semibold text-slate-900">R$ {reservation.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleCancel} variant="danger" disabled={reservation.status === 'Cancelada' || loading}>
                  {reservation.status === 'Cancelada' ? 'Reserva cancelada' : 'Cancelar reserva'}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
}
