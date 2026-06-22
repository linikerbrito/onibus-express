import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useReservationStore } from '../../stores/reservation.store';
import { createReservation } from '../../shared/services/reservation.service';
import Button from '../../shared/components/ui/Button';
import Input from '../../shared/components/ui/Input';
import Card from '../../shared/components/ui/Card';

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

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', cpf: '', email: '' },
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Finalize sua compra</h1>
        <p className="text-slate-600 mt-2">Preencha seus dados para confirmar a reserva</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form - Left Side */}
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit(handleSubmitForm)} noValidate className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Dados do passageiro</h2>
              </div>

              <Input
                label="Nome completo"
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                {...register('name')}
                error={errors.name?.message}
              />

              <Input
                label="CPF"
                id="cpf"
                type="text"
                inputMode="numeric"
                placeholder="00000000000"
                {...register('cpf')}
                error={errors.cpf?.message}
              />

              <Input
                label="E-mail"
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                {...register('email')}
                error={errors.email?.message}
              />

              <Button type="submit" variant="primary" className="w-full mt-8">
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
                  <p className="font-semibold text-slate-900">
                    {selectedTrip.origin} → {selectedTrip.destination}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Data e horário</p>
                  <p className="font-semibold text-slate-900">
                    {selectedTrip.departureDate} às {selectedTrip.departureTime}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-600">Assento</p>
                  <p className="font-bold text-lg text-blue-600">{selectedSeatId}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Valor da passagem</span>
                  <span className="font-semibold text-slate-900">
                    R$ {selectedTrip.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    R$ {selectedTrip.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                ℹ️ Após confirmar, você receberá um código de reserva por e-mail.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
