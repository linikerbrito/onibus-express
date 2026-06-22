import { Reservation } from '../types/trip';

const STORAGE_KEY = 'reservations_v1';

function readStorage(): Reservation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Reservation[];
  } catch {
    return [];
  }
}

function writeStorage(items: Reservation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function createReservation(reservation: Reservation): Promise<Reservation> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const items = readStorage();
  const toSave = { ...reservation, status: reservation.status ?? 'Ativa' };
  items.push(toSave);
  writeStorage(items);
  return toSave;
}

export async function getReservationByCode(code: string): Promise<Reservation | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const items = readStorage();
  return items.find((r) => r.id === code);
}

export async function cancelReservation(code: string): Promise<Reservation | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const items = readStorage();
  const idx = items.findIndex((r) => r.id === code);
  if (idx === -1) return undefined;
  items[idx] = { ...items[idx], status: 'Cancelada' };
  writeStorage(items);
  return items[idx];
}
