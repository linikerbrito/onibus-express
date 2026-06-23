import { useState } from 'react';
import { getReservationByCode, cancelReservation } from '../../shared/services/reservation.service';
import { Reservation } from '../../shared/types/trip';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import Input from '../../shared/components/ui/Input';
import PageContainer from '../../shared/components/ui/PageContainer';
import { TicketCheck, Search, CheckCircle, Eye, RefreshCw, Lightbulb, Ticket } from 'lucide-react';
import { useReservationStore } from '../../stores/reservation.store';
import { formatPriceBR } from '../../shared/utils/formatters';

export default function ReservationPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState('');
  const selectedTrip = useReservationStore((state) => state.selectedTrip);

  const formatDatePtBR = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return year && month && day ? `${day}/${month}/${year}` : dateString;
  };

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
    <PageContainer maxWidth="xl">
        <div className="space-y-6 py-4">
        {/* Header Section */}
          <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <TicketCheck className="text-blue-600" size={32} />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Consultar reserva</h1>
              <p className="text-lg text-slate-600 mt-1">
              Informe o código da sua reserva para visualizar os detalhes da viagem.
            </p>
          </div>
        </div>

        {/* Search Card */}
        <Card className="p-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
              label="Código da reserva"
              id="code"
              icon={<Search size={18} />}
              placeholder="ex: res-abc123"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1"
            />

            <div className="flex-shrink-0">
              <Button
                onClick={handleSearch}
                disabled={!code || loading}
                variant="primary"
                size="sm"
                className="w-auto"
              >
                {loading ? 'Buscando...' : 'Buscar reserva'}
              </Button>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            Digite o código recebido após concluir sua compra.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </Card>

        {/* Reservation Details - Shown after search */}
        {reservation && (
          <Card className="p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Reserva</h2>
                  <p className="text-sm text-slate-600">Status: <span className="font-semibold">{reservation.status || 'Ativa'}</span></p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600 font-medium">Código da reserva</p>
                <p className="font-mono text-lg font-bold text-blue-600 mt-1">{reservation.id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">Passageiro</p>
                <p className="font-semibold text-slate-900 mt-1">{reservation.passengerName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">CPF</p>
                <p className="font-semibold text-slate-900 mt-1">{reservation.passengerCpf}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 font-medium">E-mail</p>
                <p className="font-semibold text-slate-900 mt-1 break-all">{reservation.passengerEmail}</p>
              </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Viagem</p>
                  <p className="font-semibold text-slate-900 mt-1">{selectedTrip ? `${selectedTrip.origin} → ${selectedTrip.destination}` : reservation.tripId}</p>
                  {selectedTrip && (
                    <p className="text-sm text-slate-600 mt-1">{formatDatePtBR(selectedTrip.departureDate)} • {selectedTrip.departureTime} → {selectedTrip.arrivalTime}</p>
                  )}
                  {selectedTrip && (
                    <p className="text-sm text-slate-600 mt-1">Categoria: <span className="font-semibold text-slate-900">{selectedTrip.category}</span></p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Assento</p>
                  <p className="font-bold text-lg text-blue-600 mt-1">{reservation.seatId.replace('seat-', 'Assento ')}</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <p className="text-sm text-slate-600 font-medium">Valor total</p>
              <p className="text-3xl font-bold text-green-600 mt-2">R$ {formatPriceBR(reservation.total)}</p>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleCancel}
                variant="danger"
                size="sm"
                disabled={reservation.status === 'Cancelada' || loading}
                className="w-auto"
              >
                {reservation.status === 'Cancelada' ? 'Reserva cancelada' : 'Cancelar reserva'}
              </Button>
            </div>
          </Card>
        )}

        {/* How It Works Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center">Como funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <Card className="p-6 space-y-4 text-center">
              <div className="flex justify-center">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Ticket className="text-blue-600" size={24} />
                  </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Passo 1</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Informe o código da reserva recebido após a compra.
                </p>
              </div>
            </Card>

            {/* Step 2 */}
            <Card className="p-6 space-y-4 text-center">
              <div className="flex justify-center">
                <div className="p-2 bg-slate-100 rounded-full">
                  <Eye className="text-slate-600" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Passo 2</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Visualize os detalhes da viagem e do passageiro.
                </p>
              </div>
            </Card>

            {/* Step 3 */}
            <Card className="p-6 space-y-4 text-center">
              <div className="flex justify-center">
                <div className="p-2 bg-slate-100 rounded-full">
                  <RefreshCw className="text-slate-600" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Passo 3</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Consulte sua reserva sempre que precisar.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Tip Section */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex gap-3">
            <Lightbulb className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-amber-900">Dica</h3>
                <p className="text-sm text-amber-800 mt-2">
                O código da reserva geralmente começa com <strong>"res-"</strong> seguido de letras e números. 
              </p>
                <div className="mt-3 bg-amber-100 border border-amber-300 rounded px-3 py-2 inline-block">
                  <span className="font-mono font-bold text-amber-900">res-z1a3bj4u</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
