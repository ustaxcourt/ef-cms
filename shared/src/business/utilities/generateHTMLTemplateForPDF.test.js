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
    expect(result.includes('<!DOCTYPE html>')).toBeTruthy();
    expect(result.includes('U.S. Tax Court')).toBeTruthy();
    expect(result.includes('Test Case Caption')).toBeTruthy();
    expect(result.includes('Test Caption Postfix')).toBeTruthy();
    expect(result.includes('123-45S')).toBeTruthy();
    expect(result.includes('<div>Test Main Content</div>')).toBeTruthy();
  });

  it('Returns HTML with the given optional content', () => {
    const result = generateHTMLTemplateForPDF(content, options);
    expect(result.includes('U.S. Tax Court')).toBeFalsy();
    expect(result.includes('Test Title')).toBeTruthy();
    expect(result.includes('#test-style { display: none; }')).toBeTruthy();
    expect(result.includes('<h2>Test H2</h2>')).toBeTruthy();
    expect(result.includes('<h3>Test H3</h3>')).toBeTruthy();
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

    expect(result.includes('<!DOCTYPE html>')).toBeTruthy();
    expect(result.includes('Test Case Caption')).toBeTruthy();
    expect(result.includes('Test Caption Postfix')).toBeTruthy();
    expect(result.includes('Notice of Change of Address')).toBeTruthy();
    expect(result.includes('123-45S')).toBeTruthy();
    expect(result.includes('address 1')).toBeTruthy();
    expect(result.includes('City')).toBeTruthy();
    expect(result.includes('ST')).toBeTruthy();
    expect(result.includes('12345')).toBeTruthy();
    expect(result.includes('Address One')).toBeTruthy();
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

    expect(result.includes('Test Document Title')).toBeTruthy();
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

    expect(result.includes('Notice of Change of Address')).toBeTruthy();
    expect(result.includes('address 1')).toBeTruthy();
    expect(result.includes('City')).toBeTruthy();
    expect(result.includes('ST')).toBeTruthy();
    expect(result.includes('12345')).toBeTruthy();
    expect(result.includes('Address One')).toBeTruthy();
    expect(result.includes('123-123-1234')).toBeFalsy();
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
      result.includes('Notice of Change of Telephone Number'),
    ).toBeTruthy();
    expect(result.includes('address 1')).toBeFalsy();
    expect(result.includes('City')).toBeFalsy();
    expect(result.includes('ST')).toBeFalsy();
    expect(result.includes('12345')).toBeFalsy();
    expect(result.includes('Address One')).toBeFalsy();
    expect(result.includes('123-123-1234')).toBeTruthy();
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
      result.includes('Notice of Change of Address and Telephone Number'),
    ).toBeTruthy();
    expect(result.includes('address 1')).toBeTruthy();
    expect(result.includes('City')).toBeTruthy();
    expect(result.includes('ST')).toBeTruthy();
    expect(result.includes('12345')).toBeTruthy();
    expect(result.includes('Address One')).toBeTruthy();
    expect(result.includes('321-321-4321')).toBeTruthy();
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

    expect(result.includes('address 1')).toBeTruthy();
    expect(result.includes('address 2')).toBeFalsy();
    expect(result.includes('address 3')).toBeFalsy();
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

    expect(result.includes('address 1')).toBeTruthy();
    expect(result.includes('address 2')).toBeTruthy();
    expect(result.includes('address 3')).toBeFalsy();
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

    expect(result.includes('address 1')).toBeTruthy();
    expect(result.includes('address 2')).toBeTruthy();
    expect(result.includes('address 3')).toBeTruthy();
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

    expect(result.includes('Address One')).toBeTruthy();
    expect(result.includes('Address Two')).toBeTruthy();
    expect(result.includes('Address Three')).toBeFalsy();
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

    expect(result.includes('Address One')).toBeTruthy();
    expect(result.includes('Address Two')).toBeTruthy();
    expect(result.includes('Address Three')).toBeTruthy();
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
      oldData: caseDetail.contactPrimary,
    });

    expect(result.includes('Test Country')).toBeTruthy();
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

    expect(result.includes('Test Case Caption')).toBeTruthy();
    expect(result.includes('Test Caption Postfix')).toBeTruthy();
    expect(result.includes('123-45S')).toBeTruthy();
    expect(
      result.includes('<table id="test-docket-record"></table>'),
    ).toBeTruthy();
    expect(
      result.includes('<table id="test-party-info"></table>'),
    ).toBeTruthy();
  });
});
