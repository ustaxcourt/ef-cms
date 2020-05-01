const createApplicationContext = require('../../../../../web-api/src/applicationContext');
const {
  generateChangeOfAddressTemplate,
} = require('./generateChangeOfAddressTemplate');
const applicationContext = createApplicationContext({});

describe('generateChangeOfAddressTemplate', () => {
  const caseDetail = {
    caseTitle: 'Test Case Title',
    contactPrimary: {
      address1: 'address 1',
      city: 'City',
      countryType: 'domestic',
      phone: '123-123-1234',
      postalCode: '12345',
      state: 'STATE',
    },
    docketNumber: '123-45',
    docketNumberSuffix: 'S',
  };

  it('Returns HTML with the given case and contact data', async () => {
    const result = await generateChangeOfAddressTemplate({
      applicationContext,
      content: {
        caseCaptionExtension: 'Petitioner(s)',
        caseTitle: caseDetail.caseTitle,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        documentTitle: 'Notice of Change of Address',
        name: 'Test Name',
        newData: {
          address1: 'Address One',
        },
        oldData: caseDetail.contactPrimary,
      },
    });

    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(result.indexOf('Test Case Title')).toBeGreaterThan(-1);
    expect(result.indexOf('Notice of Change of Address')).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('City')).toBeGreaterThan(-1);
    expect(result.indexOf('STATE')).toBeGreaterThan(-1);
    expect(result.indexOf('12345')).toBeGreaterThan(-1);
    expect(result.indexOf('Address One')).toBeGreaterThan(-1);
  });

  it('Does not compute the document type / title if one is given', async () => {
    const result = await generateChangeOfAddressTemplate({
      applicationContext,
      content: {
        caseCaptionExtension: 'Petitioner(s)',
        caseTitle: caseDetail.caseTitle,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        documentTitle: 'Test Document Title',
        name: 'Test Name',
        newData: {
          address1: 'Address One',
        },
        oldData: caseDetail.contactPrimary,
      },
    });

    expect(result.indexOf('Test Document Title')).toBeGreaterThan(-1);
  });

  it('Returns a Notice of Change of Address when updating address fields only', async () => {
    const result = await generateChangeOfAddressTemplate({
      applicationContext,
      content: {
        caseCaptionExtension: 'Petitioner(s)',
        caseTitle: caseDetail.caseTitle,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        documentTitle: 'Notice of Change of Address',
        name: 'Test Name',
        newData: {
          address1: 'Address One',
        },
        oldData: caseDetail.contactPrimary,
      },
    });

    expect(result.indexOf('Notice of Change of Address')).toBeGreaterThan(-1);
    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('City')).toBeGreaterThan(-1);
    expect(result.indexOf('STATE')).toBeGreaterThan(-1);
    expect(result.indexOf('12345')).toBeGreaterThan(-1);
    expect(result.indexOf('Address One')).toBeGreaterThan(-1);
    expect(result.indexOf('123-123-1234')).toEqual(-1);
  });

  it('Returns a Notice of Change of Telephone Number when updating the phone field only', async () => {
    const result = await generateChangeOfAddressTemplate({
      applicationContext,
      content: {
        caseCaptionExtension: 'Petitioner(s)',
        caseTitle: caseDetail.caseTitle,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        documentTitle: 'Notice of Change of Telephone Number',
        name: 'Test Name',
        newData: {
          phone: '321-321-4321',
        },
        oldData: caseDetail.contactPrimary,
      },
    });

    expect(
      result.indexOf('Notice of Change of Telephone Number'),
    ).toBeGreaterThan(-1);
    expect(result.indexOf('address 1')).toEqual(-1);
    expect(result.indexOf('City')).toEqual(-1);
    expect(result.indexOf('STATE')).toEqual(-1);
    expect(result.indexOf('12345')).toEqual(-1);
    expect(result.indexOf('Address One')).toEqual(-1);
    expect(result.indexOf('123-123-1234')).toBeGreaterThan(-1);
  });

  it('Returns a Notice of Change of Address and Telephone Number when updating both the phone and address fields', async () => {
    const result = await generateChangeOfAddressTemplate({
      applicationContext,
      content: {
        caseCaptionExtension: 'Petitioner(s)',
        caseTitle: caseDetail.caseTitle,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        documentTitle: 'Notice of Change of Address and Telephone Number',
        name: 'Test Name',
        newData: {
          address1: 'Address One',
          phone: '321-321-4321',
        },
        oldData: caseDetail.contactPrimary,
      },
    });

    expect(
      result.indexOf('Notice of Change of Address and Telephone Number'),
    ).toBeGreaterThan(-1);
    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('City')).toBeGreaterThan(-1);
    expect(result.indexOf('STATE')).toBeGreaterThan(-1);
    expect(result.indexOf('12345')).toBeGreaterThan(-1);
    expect(result.indexOf('Address One')).toBeGreaterThan(-1);
    expect(result.indexOf('321-321-4321')).toBeGreaterThan(-1);
  });

  it('Does NOT show address2 or address3 if they are not in the old data or new data', async () => {
    const result = await generateChangeOfAddressTemplate({
      applicationContext,
      content: {
        caseCaptionExtension: 'Petitioner(s)',
        caseTitle: caseDetail.caseTitle,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        documentTitle: 'Notice of Change of Address',
        name: 'Test Name',
        newData: {
          address1: 'Address One',
        },
        oldData: caseDetail.contactPrimary,
      },
    });

    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('address 2')).toEqual(-1);
    expect(result.indexOf('address 3')).toEqual(-1);
  });

  it('Shows address2 if it is in the old data', async () => {
    const result = await generateChangeOfAddressTemplate({
      applicationContext,
      content: {
        caseCaptionExtension: 'Petitioner(s)',
        caseTitle: caseDetail.caseTitle,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        documentTitle: 'Notice of Change of Address',
        name: 'Test Name',
        newData: {
          address1: 'Address One',
        },
        oldData: {
          ...caseDetail.contactPrimary,
          address2: 'address 2',
        },
      },
    });

    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('address 2')).toBeGreaterThan(-1);
    expect(result.indexOf('address 3')).toEqual(-1);
  });

  it('Shows address3 if it is in the old data', async () => {
    const result = await generateChangeOfAddressTemplate({
      applicationContext,
      content: {
        caseCaptionExtension: 'Petitioner(s)',
        caseTitle: caseDetail.caseTitle,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        documentTitle: 'Notice of Change of Address',
        name: 'Test Name',
        newData: {
          address1: 'Address One',
        },
        oldData: {
          ...caseDetail.contactPrimary,
          address2: 'address 2',
          address3: 'address 3',
        },
      },
    });

    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('address 2')).toBeGreaterThan(-1);
    expect(result.indexOf('address 3')).toBeGreaterThan(-1);
  });

  it('Shows address2 if it is in the new data', async () => {
    const result = await generateChangeOfAddressTemplate({
      applicationContext,
      content: {
        caseCaptionExtension: 'Petitioner(s)',
        caseTitle: caseDetail.caseTitle,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        documentTitle: 'Notice of Change of Address',
        name: 'Test Name',
        newData: {
          address1: 'Address One',
          address2: 'Address Two',
        },
        oldData: caseDetail.contactPrimary,
      },
    });

    expect(result.indexOf('Address One')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Two')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Three')).toEqual(-1);
  });

  it('Shows address3 if it is in the new data', async () => {
    const result = await generateChangeOfAddressTemplate({
      applicationContext,
      content: {
        caseCaptionExtension: 'Petitioner(s)',
        caseTitle: caseDetail.caseTitle,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        documentTitle: 'Notice of Change of Address',
        name: 'Test Name',
        newData: {
          address1: 'Address One',
          address2: 'Address Two',
          address3: 'Address Three',
        },
        oldData: caseDetail.contactPrimary,
      },
    });

    expect(result.indexOf('Address One')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Two')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Three')).toBeGreaterThan(-1);
  });

  it('Shows country if countryType has been changed to/from international', async () => {
    const result = await generateChangeOfAddressTemplate({
      applicationContext,
      content: {
        caseCaptionExtension: 'Petitioner(s)',
        caseTitle: caseDetail.caseTitle,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        documentTitle: 'Notice of Change of Address',
        name: 'Test Name',
        newData: {
          address1: 'Address One',
          country: 'Test Country',
          countryType: 'international',
        },
        oldData: {
          ...caseDetail.contactPrimary,
          country: 'Old Country',
        },
      },
    });

    expect(result.indexOf('Test Country')).toBeGreaterThan(-1);
    expect(result.indexOf('Old Country')).toBeGreaterThan(-1);
  });

  it('Shows inCareOf if inCareOf has been changed', async () => {
    const result = await generateChangeOfAddressTemplate({
      applicationContext,
      content: {
        caseCaptionExtension: 'Petitioner(s)',
        caseTitle: caseDetail.caseTitle,
        docketNumberWithSuffix:
          caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
        documentTitle: 'Notice of Change of Address',
        name: 'Test Name',
        newData: {
          address1: 'Address One',
          country: 'Test Country',
          countryType: 'international',
          inCareOf: 'Rachel Ray',
        },
        oldData: {
          ...caseDetail.contactPrimary,
          inCareOf: 'Guy Fieri',
        },
      },
    });

    expect(result.indexOf('Guy Fieri')).toBeGreaterThan(-1);
    expect(result.indexOf('Rachel Ray')).toBeGreaterThan(-1);
  });
});
