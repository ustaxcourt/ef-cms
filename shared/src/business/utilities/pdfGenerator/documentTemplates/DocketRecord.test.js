const React = require('react');
const {
  CONTACT_TYPES,
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
      additionalName: 'Additional name',
      address1: 'Address 1',
      address2: 'Address 2',
      address3: 'Address 3',
      city: 'City',
      contactId: '1f033442-2962-42cd-8fd8-a393dc754ae1',
      contactType: CONTACT_TYPES.primary,
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
      contactId: '04b71da8-a63e-44c2-ad3d-018b584210ee',
      contactType: CONTACT_TYPES.secondary,
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
      representingFormatted: [],
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
    expect(contacts.find('.party-info-header').text()).toEqual(
      PARTY_TYPES.petitioner,
    );
    expect(contacts.find('.party-details').length).toEqual(1);

    const contactPrimaryEl = contacts.find('.party-details').text();

    expect(contactPrimaryEl).toContain(contactPrimary.name);
    expect(contactPrimaryEl).toContain(`c/o ${contactPrimary.secondaryName}`);
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

  it('renders "Pro Se" when no private practitioner is given', () => {
    caseDetail.privatePractitioners = []; // No private practitioners

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    expect(wrapper.find('#private-practitioner-contacts').length).toEqual(1);

    const contacts = wrapper.find('#private-practitioner-contacts');
    expect(contacts.find('.party-info-content').text()).toEqual('Pro Se');
  });

  it('renders private practitioner contact info when present', () => {
    caseDetail.privatePractitioners = [privatePractitioner];

    const wrapper = mount(
      <DocketRecord
        caseDetail={caseDetail}
        countryTypes={COUNTRY_TYPES}
        entries={entries}
        options={options}
      />,
    );

    const contacts = wrapper.find('#private-practitioner-contacts');
    expect(contacts.length).toEqual(1);
    expect(contacts.find('.party-info-header').text()).toEqual(
      'Petitioner Counsel',
    );

    const contactEl = contacts.find('.party-details').text();

    expect(contactEl).toContain(privatePractitioner.formattedName);
    expect(contactEl).toContain(privatePractitioner.contact.address1);
    expect(contactEl).toContain(privatePractitioner.contact.address2);
    expect(contactEl).toContain(privatePractitioner.contact.address3);
    expect(contactEl).toContain(privatePractitioner.contact.city);
    expect(contactEl).toContain(privatePractitioner.contact.state);
    expect(contactEl).toContain(privatePractitioner.contact.postalCode);
    expect(contactEl).toContain(privatePractitioner.contact.phone);
    expect(contactEl).toContain('Representing');
  });

  it('displays represented parties with each practitioner', () => {
    const privatePractitioner2 = {
      ...privatePractitioner,
      barNumber: 'PT20002',
      representingFormatted: [{ name: contactSecondary.name }],
    };
    privatePractitioner.representingFormatted = [{ name: contactPrimary.name }];
    caseDetail.privatePractitioners = [
      privatePractitioner,
      privatePractitioner2,
    ];
    caseDetail.petitioners.push(contactSecondary);

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
    expect(contacts.find('.party-info-content').text()).toEqual('None');
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

    const contacts = wrapper.find('#irs-practitioner-contacts');
    expect(contacts.find('.party-info-header').text()).toEqual(
      'Respondent Counsel',
    );

    const contactEl = contacts.find('.party-details').text();

    expect(contactEl).toContain(irsPractitioner.name);
    expect(contactEl).toContain(irsPractitioner.contact.address1);
    expect(contactEl).toContain(irsPractitioner.contact.address2);
    expect(contactEl).toContain(irsPractitioner.contact.address3);
    expect(contactEl).toContain(irsPractitioner.contact.city);
    expect(contactEl).toContain(irsPractitioner.contact.state);
    expect(contactEl).toContain(irsPractitioner.contact.postalCode);
    expect(contactEl).toContain(irsPractitioner.contact.phone);

    expect(contactEl).not.toContain('Representing');
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
