import { COUNTRY_TYPES } from '../entities/EntityConstants';
import {
  getAddressPhoneDiff,
  getDocumentTypeForAddressChange,
} from './generateChangeOfAddressTemplate';

const caseDetail = {
  caseCaption: 'Test Case Caption',
  contactPrimary: {
    address1: 'address 1',
    city: 'City',
    countryType: COUNTRY_TYPES.DOMESTIC,
    phone: '123-123-1234',
    postalCode: '12345',
    state: 'AL',
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
  it('Returns undefined when none of the fields differ', () => {
    const result = getDocumentTypeForAddressChange({
      newData: caseDetail.contactPrimary,
      oldData: caseDetail.contactPrimary,
    });

    expect(result).toBeUndefined();
  });
  it('Returns Notice of Change of Address when address 2 fields differ', () => {
    const result = getDocumentTypeForAddressChange({
      newData: caseDetail.contactPrimary,
      oldData: { ...caseDetail.contactPrimary, address2: 'something' },
    });

    expect(result).toEqual({
      eventCode: 'NCA',
      title: 'Notice of Change of Address',
    });
  });

  it('Returns Notice of Change of Address when only address fields differ', () => {
    const result = getDocumentTypeForAddressChange({
      newData: {
        ...caseDetail.contactPrimary,
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
        ...caseDetail.contactPrimary,
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
