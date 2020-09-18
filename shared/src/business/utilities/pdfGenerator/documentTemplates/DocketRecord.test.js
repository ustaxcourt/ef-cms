const React = require('react');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  SERVED_PARTIES_CODES,
} = require('../../../entities/EntityConstants');
const { DocketRecord } = require('./DocketRecord.jsx');
const { mount } = require('enzyme');

describe('DocketRecord', () => {
  let caseDetail;
  let contactPrimary;
  let contactSecondary;
  let entries;
  let options;
  let privatePractitioner;
  let irsPractitioner;

  beforeEach(() => {
    options = {
      caseCaptionExtension: 'Petitioner(s)',
      caseTitle: 'Test Case Title',
      docketNumberWithSuffix: '123-45S',
      includePartyDetail: true,
    };

    contactPrimary = {
      address1: 'Address 1',
      address2: 'Address 2',
      address3: 'Address 3',
      city: 'City',
      country: 'USA',
      name: 'Test Petitioner',
      phone: '123-124-1234',
      postalCode: '12345',
      secondaryName: 'Secondary Name',
      state: 'AL',
    };

    contactSecondary = {
      address1: 'Address 1',
      address2: 'Address 2',
      address3: 'Address 3',
      city: 'City',
      country: 'USA',
      name: 'Test Petitioner 2',
      phone: '123-124-5678',
      postalCode: '12345',
      state: 'AL',
    };

    privatePractitioner = {
      barNumber: 'PT20001',
      contact: {
        address1: 'Address 1',
        address2: 'Address 2',
        address3: 'Address 3',
        city: 'City',
        country: 'USA',
        phone: '234-123-4567',
        postalCode: '12345',
        state: 'AL',
      },
      formattedName: 'Test Private Practitioner (PT20001)',
      name: 'Test Private Practitioner',
    };

    irsPractitioner = {
      barNumber: 'PT20002',
      contact: {
        address1: 'Address 1',
        address2: 'Address 2',
        address3: 'Address 3',
        city: 'City',
        country: 'USA',
        phone: '234-123-4567',
        postalCode: '12345',
        state: 'AL',
      },
      name: 'Test IRS Practitioner',
    };

    caseDetail = {
      contactPrimary,
      irsPractitioners: [],
      partyType: PARTY_TYPES.petitioner,
      privatePractitioners: [],
    };

    entries = [
      {
        action: 'Axun',
        additionalInfo2: 'Addl Info',
        createdAtFormatted: '01/01/20',
        descriptionDisplay: 'Test Description',
        eventCode: 'T',
        filedBy: 'Test Filer',
        filingsAndProceedings: 'Test Filings And Proceedings',
        index: 1,
        isNotServedDocument: false,
        isStatusServed: true,
        servedAtFormatted: '02/02/20',
        servedPartiesCode: SERVED_PARTIES_CODES.BOTH,
      },
    ];
  });

  it('renders the primary contact information when options.includePartyDetail is true', () => {
    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const contacts = wrapper.find('#petitioner-contacts');
    expect(contacts.find('.party-info-header').text()).toEqual(
      PARTY_TYPES.petitioner,
    );
    expect(contacts.find('.party-details').length).toEqual(1);

    const contactPrimaryEl = contacts.find('.party-details');

    expect(contactPrimaryEl.text()).toContain(contactPrimary.name);
    expect(contactPrimaryEl.text()).toContain(
      `c/o ${contactPrimary.secondaryName}`,
    );
    expect(contactPrimaryEl.text()).toContain(contactPrimary.address1);
    expect(contactPrimaryEl.text()).toContain(contactPrimary.address2);
    expect(contactPrimaryEl.text()).toContain(contactPrimary.address3);
    expect(contactPrimaryEl.text()).toContain(contactPrimary.city);
    expect(contactPrimaryEl.text()).toContain(contactPrimary.state);
    expect(contactPrimaryEl.text()).toContain(contactPrimary.postalCode);
    expect(contactPrimaryEl.text()).toContain(contactPrimary.phone);

    expect(contactPrimaryEl.text()).not.toContain(contactPrimary.country);
  });

  it('does not render the primary contact information when options.includePartyDetail is false', () => {
    options.includePartyDetail = false;

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const contacts = wrapper.find('#petitioner-contacts');
    expect(contacts).toEqual({});
  });

  it("displays a party's country if international", () => {
    contactPrimary.countryType = COUNTRY_TYPES.INTERNATIONAL;
    contactPrimary.country = 'The Republic of Texas';

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const contactPrimaryEl = wrapper.find(
      '#petitioner-contacts .party-details',
    );

    expect(contactPrimaryEl.text()).toContain('The Republic of Texas');
  });

  it('renders party info in care of if present', () => {
    contactPrimary.inCareOf = 'Test Care Of';
    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const contactPrimaryEl = wrapper
      .find('#petitioner-contacts')
      .find('.party-details')
      .at(0);

    expect(contactPrimaryEl.text()).toContain(`c/o ${contactPrimary.inCareOf}`);
  });

  it('renders private practitioner contact information when present and options.includePartyDetail is true', () => {
    options.includePartyDetail = true;
    caseDetail.privatePractitioners = []; // No private practitioners

    let wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    expect(wrapper.find('#private-practitioner-contacts').length).toEqual(0);

    caseDetail.privatePractitioners = [privatePractitioner];

    wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const contacts = wrapper.find('#private-practitioner-contacts');
    expect(contacts.find('.party-info-header').text()).toEqual(
      'Petitioner Counsel',
    );

    const contactEl = contacts.find('.party-details');

    expect(contactEl.text()).toContain(privatePractitioner.formattedName);
    expect(contactEl.text()).toContain(privatePractitioner.contact.address1);
    expect(contactEl.text()).toContain(privatePractitioner.contact.address2);
    expect(contactEl.text()).toContain(privatePractitioner.contact.address3);
    expect(contactEl.text()).toContain(privatePractitioner.contact.city);
    expect(contactEl.text()).toContain(privatePractitioner.contact.state);
    expect(contactEl.text()).toContain(privatePractitioner.contact.postalCode);
    expect(contactEl.text()).toContain(privatePractitioner.contact.phone);

    expect(contactEl.text()).not.toContain('Representing');
  });

  it('does not render private practitioner contact information when present and options.includePartyDetail is false', () => {
    options.includePartyDetail = false;
    caseDetail.privatePractitioners = [privatePractitioner];

    let wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    expect(wrapper.find('#private-practitioner-contacts')).toEqual({});
  });

  it('displays represented parties with each practitioner', () => {
    const privatePractitioner2 = {
      ...privatePractitioner,
      barNumber: 'PT20002',
      representingSecondary: true,
    };
    privatePractitioner.representingPrimary = true;
    caseDetail.privatePractitioners = [
      privatePractitioner,
      privatePractitioner2,
    ];
    caseDetail.contactSecondary = contactSecondary;

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const contacts = wrapper.find('#private-practitioner-contacts');
    expect(contacts.find('.party-info-header').text()).toEqual(
      'Petitioner Counsel',
    );

    expect(contacts.find('.party-details').length).toEqual(2);

    const practitioner1El = contacts.find('.party-details').at(0);
    const practitioner2El = contacts.find('.party-details').at(1);

    expect(practitioner1El.text()).toContain('Representing');
    expect(practitioner1El.text()).toContain(contactPrimary.name);

    expect(practitioner2El.text()).toContain('Representing');
    expect(practitioner2El.text()).toContain(contactSecondary.name);
  });

  it('renders irs practitioner contact information when present and options.includePartyDetail is true', () => {
    options.includePartyDetail = true;
    caseDetail.irsPractitioners = []; // No irs practitioners

    let wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    expect(wrapper.find('#irs-practitioner-contacts').length).toEqual(0);

    caseDetail.irsPractitioners = [irsPractitioner];

    wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const contacts = wrapper.find('#irs-practitioner-contacts');
    expect(contacts.find('.party-info-header').text()).toEqual(
      'Respondent Counsel',
    );

    const contactEl = contacts.find('.party-details');

    expect(contactEl.text()).toContain(irsPractitioner.name);
    expect(contactEl.text()).toContain(irsPractitioner.contact.address1);
    expect(contactEl.text()).toContain(irsPractitioner.contact.address2);
    expect(contactEl.text()).toContain(irsPractitioner.contact.address3);
    expect(contactEl.text()).toContain(irsPractitioner.contact.city);
    expect(contactEl.text()).toContain(irsPractitioner.contact.state);
    expect(contactEl.text()).toContain(irsPractitioner.contact.postalCode);
    expect(contactEl.text()).toContain(irsPractitioner.contact.phone);

    expect(contactEl.text()).not.toContain('Representing');
  });

  it('does not render irs practitioner contact information when present and options.includePartyDetail is false', () => {
    options.includePartyDetail = false;
    caseDetail.irsPractitioners = [irsPractitioner];

    let wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    expect(wrapper.find('#irs-practitioner-contacts')).toEqual({});
  });

  it('renders a table with docket record data', () => {
    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const docketRecord = wrapper.find('#documents');
    expect(docketRecord.find('tbody tr').length).toEqual(entries.length);

    const rowEl = docketRecord.find('tbody tr').at(0);

    expect(rowEl.text()).toContain(entries[0].index);
    expect(rowEl.text()).toContain(entries[0].createdAtFormatted);
    expect(rowEl.text()).toContain(entries[0].eventCode);
    expect(rowEl.text()).toContain(entries[0].descriptionDisplay);
    expect(rowEl.text()).toContain(entries[0].filingsAndProceedings);
    expect(rowEl.text()).toContain(entries[0].filedBy);
    expect(rowEl.text()).toContain(entries[0].action);
    expect(rowEl.text()).toContain(entries[0].servedAtFormatted);
    expect(rowEl.text()).toContain(entries[0].servedPartiesCode);
  });

  it('displays the record description, filingsAndProceedings, and additionalInfo2', () => {
    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    expect(wrapper.find('.filings-and-proceedings').at(0).text()).toEqual(
      `${entries[0].descriptionDisplay} ${entries[0].filingsAndProceedings} ${entries[0].additionalInfo2}`,
    );
  });

  it('displays only the record description if no filingsAndProceedings or additionalInfo2', () => {
    entries[0].additionalInfo2 = null;
    entries[0].filingsAndProceedings = null;

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    expect(wrapper.find('.filings-and-proceedings').at(0).text()).toEqual(
      entries[0].descriptionDisplay,
    );
  });

  it('displays the record description and filingsAndProceedings if no additionalInfo2', () => {
    entries[0].additionalInfo2 = null;

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    expect(wrapper.find('.filings-and-proceedings').at(0).text()).toEqual(
      `${entries[0].descriptionDisplay} ${entries[0].filingsAndProceedings}`,
    );
  });

  it('displays the record description and additionalInfo2 if no filingsAndProceedings', () => {
    entries[0].filingsAndProceedings = null;

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    expect(wrapper.find('.filings-and-proceedings').at(0).text()).toEqual(
      `${entries[0].descriptionDisplay} ${entries[0].additionalInfo2}`,
    );
  });

  it('displays `Not Served` in the served column if the document is an unserved court-issued document', () => {
    entries[0].isStatusServed = false;
    entries[0].isNotServedDocument = true;

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const documentRow = wrapper.find('#documents tbody tr').at(0);

    expect(documentRow.text()).toContain('Not served');

    expect(documentRow.text()).not.toContain(entries[0].servedAtFormatted);
  });
});
