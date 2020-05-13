const React = require('react');
const { PetitionService } = require('./PetitionService.jsx');
const { shallow } = require('enzyme');

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
    postalCode: '12345',
    state: 'ST',
  };

  const contactSecondary = {
    address1: '123 Some St',
    address2: 'Unit B',
    city: 'Somecity',
    name: 'Secondary Petitioner',
    postalCode: '12345',
    state: 'ST',
  };

  const docketEntryNumber = 1;

  const documentDetail = {
    documentTitle: 'Petition',
    eventCode: 'P',
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
        contactSecondary={contactSecondary}
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
});
