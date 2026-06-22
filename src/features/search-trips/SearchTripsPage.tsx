import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { searchTrips } from '../../shared/services/trip.service';
import { Trip } from '../../shared/types/trip';
import { useReservationStore } from '../../stores/reservation.store';
import Button from '../../shared/components/ui/Button';
import AutocompleteInput from '../../shared/components/ui/AutocompleteInput';
import Card from '../../shared/components/ui/Card';
import EmptyState from '../../shared/components/ui/EmptyState';
import Input from '../../shared/components/ui/Input';
import LoadingState from '../../shared/components/ui/LoadingState';
import busImage from '../../assets/images/bus-hero-travel.png';
import { cities } from '../../mocks/cities';

const searchSchema = z.object({
  origin: z.string().min(2, 'Informe a origem'),
  destination: z.string().min(2, 'Informe o destino'),
  date: z.string().min(1, 'Informe a data'),
});

type SearchFormData = z.infer<typeof searchSchema>;

export default function SearchTripsPage() {
  const navigate = useNavigate();
  const setSelectedTrip = useReservationStore((state) => state.setSelectedTrip);
  const [searchParams, setSearchParams] = useState<SearchFormData | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: { origin: '', destination: '', date: today },
  });

  const originValue = watch('origin');
  const destinationValue = watch('destination');

  const {
    data: trips,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['searchTrips', searchParams],
    queryFn: () => searchTrips(searchParams!),
    enabled: Boolean(searchParams),
    retry: false,
  });

  const handleSearch = (values: SearchFormData) => {
    setSearchParams(values);
  };

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    navigate(`/trips/${trip.id}/seats`);
  };

  const isPluralTrip = trips?.length !== 1;

  return (
    <div className="space-y-8">
      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <div className="relative h-[330px] md:h-[380px] lg:h-[420px]">
          <img
            src={busImage}
            alt="Ônibus de viagem em estrada, pronto para embarque"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/35" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
              <div className="max-w-2xl text-white">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Encontre sua próxima viagem
                </h1>
                <p className="mt-4 text-lg text-slate-100/90 sm:text-xl">
                  Pesquise rotas, escolha seu assento e finalize sua reserva em poucos minutos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-24 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <Card className="border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 md:p-8">
            <form onSubmit={handleSubmit(handleSearch)} noValidate className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_280px] items-end">
                <AutocompleteInput
                  label="Origem"
                  id="origin"
                  placeholder="Ex: São Paulo"
                  options={cities}
                  value={originValue}
                  {...register('origin')}
                  error={errors.origin?.message}
                />
                <button
                  type="button"
                  aria-label="Inverter origem e destino"
                  className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => {
                    const originValue = getValues('origin');
                    const destinationValue = getValues('destination');
                    setValue('origin', destinationValue, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                    setValue('destination', originValue, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                >
                  ⇄
                </button>
                <AutocompleteInput
                  label="Destino"
                  id="destination"
                  placeholder="Ex: Rio de Janeiro"
                  options={cities}
                  value={destinationValue}
                  {...register('destination')}
                  error={errors.destination?.message}
                />
                <Input
                  label="Data"
                  id="date"
                  type="date"
                  {...register('date')}
                  error={errors.date?.message}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">
                  Reserve rápido, pague com segurança e viaje tranquilo.
                </div>
                <Button type="submit" variant="primary" className="w-full sm:w-auto">
                  Buscar passagens
                </Button>
              </div>
            </form>
          </Card>
          {!searchParams && (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900">
                <p className="text-3xl">⚡</p>
                <p className="mt-3 font-semibold">Reserva rápida</p>
                <p className="mt-1 text-sm text-slate-600">Busca e compra em segundos.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900">
                <p className="text-3xl">💺</p>
                <p className="mt-3 font-semibold">Escolha de assentos</p>
                <p className="mt-1 text-sm text-slate-600">Selecione o lugar ideal.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900">
                <p className="text-3xl">✅</p>
                <p className="mt-3 font-semibold">Confirmação imediata</p>
                <p className="mt-1 text-sm text-slate-600">Bilhete digital instantâneo.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {isLoading && <LoadingState />}

      {isError && (
        <Card className="bg-red-50 border-red-200">
          <div className="text-center">
            <p className="text-red-700 font-medium">
              ❌ Não foi possível buscar viagens. Tente novamente.
            </p>
          </div>
        </Card>
      )}

      {trips && trips.length === 0 && searchParams && (
        <EmptyState
          icon="🔍"
          title="Nenhuma viagem encontrada"
          description="Tente ajustar seus critérios de busca."
        />
      )}

      {trips && trips.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            {trips.length} viagem{isPluralTrip ? 's' : ''} encontrada{isPluralTrip ? 's' : ''}
          </h2>
          <div className="space-y-3">
            {trips.map((trip) => (
              <Card key={trip.id} className="hover:shadow-lg cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      {trip.origin} → {trip.destination}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                      <span>📅 {trip.departureDate}</span>
                      <span>🕐 {trip.departureTime}</span>
                      <span>⏱️ {trip.duration}</span>
                      <span>💺 {trip.availableSeats} lugares disponíveis</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between md:flex-col md:text-right gap-3">
                    <div>
                      <p className="text-sm text-slate-600">Preço por assento</p>
                      <p className="text-3xl font-bold text-blue-600">
                        R$ {trip.price.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleSelectTrip(trip)}
                      variant="primary"
                    >
                      Selecionar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
