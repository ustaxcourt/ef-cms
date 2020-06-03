const React = require('react');
const { mount, shallow } = require('enzyme');
const { PetitionService } = require('./PetitionService.jsx');

describe('PetitionService', () => {
  const caseDetail = {
    caseTitle: 'Test Case Title',
    docketNumber: '123-45',
    trialLocation: 'Birmingham, AL',
  };

  const contactPrimary = {
    address1: '123 Some St',
    address2: 'Unit B',
    city: 'Somecity',
    name: 'Test Petitioner',
    phone: '1234567890',
    postalCode: '12345',
    serviceIndicator: 'Electronic',
    state: 'ST',
  };

  const contactSecondary = {
    address1: '123 Some St',
    address2: 'Unit B',
    city: 'Somecity',
    name: 'Secondary Petitioner',
    postalCode: '12345',
    serviceIndicator: 'Paper',
    state: 'ST',
  };

  const docketEntryNumber = 1;

  const documentDetail = {
    documentId: '1234',
    documentTitle: 'Petition',
    eventCode: 'P',
    filingDate: '02/05/20',
    mailingDate: '02/02/20',
    servedAtFormatted: '02/03/2020 12:00am EST',
  };

  const practitioners = [
    {
      address1: '999 Legal Way',
      barNumber: 'OP20001',
      city: 'Somecity',
      email: 'practitioner.one@example.com',
      name: 'Practitioner One',
      phoneNumber: '123-123-1234',
      postalCode: '12345',
      representing: 'Test Petitioner',
      state: 'ST',
    },
    {
      address1: '543 Barrister Ct',
      barNumber: 'TP20001',
      city: 'Somecity',
      email: 'practitioner.one@example.com',
      name: 'Practitioner Two',
      phoneNumber: '123-123-4321',
      postalCode: '12345',
      representing: 'Secondary Petitioner',
      state: 'ST',
    },
  ];

  const taxCourtLoginUrl = 'http://example.com/login';

  it('renders case information', () => {
    const wrapper = shallow(
      <PetitionService
        caseDetail={caseDetail}
        contactPrimary={contactPrimary}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        practitioners={practitioners}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const caseInfo = wrapper.find('#case-information');

    expect(caseInfo.text()).toContain(caseDetail.docketNumber);
    expect(caseInfo.text()).toContain(caseDetail.caseTitle);
    expect(caseInfo.text()).toContain(caseDetail.trialLocation);
  });

  it('renders document information', () => {
    const wrapper = shallow(
      <PetitionService
        caseDetail={caseDetail}
        contactPrimary={contactPrimary}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        practitioners={practitioners}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const documentInfo = wrapper.find('#document-information');

    expect(documentInfo.text()).toContain(documentDetail.eventCode);
    expect(documentInfo.text()).toContain(documentDetail.documentTitle);
    expect(documentInfo.text()).toContain(
      `Docket Entry No.: ${docketEntryNumber}`,
    );
    expect(documentInfo.text()).toContain(documentDetail.filingDate);
    expect(documentInfo.text()).toContain(documentDetail.mailingDate);
    expect(documentInfo.text()).toContain(documentDetail.servedAtFormatted);
  });

  it('renders petitioner information', () => {
    const wrapper = mount(
      <PetitionService
        caseDetail={caseDetail}
        contactPrimary={contactPrimary}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        practitioners={practitioners}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const petitionerInfo = wrapper.find('#petitioner-information');

    expect(petitionerInfo.text()).toContain(contactPrimary.name);
    expect(petitionerInfo.text()).toContain(contactPrimary.address1);
    expect(petitionerInfo.text()).toContain(contactPrimary.address2);
    expect(petitionerInfo.text()).toContain(contactPrimary.city);
    expect(petitionerInfo.text()).toContain(contactPrimary.state);
    expect(petitionerInfo.text()).toContain(contactPrimary.postalCode);
    expect(petitionerInfo.text()).toContain(contactPrimary.phone);
    expect(petitionerInfo.text()).toContain(contactPrimary.serviceIndicator);

    expect(petitionerInfo.find('#contact-secondary').length).toEqual(0);
  });

  it('renders additional petitioner information if contactSecondary is provided and has at least a name', () => {
    const wrapper = mount(
      <PetitionService
        caseDetail={caseDetail}
        contactPrimary={contactPrimary}
        contactSecondary={contactSecondary}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        practitioners={practitioners}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const petitionerInfo = wrapper.find('#contact-secondary');

    expect(petitionerInfo.text()).toContain(contactSecondary.name);
    expect(petitionerInfo.text()).toContain(contactSecondary.address1);
    expect(petitionerInfo.text()).toContain(contactSecondary.address2);
    expect(petitionerInfo.text()).toContain(contactSecondary.city);
    expect(petitionerInfo.text()).toContain(contactSecondary.state);
    expect(petitionerInfo.text()).toContain(contactSecondary.postalCode);
    expect(petitionerInfo.text()).toContain(contactSecondary.serviceIndicator);
  });

  it('renders practitioner information', () => {
    const wrapper = mount(
      <PetitionService
        caseDetail={caseDetail}
        contactPrimary={contactPrimary}
        contactSecondary={contactSecondary}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        practitioners={practitioners}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const practitionerInfo = wrapper.find('#practitioner-information');

    expect(practitionerInfo.text()).toContain(practitioners[0].name);
    expect(practitionerInfo.text()).toContain(practitioners[0].address1);
    expect(practitionerInfo.text()).toContain(practitioners[0].city);
    expect(practitionerInfo.text()).toContain(practitioners[0].state);
    expect(practitionerInfo.text()).toContain(practitioners[0].postalCode);
    expect(practitionerInfo.text()).toContain(practitioners[0].phoneNumber);
    expect(practitionerInfo.text()).toContain(practitioners[0].email);
    expect(practitionerInfo.text()).toContain(
      `Representing: ${practitioners[0].representing}`,
    );

    expect(practitionerInfo.text()).toContain(practitioners[1].name);
    expect(practitionerInfo.text()).toContain(practitioners[1].address1);
    expect(practitionerInfo.text()).toContain(practitioners[1].city);
    expect(practitionerInfo.text()).toContain(practitioners[1].state);
    expect(practitionerInfo.text()).toContain(practitioners[1].postalCode);
    expect(practitionerInfo.text()).toContain(practitioners[1].phoneNumber);
    expect(practitionerInfo.text()).toContain(practitioners[1].email);
    expect(practitionerInfo.text()).toContain(
      `Representing: ${practitioners[1].representing}`,
    );
  });

  it('renders no practitioner information if there are no practitioners', () => {
    const wrapper = mount(
      <PetitionService
        caseDetail={caseDetail}
        contactPrimary={contactPrimary}
        contactSecondary={contactSecondary}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        practitioners={[]}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const practitionerInfo = wrapper.find('#practitioner-information');

    expect(practitionerInfo.length).toEqual(0);
  });

  it('renders computer-readable content', () => {
    const wrapper = shallow(
      <PetitionService
        caseDetail={caseDetail}
        contactPrimary={contactPrimary}
        contactSecondary={contactSecondary}
        docketEntryNumber={docketEntryNumber}
        documentDetail={documentDetail}
        practitioners={[]}
        taxCourtLoginUrl={taxCourtLoginUrl}
      />,
    );
    const irs = wrapper.find('#computer-readable');

    expect(irs.text()).toContain(caseDetail.docketNumber);
    expect(irs.text()).toContain(docketEntryNumber);
    expect(irs.text()).toContain(documentDetail.documentId);
    expect(irs.text()).toContain(documentDetail.eventCode);
  });
});
