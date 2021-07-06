const React = require('react');
const {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  SERVED_PARTIES_CODES,
} = require('../../../entities/EntityConstants');
const { DocketRecord } = require('./DocketRecord.jsx');
const { mount } = require('enzyme');
const { v4: uuidv4 } = require('uuid');

describe('DocketRecord', () => {
  let caseDetail;
  let contactPrimary;
  let entries;
  let options;
  let irsPractitioner;

  beforeEach(() => {
    options = {
      caseCaptionExtension: 'Petitioner(s)',
      caseTitle: 'Test Case Title',
      docketNumberWithSuffix: '123-45S',
      includePartyDetail: true,
    };

    contactPrimary = {
      additionalName: 'Additional name',
      address1: 'Address 1',
      address2: 'Address 2',
      address3: 'Address 3',
      city: 'City',
      contactId: uuidv4(),
      contactType: CONTACT_TYPES.primary,
      counselDetails: [
        { email: 'jeff@example.com', name: 'Jeff Yu', phone: '867.5309' },
      ],
      country: 'USA',
      name: 'Test Petitioner',
      phone: '123-124-1234',
      postalCode: '12345',
      secondaryName: 'Secondary Name',
      state: 'AL',
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
      userId: uuidv4(),
    };

    caseDetail = {
      irsPractitioners: [],
      partyType: PARTY_TYPES.petitioner,
      petitioners: [contactPrimary],
      privatePractitioners: [{ representingFormatted: [] }],
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
    expect(contacts.find('.party-details').length).toEqual(1);

    const contactPrimaryEl = contacts.find('.party-details').text();

    expect(contactPrimaryEl).toContain(contactPrimary.name);
    expect(contactPrimaryEl).toContain(contactPrimary.additionalName);
    expect(contactPrimaryEl).toContain(contactPrimary.address1);
    expect(contactPrimaryEl).toContain(contactPrimary.address2);
    expect(contactPrimaryEl).toContain(contactPrimary.address3);
    expect(contactPrimaryEl).toContain(contactPrimary.city);
    expect(contactPrimaryEl).toContain(contactPrimary.state);
    expect(contactPrimaryEl).toContain(contactPrimary.postalCode);
    expect(contactPrimaryEl).toContain(contactPrimary.phone);

    expect(contactPrimaryEl).not.toContain(contactPrimary.country);
  });

  it('does not render petitioner contact information when options.includePartyDetail is false', () => {
    options.includePartyDetail = false;

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const contacts = wrapper.find('#petitioner-contacts .address-info');
    expect(contacts.length).toEqual(0);
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

  it('displays a stricken date and description fields for docket entries that are stricken', () => {
    entries[0].isStricken = true;

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const docketRecord = wrapper.find('#documents');
    expect(docketRecord.find('.stricken-docket-record').length).toEqual(2);
  });

  it('renders "None" when no private practitioner is given', () => {
    caseDetail.petitioners[0].counselDetails = [{ name: 'None' }]; // No private practitioners

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    expect(wrapper.find('.practitioner-contact').length).toEqual(1);

    const contacts = wrapper.find('.practitioner-contact');
    expect(contacts.text()).toEqual('None');
  });

  it('renders private practitioner contact info when present', () => {
    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const counselDetails = wrapper.find('.practitioner-contact');
    expect(counselDetails.length).toEqual(1);
    expect(counselDetails.text()).toContain('Jeff Yu', 'jeff@example.com');
  });

  it('renders "None" when no IRS practitioner is given', () => {
    caseDetail.irsPractitioners = []; // No irs practitioners

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    expect(wrapper.find('#irs-practitioner-contacts').length).toEqual(1);

    const contacts = wrapper.find('#irs-practitioner-contacts');
    expect(contacts.text()).toContain('None');
  });

  it('renders irs practitioner contact information when present', () => {
    caseDetail.irsPractitioners = [irsPractitioner];

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    expect(wrapper.find('#irs-practitioner-contacts').length).toEqual(1);

    const contacts = wrapper.find('#irs-practitioner-contacts');
    expect(contacts.text()).toContain(irsPractitioner.name);
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

    const rowEl = docketRecord.find('tbody tr').at(0).text();

    expect(rowEl).toContain(entries[0].index);
    expect(rowEl).toContain(entries[0].createdAtFormatted);
    expect(rowEl).toContain(entries[0].eventCode);
    expect(rowEl).toContain(entries[0].descriptionDisplay);
    expect(rowEl).toContain(entries[0].filingsAndProceedings);
    expect(rowEl).toContain(entries[0].filedBy);
    expect(rowEl).toContain(entries[0].action);
    expect(rowEl).toContain(entries[0].servedAtFormatted);
    expect(rowEl).toContain(entries[0].servedPartiesCode);
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
