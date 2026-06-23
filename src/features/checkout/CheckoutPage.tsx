import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useReservationStore } from '../../stores/reservation.store';
import { createReservation } from '../../shared/services/reservation.service';
import Button from '../../shared/components/ui/Button';
import Input from '../../shared/components/ui/Input';
import Card from '../../shared/components/ui/Card';
import PageContainer from '../../shared/components/ui/PageContainer';
import { Calendar, Clock, Timer, Bus, Ticket } from 'lucide-react';
import { formatPriceBR } from '../../shared/utils/formatters';
import { PatternFormat } from 'react-number-format';

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

const formatDatePtBR = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return year && month && day ? `${day}/${month}/${year}` : dateString;
};

const checkoutSchema = z.object({
  name: z.string().min(3, 'Informe o nome completo'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos numéricos'),
  email: z.string().email('Informe um email válido'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const selectedTrip = useReservationStore((state) => state.selectedTrip);
  const selectedSeatId = useReservationStore((state) => state.selectedSeatId);
  const setReservation = useReservationStore((state) => state.setReservation);

  const {
  register,
  control,
  handleSubmit,
  formState: { errors },
} = useForm<CheckoutFormData>({
  resolver: zodResolver(checkoutSchema),
  defaultValues: {
    name: '',
    cpf: '',
    email: '',
  },
});

  if (!selectedTrip || !selectedSeatId) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-slate-600">❌ Escolha uma viagem e um assento antes de continuar.</p>
      </div>
    );
  }

  const handleSubmitForm = async (values: CheckoutFormData) => {
    const reservation = await createReservation({
      id: `res-${Math.random().toString(36).slice(2, 10)}`,
      tripId: selectedTrip.id,
      passengerName: values.name,
      passengerCpf: values.cpf,
      passengerEmail: values.email,
      seatId: selectedSeatId,
      total: selectedTrip.price,
    });

    setReservation(reservation);
    navigate('/success');
  };

  const formattedSeat = selectedSeatId ? `Assento ${selectedSeatId.replace('seat-', '')}` : null;

  return (
    <PageContainer maxWidth="xl">
      <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Finalize sua compra</h1>
        <p className="text-slate-600 mt-2">Preencha seus dados para confirmar a reserva</p>
      </div>

      {/* Context Card (top) */}
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-slate-900">{selectedTrip.origin} → {selectedTrip.destination}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="text-slate-400 flex-shrink-0" size={18} />
              <span className="font-medium text-slate-700">{formatDatePtBR(selectedTrip.departureDate)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="text-slate-400 flex-shrink-0" size={18} />
              <span className="font-medium text-slate-700">{selectedTrip.departureTime} → {selectedTrip.arrivalTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <Timer className="text-slate-400 flex-shrink-0" size={18} />
              <span className="font-medium text-slate-700">{selectedTrip.duration}</span>
            </div>

            <div className="flex items-center gap-2">
              <Bus className="text-slate-400 flex-shrink-0" size={18} />
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeClasses(selectedTrip.category)}`}>
                {selectedTrip.category}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Ticket className="text-slate-400 flex-shrink-0" size={18} />
              <span className="font-medium text-slate-700">{formattedSeat}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form - Left Side */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit(handleSubmitForm)} noValidate className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">Dados do passageiro</h2>
              </div>

              <Input
                label="Nome completo"
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                {...register('name')}
                error={errors.name?.message}
              />

              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <PatternFormat
                    format="###.###.###-##"
                    mask="_"
                    customInput={Input}
                    label="CPF"
                    id="cpf"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    value={field.value}
                    onValueChange={(values) => field.onChange(values.value)}
                    error={errors.cpf?.message}
                  />
                )}
              />

              <Input
                label="E-mail"
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                {...register('email')}
                error={errors.email?.message}
              />

              <Button type="submit" variant="primary" className="w-full mt-6">
                Confirmar e pagar
              </Button>
            </form>
          </Card>
        </div>

        {/* Summary - Right Side */}
        <div>
          <Card className="sticky top-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Resumo da compra</h2>

              <div className="space-y-3 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-sm text-slate-600">Rota</p>
                  <p className="font-semibold text-slate-900">{selectedTrip.origin} → {selectedTrip.destination}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Data</p>
                  <p className="font-medium text-slate-700">{formatDatePtBR(selectedTrip.departureDate)}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Horário</p>
                  <p className="font-semibold text-slate-900">{selectedTrip.departureTime} → {selectedTrip.arrivalTime}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Duração</p>
                  <p className="font-medium text-slate-700">{selectedTrip.duration}</p>
                </div>

                {selectedTrip.category && (
                  <div>
                    <p className="text-sm text-slate-600">Categoria</p>
                    <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClasses(selectedTrip.category)}`}>
                      {selectedTrip.category}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-slate-600">Assento</p>
                  <p className="font-bold text-lg text-blue-600">{formattedSeat}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Passagem</span>
                  <span className="font-semibold text-slate-900">R$ {formatPriceBR(selectedTrip.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Taxas e serviços</span>
                  <span className="font-semibold text-slate-700">Grátis</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-3xl font-bold text-blue-600">R$ {formatPriceBR(selectedTrip.price)}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <Ticket className="inline-block mr-2 text-blue-700" size={16} />
                Sua reserva será gerada imediatamente após a confirmação e enviada para o e-mail informado.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </PageContainer>
  );
}
