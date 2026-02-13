import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { geocodeAddressBatch } from './getAddressGeocode';

describe('geocodeAddressBatch', () => {
  const censusUrl =
    'https://geocoding.geo.census.gov/geocoder/locations/addressbatch';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns geocoded results for a successful match', async () => {
    const csvResponse =
      '"id1","input addr","Match","123 Main St","-77.0","38.9"';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('id,address,city,state,zip'),
    );

    expect(result).toEqual([
      {
        id: 'id1',
        lat: 38.9,
        lng: -77.0,
        matched: true,
      },
    ]);
    expect(applicationContext.logger.info).not.toHaveBeenCalled();
  });

  it('handles row with fewer columns using default values', async () => {
    const csvResponse = '"id-short","addr"';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('csv'),
    );

    expect(result).toEqual([
      {
        id: 'id-short',
        lat: null,
        lng: null,
        matched: false,
      },
    ]);
    expect(applicationContext.logger.info).toHaveBeenCalled();
  });

  it('handles row with empty first column using default', async () => {
    const csvResponse = ',"addr","No Match","","",""';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('csv'),
    );

    expect(result[0].id).toBe('');
    expect(result[0].matched).toBe(false);
  });

  it('handles row with single column using destructuring defaults', async () => {
    const csvResponse = '"only-id"';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('csv'),
    );

    expect(result[0]).toEqual({
      id: 'only-id',
      lat: null,
      lng: null,
      matched: false,
    });
  });

  it('returns no match and logs info when matchType is not Match', async () => {
    const csvResponse =
      '"id2","input addr","No Match","","",""';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('id,address,city,state,zip'),
    );

    expect(result).toEqual([
      {
        id: 'id2',
        lat: null,
        lng: null,
        matched: false,
      },
    ]);
    expect(applicationContext.logger.info).toHaveBeenCalledWith(
      'Geocoding: No address match found (batch)',
      {
        id: 'id2',
        matchedAddress: '',
        matchType: 'No Match',
      },
    );
  });

  it('returns matched false and logs warn when coordinates are invalid (NaN)', async () => {
    const csvResponse =
      '"id3","input addr","Match","456 Oak Ave","invalid","invalid"';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('id,address,city,state,zip'),
    );

    expect(result).toEqual([
      {
        id: 'id3',
        lat: null,
        lng: null,
        matched: false,
      },
    ]);
    expect(applicationContext.logger.warn).toHaveBeenCalledWith(
      'Geocoding: Invalid coordinates in batch response',
      {
        id: 'id3',
        matchedAddress: '456 Oak Ave',
        matchType: 'Match',
      },
    );
  });

  it('returns matched false and logs warn when only lng is NaN', async () => {
    const csvResponse =
      '"id3a","addr","Match","addr","invalid","39"';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('csv'),
    );

    expect(result[0].matched).toBe(false);
    expect(applicationContext.logger.warn).toHaveBeenCalled();
  });

  it('returns matched false and logs warn when only lat is NaN', async () => {
    const csvResponse =
      '"id3b","addr","Match","addr","-77","invalid"';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('csv'),
    );

    expect(result[0].matched).toBe(false);
    expect(applicationContext.logger.warn).toHaveBeenCalled();
  });

  it('treats match type as case-insensitive for matched true', async () => {
    const csvResponse =
      '"id4","input addr","match","789 Pine Rd","-76.5","39.0"';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('id,address,city,state,zip'),
    );

    expect(result).toEqual([
      {
        id: 'id4',
        lat: 39.0,
        lng: -76.5,
        matched: true,
      },
    ]);
  });

  it('accepts string csvBuffer and converts to Buffer', async () => {
    const csvResponse =
      '"id5","input addr","Match","321 Elm St","-77.1","38.8"';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      'id,address,city,state,zip',
    );

    expect(result).toEqual([
      {
        id: 'id5',
        lat: 38.8,
        lng: -77.1,
        matched: true,
      },
    ]);
  });

  it('returns empty array and logs error when API throws', async () => {
    const apiError = {
      response: { status: 500 },
      message: 'Server error',
    };
    applicationContext.getHttpClient().post.mockRejectedValue(apiError);

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('id,address,city,state,zip'),
    );

    expect(result).toEqual([]);
    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      'Geocoding: API error (batch)',
      {
        error: 'Server error',
        status: 500,
      },
    );
  });

  it('returns empty array and logs error when API throws without response', async () => {
    const apiError = { message: 'Network error' };
    applicationContext.getHttpClient().post.mockRejectedValue(apiError);

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('id,address,city,state,zip'),
    );

    expect(result).toEqual([]);
    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      'Geocoding: API error (batch)',
      {
        error: 'Network error',
        status: undefined,
      },
    );
  });

  it('returns empty array and logs error when API throws with response but no status', async () => {
    const apiError = { response: {}, message: 'Bad response' };
    applicationContext.getHttpClient().post.mockRejectedValue(apiError);

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('csv'),
    );

    expect(result).toEqual([]);
    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      'Geocoding: API error (batch)',
      {
        error: 'Bad response',
        status: undefined,
      },
    );
  });

  it('calls POST with Census URL, form, headers, responseType, and timeout', async () => {
    const csvResponse = '"id6","addr","Match","addr","-77","39"';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    await geocodeAddressBatch(applicationContext, Buffer.from('csv'));

    expect(applicationContext.getHttpClient).toHaveBeenCalled();
    const postCall = applicationContext.getHttpClient().post.mock.calls[0];
    expect(postCall[0]).toBe(censusUrl);
    expect(postCall[2]).toMatchObject({
      responseType: 'arraybuffer',
      timeout: 600000,
    });
    expect(postCall[2].headers).toBeDefined();
  });

  it('parses CSV with skip_empty_lines', async () => {
    const csvResponse =
      '"id7","addr","Match","addr","-77","39"\n\n"id8","addr","No Match","","",""';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('csv'),
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: 'id7',
      lat: 39,
      lng: -77,
      matched: true,
    });
    expect(result[1]).toEqual({
      id: 'id8',
      lat: null,
      lng: null,
      matched: false,
    });
  });

  it('returns empty array when API returns empty CSV', async () => {
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from('', 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('csv'),
    );

    expect(result).toEqual([]);
  });

  it('strips quotes from id', async () => {
    const csvResponse =
      '"""id9""","addr","Match","addr","-77","39"';
    applicationContext.getHttpClient().post.mockResolvedValue({
      data: Buffer.from(csvResponse, 'utf8'),
    });

    const result = await geocodeAddressBatch(
      applicationContext,
      Buffer.from('csv'),
    );

    expect(result[0].id).toBe('id9');
  });
});
