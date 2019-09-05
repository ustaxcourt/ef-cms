const { caseSearchInteractor } = require('./caseSearchInteractor');

describe('caseSearchInteractor', () => {
  const applicationContext = {
    environment: { stage: 'local' },
    getPersistenceGateway: () => ({
      getAllCatalogCases: async () => {
        return [
          {
            caseCaption: 'Brett Osborne, Petitioner',
            caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
            contactPrimary: {
              countryType: 'domestic',
              name: 'Test 2',
              state: 'AS',
            },
            docketNumber: '101-19',
            docketNumberSuffix: 'W',
            filedDate: '2019-03-01T21:40:46.415Z',
            yearFiled: '2019',
          },
          {
            caseCaption: 'Adam Osborne, Petitioner',
            caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
            contactPrimary: {
              countryType: 'international',
              name: 'Test 1',
              state: null,
            },
            docketNumber: '102-19',
            docketNumberSuffix: 'W',
            filedDate: '2019-03-05T21:40:46.415Z',
            yearFiled: '2019',
          },
          {
            caseCaption: 'Bob Osborne, Petitioner',
            caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
            contactPrimary: {
              countryType: 'domestic',
              name: 'something else',
              state: 'OK',
            },
            docketNumber: '103-18',
            docketNumberSuffix: 'W',
            filedDate: '2018-03-07T21:40:46.415Z',
            yearFiled: '2018',
          },
          {
            caseCaption: 'Casey Osborne, Petitioner',
            caseId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
            contactPrimary: {
              countryType: 'international',
              name: 'some other person',
            },
            contactSecondary: {
              countryType: 'domestic',
              name: 'test person',
              state: 'OK',
            },
            docketNumber: '104-18',
            docketNumberSuffix: 'W',
            filedDate: '2018-03-07T21:40:46.415Z',
            yearFiled: '2018',
          },
        ];
      },
    }),
  };

  it('filters catalog cases by petitioner name - not case sensitive', async () => {
    const foundCases = await caseSearchInteractor({
      applicationContext,
      petitionerName: 'test',
    });

    expect(foundCases.length).toEqual(3);
    expect(foundCases).toMatchObject([
      { docketNumber: '101-19' },
      { docketNumber: '102-19' },
      { docketNumber: '104-18' },
    ]);
  });

  it('filters catalog cases by petitioner name with no results', async () => {
    const foundCases = await caseSearchInteractor({
      applicationContext,
      petitionerName: 'Test!',
    });

    expect(foundCases.length).toEqual(0);
  });

  it('filters catalog cases by country type domestic', async () => {
    const foundCases = await caseSearchInteractor({
      applicationContext,
      countryType: 'domestic',
    });

    expect(foundCases.length).toEqual(3);
    expect(foundCases).toMatchObject([
      { docketNumber: '101-19' },
      { docketNumber: '103-18' },
      { docketNumber: '104-18' },
    ]);
  });

  it('filters catalog cases by country type international', async () => {
    const foundCases = await caseSearchInteractor({
      applicationContext,
      countryType: 'international',
    });

    expect(foundCases.length).toEqual(2);
    expect(foundCases).toMatchObject([
      { docketNumber: '102-19' },
      { docketNumber: '104-18' },
    ]);
  });

  it('filters catalog cases by state', async () => {
    const foundCases = await caseSearchInteractor({
      applicationContext,
      countryType: 'domestic',
      state: 'OK',
    });

    expect(foundCases.length).toEqual(2);
    expect(foundCases).toMatchObject([
      { docketNumber: '103-18' },
      { docketNumber: '104-18' },
    ]);
  });

  it('filters catalog cases by state with no results', async () => {
    const foundCases = await caseSearchInteractor({
      applicationContext,
      countryType: 'domestic',
      state: 'AB',
    });

    expect(foundCases.length).toEqual(0);
  });

  it('filters catalog cases by year filed min', async () => {
    const foundCases = await caseSearchInteractor({
      applicationContext,
      yearFiledMin: '2019',
    });

    expect(foundCases.length).toEqual(2);
    expect(foundCases).toMatchObject([
      { docketNumber: '101-19' },
      { docketNumber: '102-19' },
    ]);
  });

  it('filters catalog cases by year filed max', async () => {
    const foundCases = await caseSearchInteractor({
      applicationContext,
      yearFiledMax: '2018',
    });

    expect(foundCases.length).toEqual(2);
    expect(foundCases).toMatchObject([
      { docketNumber: '103-18' },
      { docketNumber: '104-18' },
    ]);
  });

  it('filters catalog cases by year filed min and max', async () => {
    const foundCases = await caseSearchInteractor({
      applicationContext,
      yearFiledMax: '2019',
      yearFiledMin: '2018',
    });

    expect(foundCases.length).toEqual(4);
    expect(foundCases).toMatchObject([
      { docketNumber: '101-19' },
      { docketNumber: '102-19' },
      { docketNumber: '103-18' },
      { docketNumber: '104-18' },
    ]);
  });
});
