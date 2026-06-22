import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTripById } from '../../shared/services/trip.service';
import { useReservationStore } from '../../stores/reservation.store';
import { Seat } from '../../shared/types/trip';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import LoadingState from '../../shared/components/ui/LoadingState';

const seatMap: Seat[] = Array.from({ length: 32 }, (_, index) => ({
  id: `seat-${index + 1}`,
  label: `${index + 1}`,
  available: index % 5 !== 0,
}));

export default function SeatSelectionPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const selectedSeatId = useReservationStore((state) => state.selectedSeatId);
  const setSelectedSeat = useReservationStore((state) => state.setSelectedSeat);
  const setSelectedTrip = useReservationStore((state) => state.setSelectedTrip);

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => getTripById(tripId ?? ''),
    enabled: Boolean(tripId),
  });

  useEffect(() => {
    if (trip) {
      setSelectedTrip(trip);
    }
  }, [trip, setSelectedTrip]);

  const handleConfirm = () => {
    if (selectedSeatId) {
      navigate('/checkout');
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (!trip || !seat.available) {
      return;
    }

    setSelectedTrip(trip);
    setSelectedSeat(seat.id);
  };

  if (isLoading) return <LoadingState />;

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-slate-600">❌ Viagem não encontrada. Retorne à busca.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Trip Info */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {trip.origin} → {trip.destination}
        </h1>
        <div className="flex gap-4 text-slate-600">
          <span>📅 {trip.departureDate}</span>
          <span>🕐 {trip.departureTime}</span>
          <span>⏱️ {trip.duration}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat Map */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Escolha seu assento</h2>

              {/* Legend */}
              <div className="flex flex-wrap gap-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 border border-green-300 rounded"></div>
                  <span className="text-sm font-medium text-slate-700">Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 border border-gray-400 rounded"></div>
                  <span className="text-sm font-medium text-slate-700">Ocupado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 border border-blue-600 rounded"></div>
                  <span className="text-sm font-medium text-slate-700">Selecionado</span>
                </div>
              </div>

              {/* Seat Grid */}
              <div className="flex justify-center">
                <div className="grid grid-cols-8 gap-2 p-6 bg-slate-50 rounded-lg">
                  {seatMap.map((seat) => {
                    const isAvailable = seat.available;
                    const isSelected = selectedSeatId === seat.id;
                    let seatClass = 'bg-gray-300 text-gray-600 border border-gray-400 cursor-not-allowed';

                    if (isSelected) {
                      seatClass = 'bg-blue-500 text-white border-2 border-blue-600 shadow-lg';
                    } else if (isAvailable) {
                      seatClass = 'bg-green-100 text-green-900 border border-green-300 hover:bg-green-200 cursor-pointer';
                    }

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        onClick={() => handleSeatClick(seat)}
                        disabled={!isAvailable}
                        aria-pressed={isSelected}
                        aria-label={`Assento ${seat.label} ${isAvailable ? 'disponível' : 'ocupado'}`}
                        className={`
                          w-10 h-10 rounded flex items-center justify-center text-xs font-semibold
                          transition-all duration-200
                          ${seatClass}
                        `}
                      >
                        {seat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div>
          <Card className="sticky top-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">Resumo da viagem</h3>

              <div className="space-y-3 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm text-slate-600">Rota</p>
                  <p className="font-semibold text-slate-900">
                    {trip.origin} → {trip.destination}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Data e horário</p>
                  <p className="font-semibold text-slate-900">
                    {trip.departureDate} às {trip.departureTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Duração</p>
                  <p className="font-semibold text-slate-900">{trip.duration}</p>
                </div>
              </div>

              {selectedSeatId && (
                <div className="space-y-3 border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-sm text-slate-600">Assento selecionado</p>
                    <p className="font-bold text-lg text-blue-600">{selectedSeatId}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-600">Valor unitário</p>
                <p className="text-3xl font-bold text-blue-600">
                  R$ {trip.price.toFixed(2)}
                </p>
              </div>

              <Button
                type="button"
                onClick={handleConfirm}
                disabled={!selectedSeatId}
                variant="primary"
                className="w-full"
              >
                Continuar para checkout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
