import { ServerApplicationContext } from '@web-api/applicationContext';

export type GeocodeResult = {
  lat: number;
  lng: number;
} | null;

export type AddressInput = {
  address1: string;
  city: string;
  state?: string;
  postalCode: string;
};

const CENSUS_GEOCODER_URL =
  'https://geocoding.geo.census.gov/geocoder/locations/address';


export const geocodeAddress = async (
  applicationContext: ServerApplicationContext,
  { address }: { address: AddressInput },
): Promise<GeocodeResult> => {
  const http = applicationContext.getHttpClient();

    try {
      const response = await http.get(CENSUS_GEOCODER_URL, {
        params: {
          benchmark: 'Public_AR_Current',
          city: address.city,
          format: 'json',
          state: address.state || '',
          street: address.address1,
          zip: address.postalCode,
        },
        timeout: 15000,
      });

      const matches = response.data?.result?.addressMatches;
      if (!matches || matches.length === 0) {
        applicationContext.logger.info('Geocoding: No address match found', {
          address,
        });
        return null;
      }

      const best = matches[0];
      const lng = best?.coordinates?.x;
      const lat = best?.coordinates?.y;

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        applicationContext.logger.warn(
          'Geocoding: Invalid coordinates in response',
          { address, coordinates: best?.coordinates },
        );
        return null;
      }

      return { lat, lng };
    } catch (error: any) {
      const status = error?.response?.status;
        // Non-retryable error
        applicationContext.logger.error('Geocoding: API error', {
          address,
          error: error.message,
          status,
        });
        return null;
    }
};