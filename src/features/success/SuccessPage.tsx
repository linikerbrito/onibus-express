import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservationStore } from '../../stores/reservation.store';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import PageContainer from '../../shared/components/ui/PageContainer';
import { Calendar, Clock, Timer, Bus, Ticket, Copy, CheckCircle } from 'lucide-react';
import { formatPriceBR } from '../../shared/utils/formatters';

export default function SuccessPage() {
  const reservation = useReservationStore((state) => state.reservation);
  const selectedTrip = useReservationStore((state) => state.selectedTrip);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reservation) {
      navigate('/');
    }
  }, [navigate, reservation]);

  if (!reservation || !selectedTrip) {
    return null;
  }

  const formatDatePtBR = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return year && month && day ? `${day}/${month}/${year}` : dateString;
  };

  const formattedSeat = reservation.seatId.replace('seat-', 'Assento ');
  const rota = `${selectedTrip.origin} → ${selectedTrip.destination}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(reservation.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <PageContainer maxWidth="xl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
        <Card className="w-full max-w-4xl space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={48} />
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-green-600 mb-3">
              Reserva concluída!
            </h1>
            <p className="text-lg text-slate-600">
              Seu bilhete foi reservado com sucesso. Confira os detalhes abaixo.
            </p>
          </div>

          {/* Reservation Code - Prominent */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-8 space-y-3">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Código da reserva</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-4xl font-bold text-blue-600 font-mono break-all flex-1">
                {reservation.id}
              </p>
              <button
                onClick={handleCopyCode}
                className={`flex-shrink-0 p-3 rounded-lg transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                }`}
                title="Copiar código"
              >
                {copied ? (
                  <CheckCircle size={20} />
                ) : (
                  <Copy size={20} />
                )}
              </button>
            </div>
            <p className="text-xs text-blue-600">Guarde este código para check-in</p>
          </div>

          {/* Trip Context */}
          <Card className="p-6 bg-slate-50">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Contexto da viagem</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <Bus className="text-slate-400 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-xs text-slate-600 uppercase">Rota</p>
                    <p className="font-semibold text-slate-900">{rota}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="text-slate-400 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-xs text-slate-600 uppercase">Data</p>
                    <p className="font-semibold text-slate-900">{formatDatePtBR(selectedTrip.departureDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="text-slate-400 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-xs text-slate-600 uppercase">Horário</p>
                    <p className="font-semibold text-slate-900">{selectedTrip.departureTime} → {selectedTrip.arrivalTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Timer className="text-slate-400 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-xs text-slate-600 uppercase">Duração</p>
                    <p className="font-semibold text-slate-900">{selectedTrip.duration}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Bus className="text-slate-400 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-xs text-slate-600 uppercase">Categoria</p>
                    <p className="font-semibold text-slate-900">{selectedTrip.category}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="text-slate-400 flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-xs text-slate-600 uppercase">Assento</p>
                    <p className="font-bold text-lg text-blue-600">{formattedSeat}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Passenger & Total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Passenger Info */}
            <Card className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Dados do passageiro</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Nome</p>
                  <p className="font-semibold text-slate-900">{reservation.passengerName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">CPF</p>
                  <p className="font-semibold text-slate-900">{reservation.passengerCpf}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">E-mail</p>
                  <p className="font-semibold text-slate-900 break-all">{reservation.passengerEmail}</p>
                </div>
              </div>
            </Card>

            {/* Total Value - Prominent */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 flex flex-col justify-center">
              <div className="text-center space-y-3">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Valor total pago</p>
                <p className="text-5xl font-bold text-green-600">
                  R$ {formatPriceBR(reservation.total)}
                </p>
                <p className="text-xs text-slate-600">Sem taxas adicionais</p>
              </div>
            </Card>
          </div>

          {/* Info Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <p>
              ℹ️ Um e-mail de confirmação foi enviado para <strong>{reservation.passengerEmail}</strong>
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
    </PageContainer>
  );
}
