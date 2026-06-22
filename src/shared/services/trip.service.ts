import { Trip } from '../types/trip';
import { trips } from '../../mocks/trips';

interface SearchParams {
  origin: string;
  destination: string;
  date: string;
}

function normalizeSearchValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/,\s*[a-z]{2}$/i, '');
}

export async function searchTrips(params: SearchParams): Promise<Trip[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const normalizedOrigin = normalizeSearchValue(params.origin);
  const normalizedDestination = normalizeSearchValue(params.destination);

  return trips.filter((trip) =>
    normalizeSearchValue(trip.origin).includes(normalizedOrigin) &&
    normalizeSearchValue(trip.destination).includes(normalizedDestination) &&
    trip.departureDate === params.date,
  );
}

export async function getTripById(tripId: string): Promise<Trip | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return trips.find((trip) => trip.id === tripId);
}
