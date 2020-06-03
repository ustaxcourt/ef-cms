const {
  updateSecondaryContactInteractor,
} = require('./updateSecondaryContactInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('updateSecondaryContactInteractor', () => {
  const mockContactSecondary = {
    address1: 'nothing',
    city: 'Somewhere',
    countryType: 'domestic',
    email: 'secondary@example.com',
    name: 'Secondary Party',
    phone: '9876543210',
    postalCode: '12345',
    state: 'TN',
  };
  let mockCase = {
    ...MOCK_CASE,
    contactSecondary: mockContactSecondary,
    partyType: 'Petitioner & spouse',
  };
  const fakeData =
    'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

  let mockUser = new User({
    name: 'bob',
    role: User.ROLES.petitioner,
    userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
  });

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(() => mockCase);

    applicationContext
      .getChromiumBrowser()
      .newPage()
      .pdf.mockReturnValue(fakeData);

    applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor.mockReturnValue(fakeData);
    applicationContext.getUseCases().userIsAssociated.mockReturnValue(true);

    applicationContext.getCurrentUser.mockReturnValue(mockUser);

    applicationContext.getUtilities().getAddressPhoneDiff.mockReturnValue({
      address1: {
        newData: 'new test',
        oldData: 'test',
      },
    });

    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue({
        eventCode: 'NCA',
        title: 'Notice of Change of Address',
      });
  });

  it('should update contactSecondary editable fields', async () => {
    const caseDetail = await updateSecondaryContactInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactInfo: {
        address1: '453 Electric Ave',
        city: 'Philadelphia',
        countryType: 'domestic',
        email: 'secondary@example.com',
        name: 'New Secondary',
        phone: '1234567890',
        postalCode: '99999',
        state: 'PA',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.contactSecondary,
    ).toMatchObject({
      address1: '453 Electric Ave',
      city: 'Philadelphia',
      countryType: 'domestic',
      email: mockContactSecondary.email,
      name: mockContactSecondary.name,
      phone: '1234567890',
      postalCode: '99999',
      state: 'PA',
    });
    expect(
      applicationContext.getTemplateGenerators()
        .generateChangeOfAddressTemplate,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().generatePdfFromHtmlInteractor,
    ).toHaveBeenCalled();
    expect(caseDetail.documents[4].servedAt).toBeDefined();
  });

  it('throws an error if the case was not found', async () => {
    mockCase = null;

    await expect(
      updateSecondaryContactInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        contactInfo: {},
      }),
    ).rejects.toThrow(
      'Case a805d1ab-18d0-43ec-bafb-654e83405416 was not found.',
    );
  });

  it('throws an error if the user making the request is not associated with the case', async () => {
    mockCase = {
      ...MOCK_CASE,
      userId: '123',
    };
    applicationContext.getUseCases().userIsAssociated.mockReturnValue(false);

    await expect(
      updateSecondaryContactInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        contactInfo: {},
      }),
    ).rejects.toThrow('Unauthorized for update case contact');
  });

  it('does not update the case if the contact information does not change', async () => {
    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue(undefined);

    await updateSecondaryContactInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactInfo: {
        // Matches current contact info
        address1: 'nothing',
        city: 'Somewhere',
        countryType: 'domestic',
        email: 'secondary@example.com',
        name: 'Secondary Party',
        phone: '9876543210',
        postalCode: '12345',
        state: 'TN',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getTemplateGenerators()
        .generateChangeOfAddressTemplate,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().generatePdfFromHtmlInteractor,
    ).not.toHaveBeenCalled();
  });

  it('does not update the contact secondary email or name', async () => {
    mockCase = {
      ...MOCK_CASE,
      contactSecondary: mockContactSecondary,
      partyType: 'Petitioner & spouse',
    };
    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue(undefined);

    const caseDetail = await updateSecondaryContactInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactInfo: {
        address1: 'nothing',
        city: 'Somewhere',
        countryType: 'domestic',
        email: 'hello123@example.com',
        name: 'Secondary Party Name Changed',
        phone: '9876543210',
        postalCode: '12345',
        state: 'TN',
      },
    });

    expect(caseDetail.contactSecondary.name).not.toBe(
      'Secondary Party Name Changed',
    );
    expect(caseDetail.contactSecondary.name).toBe(mockContactSecondary.name);
    expect(caseDetail.contactSecondary.email).not.toBe('hello123@example.com');
    expect(caseDetail.contactSecondary.email).toBe(mockContactSecondary.email);
  });
});
