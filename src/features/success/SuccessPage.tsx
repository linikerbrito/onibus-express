import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservationStore } from '../../stores/reservation.store';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';

export default function SuccessPage() {
  const reservation = useReservationStore((state) => state.reservation);
  const navigate = useNavigate();

  useEffect(() => {
    if (!reservation) {
      navigate('/');
    }
  }, [navigate, reservation]);

  if (!reservation) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
      <Card className="w-full max-w-2xl text-center space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-5xl">✓</span>
          </div>
        </div>

        {/* Main Message */}
        <div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Reserva concluída!
          </h1>
          <p className="text-lg text-slate-600">
            Seu bilhete foi reservado com sucesso. Confira os detalhes abaixo.
          </p>
        </div>

        {/* Reservation Code */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-6 space-y-2">
          <p className="text-sm font-semibold text-blue-700">Código da reserva</p>
          <p className="text-4xl font-bold text-blue-600 font-mono break-all">
            {reservation.id}
          </p>
          <p className="text-xs text-blue-600">
            Guarde este código para check-in
          </p>
        </div>

        {/* Details */}
        <div className="bg-slate-50 rounded-lg p-6 space-y-4 text-left">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Informações do bilhete</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Passageiro</p>
              <p className="font-semibold text-slate-900">{reservation.passengerName}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">E-mail</p>
              <p className="font-semibold text-slate-900">{reservation.passengerEmail}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Viagem</p>
              <p className="font-semibold text-slate-900">{reservation.tripId}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Assento</p>
              <p className="font-bold text-lg text-blue-600">{reservation.seatId}</p>
            </div>

            <div>
              <p className="text-sm text-slate-600">Total pago</p>
              <p className="font-bold text-lg text-green-600">
                R$ {reservation.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <p>
            ⚠️ Um e-mail de confirmação foi enviado para <strong>{reservation.passengerEmail}</strong>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/')}
            className="flex-1"
          >
            Buscar outra viagem
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => globalThis.print()}
            className="flex-1"
          >
            Imprimir bilhete
          </Button>
        </div>
      </Card>
    </div>
  );
}
