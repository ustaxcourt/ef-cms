import {
  generateChangeOfAddressTemplate,
  generateHTMLTemplateForPDF,
  generatePrintableDocketRecordTemplate,
} from './generateHTMLTemplateForPDF';

describe('generateHTMLTemplateForPDF', () => {
  const content = {
    caption: 'Test Case Caption',
    captionPostfix: 'Test Caption Postfix',
    docketNumberWithSuffix: '123-45S',
    main: '<div>Test Main Content</div>',
  };

  const options = {
    h2: 'Test H2',
    h3: 'Test H3',
    styles: '#test-style { display: none; }',
    title: 'Test Title',
  };

  it('Returns HTML with the given content', () => {
    const result = generateHTMLTemplateForPDF(content, {});
    expect(result.indexOf('<!DOCTYPE html>')).toBe(0);
    expect(result.indexOf('U.S. Tax Court')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Case Caption')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Caption Postfix')).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(result.indexOf('<div>Test Main Content</div>')).toBeGreaterThan(-1);
  });

  it('Returns HTML with the given optional content', () => {
    const result = generateHTMLTemplateForPDF(content, options);
    expect(result.indexOf('U.S. Tax Court')).toBe(-1);
    expect(result.indexOf('Test Title')).toBeGreaterThan(-1);
    expect(result.indexOf('#test-style { display: none; }')).toBeGreaterThan(
      -1,
    );
    expect(result.indexOf('<h2>Test H2</h2>')).toBeGreaterThan(-1);
    expect(result.indexOf('<h3>Test H3</h3>')).toBeGreaterThan(-1);
  });
});

describe('generateChangeOfAddressTemplate', () => {
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

  it('Returns HTML with the given case and contact data', () => {
    const result = generateChangeOfAddressTemplate({
      caption: caseDetail.caseCaption,
      captionPostfix: caseDetail.caseCaptionPostfix,
      docketNumberWithSuffix:
        caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
      documentTitle: 'Notice of Change of Address',
      name: 'Test Name',
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
      caption: caseDetail.caseCaption,
      captionPostfix: caseDetail.caseCaptionPostfix,
      docketNumberWithSuffix:
        caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
      documentTitle: 'Test Document Title',
      name: 'Test Name',
      newData: {
        address1: 'Address One',
      },
      oldData: caseDetail.contactPrimary,
    });

    expect(result.indexOf('Test Document Title')).toBeGreaterThan(-1);
  });

  it('Returns a Notice of Change of Address when updating address fields only', () => {
    const result = generateChangeOfAddressTemplate({
      caption: caseDetail.caseCaption,
      captionPostfix: caseDetail.caseCaptionPostfix,
      docketNumberWithSuffix:
        caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
      documentTitle: 'Notice of Change of Address',
      name: 'Test Name',
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
      caption: caseDetail.caseCaption,
      captionPostfix: caseDetail.caseCaptionPostfix,
      docketNumberWithSuffix:
        caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
      documentTitle: 'Notice of Change of Telephone Number',
      name: 'Test Name',
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
      caption: caseDetail.caseCaption,
      captionPostfix: caseDetail.caseCaptionPostfix,
      docketNumberWithSuffix:
        caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
      documentTitle: 'Notice of Change of Address and Telephone Number',
      name: 'Test Name',
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
      caption: caseDetail.caseCaption,
      captionPostfix: caseDetail.caseCaptionPostfix,
      docketNumberWithSuffix:
        caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
      documentTitle: 'Notice of Change of Address',
      name: 'Test Name',
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
      caption: caseDetail.caseCaption,
      captionPostfix: caseDetail.caseCaptionPostfix,
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
    });

    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('address 2')).toBeGreaterThan(-1);
    expect(result.indexOf('address 3')).toEqual(-1);
  });

  it('Shows address3 if it is in the old data', () => {
    const result = generateChangeOfAddressTemplate({
      caption: caseDetail.caseCaption,
      captionPostfix: caseDetail.caseCaptionPostfix,
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
    });

    expect(result.indexOf('address 1')).toBeGreaterThan(-1);
    expect(result.indexOf('address 2')).toBeGreaterThan(-1);
    expect(result.indexOf('address 3')).toBeGreaterThan(-1);
  });

  it('Shows address2 if it is in the new data', () => {
    const result = generateChangeOfAddressTemplate({
      caption: caseDetail.caseCaption,
      captionPostfix: caseDetail.caseCaptionPostfix,
      docketNumberWithSuffix:
        caseDetail.docketNumber + (caseDetail.docketNumberSuffix || ''),
      documentTitle: 'Notice of Change of Address',
      name: 'Test Name',
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
      caption: caseDetail.caseCaption,
      captionPostfix: caseDetail.caseCaptionPostfix,
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
    });

    expect(result.indexOf('Address One')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Two')).toBeGreaterThan(-1);
    expect(result.indexOf('Address Three')).toBeGreaterThan(-1);
  });

  it('Shows country if countryType has been changed to/from international', () => {
    const result = generateChangeOfAddressTemplate({
      caption: caseDetail.caseCaption,
      captionPostfix: caseDetail.caseCaptionPostfix,
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
    });

    expect(result.indexOf('Test Country')).toBeGreaterThan(-1);
    expect(result.indexOf('Old Country')).toBeGreaterThan(-1);
  });

  it('Shows inCareOf if inCareOf has been changed', () => {
    const result = generateChangeOfAddressTemplate({
      caption: caseDetail.caseCaption,
      captionPostfix: caseDetail.caseCaptionPostfix,
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
    });

    expect(result.indexOf('c/o Guy Fieri')).toBeGreaterThan(-1);
    expect(result.indexOf('c/o Rachel Ray')).toBeGreaterThan(-1);
  });
});

describe('generatePrintableDocketRecordTemplate', () => {
  const content = {
    caption: 'Test Case Caption',
    captionPostfix: 'Test Caption Postfix',
    docketNumberWithSuffix: '123-45S',
    docketRecord: '<table id="test-docket-record"></table>',
    partyInfo: '<table id="test-party-info"></table>',
  };

  it('Returns HTML with the given content', () => {
    const result = generatePrintableDocketRecordTemplate(content);

    expect(result.indexOf('Test Case Caption')).toBeGreaterThan(-1);
    expect(result.indexOf('Test Caption Postfix')).toBeGreaterThan(-1);
    expect(result.indexOf('123-45S')).toBeGreaterThan(-1);
    expect(
      result.indexOf('<table id="test-docket-record"></table>'),
    ).toBeGreaterThan(-1);
    expect(
      result.indexOf('<table id="test-party-info"></table>'),
    ).toBeGreaterThan(-1);
  });
});
