import {
  generateChangeOfAddressTemplate,
  getAddressPhoneDiff,
  getDocumentTypeForAddressChange,
} from './generateChangeOfAddressTemplate';

const caseDetail = {
  caseCaption: 'Test Case Caption',
  caseCaptionPostfix: 'Test Caption Postfix',
  contactPrimary: {
    address1: 'address 1',
    city: 'City',
    countryType: 'domestic',
    phone: '123-123-1234',
    postalCode: '12345',
    state: 'ST',
  },
  docketNumber: '123-45',
  docketNumberSuffix: 'S',
};

describe('generateChangeOfAddressTemplate', () => {
  it('Returns HTML with the given case and contact data', () => {
    const result = generateChangeOfAddressTemplate({
      caseDetail,
      documentTitle: 'Notice of Change of Address',
      newData: {
        address1: 'Address One',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(result.indexOf('Test Case Caption')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Caption Postfix')).toBeGreaterThan(-1);
    expect(result.indexOf('Notice of Change of Address')).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('City')).toBeGreaterThan(-1);
    expect(result.indexOf('ST')).toBeGreaterThan(-1);
    expect(result.indexOf('12345')).toBeGreaterThan(-1);
    expect(result.indexOf('Address One')).toBeGreaterThan(-1);
  });

  it('Does not compute the document type / title if one is given', () => {
    const result = generateChangeOfAddressTemplate({
      caseDetail,
      documentTitle: 'Test Document Title',
      newData: {
        address1: 'Address One',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(result.indexOf('Test Document Title')).toBeGreaterThan(-1);
  });

  it('Returns a Notice of Change of Address when updating address fields only', () => {
    const result = generateChangeOfAddressTemplate({
      caseDetail,
      newData: {
        address1: 'Address One',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(result.indexOf('Notice of Change of Address')).toBeGreaterThan(-1);
    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('City')).toBeGreaterThan(-1);
    expect(result.indexOf('ST')).toBeGreaterThan(-1);
    expect(result.indexOf('12345')).toBeGreaterThan(-1);
    expect(result.indexOf('Address One')).toBeGreaterThan(-1);
    expect(result.indexOf('123-123-1234')).toEqual(-1);
  });

  it('Returns a Notice of Change of Telephone Number when updating the phone field only', () => {
    const result = generateChangeOfAddressTemplate({
      caseDetail,
      newData: {
        phone: '321-321-4321',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(
      result.indexOf('Notice of Change of Telephone Number'),
    ).toBeGreaterThan(-1);
    expect(result.indexOf('address 1')).toEqual(-1);
    expect(result.indexOf('City')).toEqual(-1);
    expect(result.indexOf('ST')).toEqual(-1);
    expect(result.indexOf('12345')).toEqual(-1);
    expect(result.indexOf('Address One')).toEqual(-1);
    expect(result.indexOf('123-123-1234')).toBeGreaterThan(-1);
  });

  it('Returns a Notice of Change of Address and Telephone Number when updating both the phone and address fields', () => {
    const result = generateChangeOfAddressTemplate({
      caseDetail,
      newData: {
        address1: 'Address One',
        phone: '321-321-4321',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(
      result.indexOf('Notice of Change of Address and Telephone Number'),
    ).toBeGreaterThan(-1);
    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('City')).toBeGreaterThan(-1);
    expect(result.indexOf('ST')).toBeGreaterThan(-1);
    expect(result.indexOf('12345')).toBeGreaterThan(-1);
    expect(result.indexOf('Address One')).toBeGreaterThan(-1);
    expect(result.indexOf('321-321-4321')).toBeGreaterThan(-1);
  });

  it('Does NOT show address2 or address3 if they are not in the old data or new data', () => {
    const result = generateChangeOfAddressTemplate({
      caseDetail,
      documentTitle: 'Notice of Change of Address',
      newData: {
        address1: 'Address One',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('address 2')).toEqual(-1);
    expect(result.indexOf('address 3')).toEqual(-1);
  });

  it('Shows address2 if it is in the old data', () => {
    const result = generateChangeOfAddressTemplate({
      caseDetail,
      documentTitle: 'Notice of Change of Address',
      newData: {
        address1: 'Address One',
      },
      oldData: {
        ...caseDetail.contactPrimary,
        address2: 'address 2',
      },
    });

    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('address 2')).toBeGreaterThan(-1);
    expect(result.indexOf('address 3')).toEqual(-1);
  });

  it('Shows address3 if it is in the old data', () => {
    const result = generateChangeOfAddressTemplate({
      caseDetail,
      documentTitle: 'Notice of Change of Address',
      newData: {
        address1: 'Address One',
      },
      oldData: {
        ...caseDetail.contactPrimary,
        address2: 'address 2',
        address3: 'address 3',
      },
    });

    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('address 2')).toBeGreaterThan(-1);
    expect(result.indexOf('address 3')).toBeGreaterThan(-1);
  });

  it('Shows address2 if it is in the new data', () => {
    const result = generateChangeOfAddressTemplate({
      caseDetail,
      documentTitle: 'Notice of Change of Address',
      newData: {
        address1: 'Address One',
        address2: 'Address Two',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(result.indexOf('Address One')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Two')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Three')).toEqual(-1);
  });

  it('Shows address3 if it is in the new data', () => {
    const result = generateChangeOfAddressTemplate({
      caseDetail,
      documentTitle: 'Notice of Change of Address',
      newData: {
        address1: 'Address One',
        address2: 'Address Two',
        address3: 'Address Three',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(result.indexOf('Address One')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Two')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Three')).toBeGreaterThan(-1);
  });

  it('Shows country if countryType has been changed to/from international', () => {
    const result = generateChangeOfAddressTemplate({
      caseDetail,
      documentTitle: 'Notice of Change of Address',
      newData: {
        address1: 'Address One',
        country: 'Test Country',
        countryType: 'international',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(result.indexOf('Test Country')).toBeGreaterThan(-1);
  });
});

describe('getAddressPhoneDiff', () => {
  it('Returns only fields with differing values', () => {
    const result = getAddressPhoneDiff({
      newData: {
        address1: 'same',
        address2: 'same',
        city: 'different',
        phone: 'different',
      },
      oldData: {
        address1: 'same',
        address2: 'same',
        city: 'tnereffid',
        phone: '',
      },
    });

    expect(result).toEqual({
      city: {
        newData: 'different',
        oldData: 'tnereffid',
      },
      phone: {
        newData: 'different',
        oldData: '',
      },
    });
  });
});

describe('getDocumentTypeForAddressChange', () => {
  it('Returns Notice of Change of Address when only address fields differ', () => {
    const result = getDocumentTypeForAddressChange({
      newData: {
        address1: 'Address One',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(result).toEqual({
      eventCode: 'NCA',
      title: 'Notice of Change of Address',
    });
  });

  it('Returns Notice of Change of Telephone Number when only the phone fields differ', () => {
    const result = getDocumentTypeForAddressChange({
      newData: {
        phone: '321-321-4321',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(result).toEqual({
      eventCode: 'NCP',
      title: 'Notice of Change of Telephone Number',
    });
  });

  it('Returns a Notice of Change of Address and Telephone Number when both the phone and address fields differ', () => {
    const result = getDocumentTypeForAddressChange({
      caseDetail,
      newData: {
        address1: 'Address One',
        phone: '321-321-4321',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(result).toEqual({
      eventCode: 'NCAP',
      title: 'Notice of Change of Address and Telephone Number',
    });
  });
});
