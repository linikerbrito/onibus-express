export type TripCategory = 'Executivo' | 'Leito' | 'Semi-leito' | 'Convencional';

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  category: TripCategory;
  price: number;
  availableSeats: number;
}

export interface Seat {
  id: string;
  label: string;
  available: boolean;
}

export interface Reservation {
  id: string;
  tripId: string;
  passengerName: string;
  passengerCpf: string;
  passengerEmail: string;
  seatId: string;
  total: number;
  status?: string;
}
