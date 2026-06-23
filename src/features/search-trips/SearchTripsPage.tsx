import { useEffect, useRef, useState } from 'react';
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
import { MapPin, Navigation, ArrowRightLeft, Calendar, Bus, Clock, Timer, Users, Search } from 'lucide-react';
import busImage from '../../assets/images/bus-hero-travel.png';
import PageContainer from '../../shared/components/ui/PageContainer';
import { cities } from '../../mocks/cities';
import { formatPriceBR } from '../../shared/utils/formatters';

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
  const resultsRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  const formatDatePtBR = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return year && month && day ? `${day}/${month}/${year}` : dateString;
  };

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

  const smoothScrollTo = (targetY: number, duration = 600) => {
    const startY = globalThis.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      globalThis.scrollTo(0, startY + distance * ease(progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (searchParams && resultsRef.current) {
      timeoutId = globalThis.setTimeout(() => {
        const top = resultsRef.current!.getBoundingClientRect().top + globalThis.scrollY - 24;
        smoothScrollTo(top, 700);
      }, 1000);
    }

    return () => {
      if (timeoutId) {
        globalThis.clearTimeout(timeoutId);
      }
    };
  }, [searchParams]);

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    navigate(`/trips/${trip.id}/seats`);
  };

  const cheapestTrip = trips?.reduce((currentCheapest, trip) =>
    !currentCheapest || trip.price < currentCheapest.price ? trip : currentCheapest,
    null as Trip | null,
  );
  const cheapestTripId = cheapestTrip?.id;
  const isPluralTrip = trips?.length !== 1;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden">
        <div className="relative h-[330px] md:h-[380px] lg:h-[420px] w-full">
          <img
            src={busImage}
            alt="Ônibus de viagem em estrada, pronto para embarque"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 to-slate-950/15" />
          <PageContainer maxWidth="xl" className="absolute inset-0 flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Encontre sua próxima viagem
              </h1>
              <p className="mt-4 text-lg text-slate-100/90 sm:text-xl">
                Pesquise rotas, escolha seu assento e finalize sua reserva em poucos minutos.
              </p>
            </div>
          </PageContainer>
        </div>
      </section>

      <section>
        <PageContainer maxWidth="xl" className="pt-0">
          <Card className="border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 md:p-8">
            <form onSubmit={handleSubmit(handleSearch)} noValidate className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_280px]">
                <AutocompleteInput
                  label="Origem"
                  id="origin"
                  placeholder="Ex: São Paulo"
                  options={cities}
                  value={originValue}
                  icon={<Navigation size={18} />}
                  {...register('origin')}
                  error={errors.origin?.message}
                />
                <div className="self-center flex justify-center">
                  <button
                    type="button"
                    aria-label="Inverter locais"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <ArrowRightLeft size={20} />
                  </button>
                </div>
                <AutocompleteInput
                  label="Destino"
                  id="destination"
                  placeholder="Ex: Rio de Janeiro"
                  options={cities}
                  value={destinationValue}
                  icon={<MapPin size={18} />}
                  {...register('destination')}
                  error={errors.destination?.message}
                />
                <div className="">
                  <Input
                    label="Data"
                    id="date"
                    type="date"
                    icon={<Calendar size={18} />}
                    iconPosition="left"
                    {...register('date')}
                    error={errors.date?.message}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">
                  Reserve rápido, pague com segurança e viaje tranquilo.
                </div>
                <Button type="submit" variant="primary" className="w-full sm:w-auto py-3 px-8 text-lg">
                  Buscar passagens
                </Button>
              </div>
            </form>
          </Card>
          {!searchParams && (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900">
                <div className="text-2xl"><Bus size={28} /></div>
                <p className="mt-3 font-semibold">Reserva rápida</p>
                <p className="mt-1 text-sm text-slate-600">Busca e compra em segundos.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900">
                <div className="text-2xl"><Users size={28} /></div>
                <p className="mt-3 font-semibold">Escolha de assentos</p>
                <p className="mt-1 text-sm text-slate-600">Selecione o lugar ideal.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-900">
                <div className="text-2xl"><Timer size={28} /></div>
                <p className="mt-3 font-semibold">Confirmação imediata</p>
                <p className="mt-1 text-sm text-slate-600">Bilhete digital instantâneo.</p>
              </div>
            </div>
          )}
        </PageContainer>
      </section>

      <PageContainer maxWidth="xl">
        <div ref={resultsRef} className="space-y-6">
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
              icon={<Search size={48} className="text-slate-400" />}
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
                  <Card key={trip.id} className="hover:shadow-lg cursor-pointer py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {trip.origin} → {trip.destination}
                          </h3>
                          {trip.id === cheapestTripId && (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-semibold">
                              Melhor preço
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                          <span className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClasses(trip.category)}`}>
                            <Bus className="h-3 w-3" />
                            {trip.category}
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-slate-600">{formatDatePtBR(trip.departureDate)}</span>
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-semibold text-slate-700">{trip.departureTime}</span>
                            <span className="text-slate-400">→</span>
                            <span className="font-semibold text-slate-700">{trip.arrivalTime}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 ml-auto md:ml-0 text-slate-800 font-semibold">
                            <Timer className="h-4 w-4 text-slate-700" />
                            {trip.duration}
                          </span>
                        </div>
                        <div className="mt-3 text-sm">
                          {trip.availableSeats <= 5 ? (
                            <span className="inline-flex items-center gap-1 font-semibold text-orange-600">
                              <Users className="h-4 w-4" />
                              Restam apenas {trip.availableSeats} assentos
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-600">
                              <Users className="h-4 w-4" />
                              {trip.availableSeats} lugares disponíveis
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-end justify-between md:flex-col md:text-right gap-3">
                        <div>
                          <p className="text-sm text-slate-600">Por pessoa</p>
                          <p className="text-3xl font-bold text-blue-600">
                            R$ {formatPriceBR(trip.price)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleSelectTrip(trip)}
                          variant="primary"
                        >
                          Selecionar assento
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
