import {
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
