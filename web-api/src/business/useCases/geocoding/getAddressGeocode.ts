import { ServerApplicationContext } from '@web-api/applicationContext';
import FormData from 'form-data';
import { parse } from 'csv-parse/sync';

export const geocodeAddressBatch = async (
  applicationContext: ServerApplicationContext,
  csvBuffer: Buffer | string,
): Promise<
  Array<{
    id: string;
    lat: number | null;
    lng: number | null;
    matched: boolean;
  }>
> => {
  const http = applicationContext.getHttpClient();

  try {
    const form = new FormData();
    form.append(
      'addressFile',
      Buffer.isBuffer(csvBuffer) ? csvBuffer : Buffer.from(csvBuffer),
      {
        filename: 'addresses.csv',
        contentType: 'text/csv',
      },
    );

    const url =
      'https://geocoding.geo.census.gov/geocoder/locations/addressbatch';
    const headers = form.getHeaders();
    const response = await http.post(url, form, {
      headers,
      responseType: 'arraybuffer',
      timeout: 600000,
    });

    const text = Buffer.from(response.data).toString('utf8');
    const rows = parse(text, {
      columns: false,
      skip_empty_lines: true,
    }) as string[][];

    return rows.map(cols => {
      const [
        rawId = '',
        ,
        matchType = '',
        matchedAddress = '',
        rawLng = '',
        rawLat = '',
      ] = cols;
      const id = rawId.replace(/^"|"$/g, '');
      const lng = rawLng !== '' ? Number(rawLng) : null;
      const lat = rawLat !== '' ? Number(rawLat) : null;

      if (
        (lng != null && Number.isNaN(lng)) ||
        (lat != null && Number.isNaN(lat))
      ) {
        applicationContext.logger.warn(
          'Geocoding: Invalid coordinates in batch response',
          {
            id,
            matchedAddress,
            matchType,
          },
        );
        return { id, lat: null, lng: null, matched: false };
      }

      const matched =
        matchType.toLowerCase() === 'match' && lat != null && lng != null;

      if (!matched) {
        applicationContext.logger.info(
          'Geocoding: No address match found (batch)',
          {
            id,
            matchedAddress,
            matchType,
          },
        );
      }

      return { id, lat, lng, matched };
    });
  } catch (error: any) {
    const status = error?.response?.status;
    applicationContext.logger.error('Geocoding: API error (batch)', {
      error: error.message,
      status,
    });
    return [];
  }
};
