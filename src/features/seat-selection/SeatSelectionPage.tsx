import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTripById } from '../../shared/services/trip.service';
import { useReservationStore } from '../../stores/reservation.store';
import { Seat } from '../../shared/types/trip';
import Button from '../../shared/components/ui/Button';
import Card from '../../shared/components/ui/Card';
import PageContainer from '../../shared/components/ui/PageContainer';
import { formatPriceBR } from '../../shared/utils/formatters';

const getCategoryBadgeClasses = (category: string) => {
  switch (category) {
    case 'Executivo':
      return 'bg-blue-50 text-blue-700 border border-blue-100';
    case 'Semi-leito':
      return 'bg-purple-50 text-purple-700 border border-purple-100';
    case 'Leito':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    default:
      return 'bg-slate-100 text-slate-700 border border-slate-200';
  }
};
import LoadingState from '../../shared/components/ui/LoadingState';
import { Calendar, Clock, Timer, Bus } from 'lucide-react';

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

  const formatDatePtBR = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return year && month && day ? `${day}/${month}/${year}` : dateString;
  };

  const handleConfirm = () => {
    if (selectedSeatId) {
      navigate('/checkout');
    }
  };

  const formattedSelectedSeat = selectedSeatId ? `Assento ${selectedSeatId.replace('seat-', '')}` : null;

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
    <PageContainer maxWidth="xl">
      <div className="space-y-8">
        {/* Trip summary */}
        <Card className="p-4">
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{trip.origin} → {trip.destination}</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="text-slate-400" size={16} />
                <span className="font-medium text-slate-700">{formatDatePtBR(trip.departureDate)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="text-slate-400" size={16} />
                <span className="font-medium text-slate-700">{trip.departureTime} → {trip.arrivalTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <Timer className="text-slate-400" size={16} />
                <span className="font-medium text-slate-700">{trip.duration}</span>
              </div>

              {trip.category && (
                <div className="flex items-center gap-2">
                  <Bus className="text-slate-400" size={16} />
                  <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClasses(trip.category)}`}>
                    {trip.category}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

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
                <div className="bg-slate-50 border-2 border-slate-200 rounded-t-[80px] rounded-b-2xl p-8">
                  <div className="mb-8 flex justify-center">
                    <div className="px-4 py-2 bg-white rounded-full border text-sm text-slate-600">
                      <Bus className="inline-block mr-2 text-slate-400" size={16} />Frente
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {seatMap.map((seat, index) => {
                      const isAvailable = seat.available;
                      const isSelected = selectedSeatId === seat.id;

                      let seatClass =
                        'bg-gray-300 text-gray-600 border border-gray-400 cursor-not-allowed';

                      if (isSelected) {
                        seatClass =
                          'bg-blue-500 text-white border-2 border-blue-600 shadow-lg';
                      } else if (isAvailable) {
                        seatClass =
                          'bg-green-100 text-green-900 border border-green-300 hover:bg-green-200 cursor-pointer';
                      }

                      const positionInRow = index % 4;

                      return (
                        <div
                          key={seat.id}
                          className={
                            positionInRow === 2
                              ? 'col-start-4'
                              : ''
                          }
                        >
                          <button
                            type="button"
                            onClick={() => handleSeatClick(seat)}
                            disabled={!isAvailable}
                            className={`
                              w-10 h-10 rounded-lg
                              flex items-center justify-center
                              text-xs font-semibold
                              transition-all duration-200
                              ${seatClass}
                            `}
                          >
                            {seat.label}
                          </button>
                        </div>
                      );
                    })}
                  </div>
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
                  <p className="font-semibold text-slate-900">{trip.origin} → {trip.destination}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Data</p>
                  <p className="font-medium text-slate-700">{formatDatePtBR(trip.departureDate)}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Horário</p>
                  <p className="font-semibold text-slate-900">{trip.departureTime} → {trip.arrivalTime}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Duração</p>
                  <p className="font-medium text-slate-700">{trip.duration}</p>
                </div>

                {trip.category && (
                  <div>
                    <p className="text-sm text-slate-600">Categoria</p>
                    <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClasses(trip.category)}`}>
                      {trip.category}
                    </div>
                  </div>
                )}
              </div>

              {selectedSeatId && (
                <div className="space-y-3 border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-sm text-slate-600">Assento selecionado</p>
                    <p className="font-bold text-lg text-blue-600">{formattedSelectedSeat}</p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-600">Valor unitário</p>
                <p className="text-3xl font-bold text-blue-600">R$ {formatPriceBR(trip.price)}</p>
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
  </PageContainer>
  );
}
