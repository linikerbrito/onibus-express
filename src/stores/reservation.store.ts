import { create } from 'zustand';
import { Reservation, Trip } from '../shared/types/trip';

interface ReservationState {
  selectedTrip: Trip | null;
  selectedSeatId: string | null;
  reservation: Reservation | null;
  setSelectedTrip: (trip: Trip) => void;
  setSelectedSeat: (seatId: string) => void;
  setReservation: (reservation: Reservation) => void;
  reset: () => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  selectedTrip: null,
  selectedSeatId: null,
  reservation: null,
  setSelectedTrip: (selectedTrip) => set({ selectedTrip }),
  setSelectedSeat: (selectedSeatId) => set({ selectedSeatId }),
  setReservation: (reservation) => set({ reservation }),
  reset: () => set({ selectedTrip: null, selectedSeatId: null, reservation: null }),
}));
