const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  calculateISODate,
  createISODateString,
} = require('../../utilities/DateHandler');
const {
  updateUserContactInformationInteractor,
} = require('./updateUserContactInformationInteractor');
const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');
const { COUNTRY_TYPES, ROLES } = require('../../entities/EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { UnauthorizedError } = require('../../../errors/errors');

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

let user;
let mockCase;

const contactInfo = {
  address1: '234 Main St',
  address2: 'Apartment 4',
  address3: 'Under the stairs',
  city: 'Chicago',
  country: 'Brazil',
  countryType: COUNTRY_TYPES.INTERNATIONAL,
  phone: '+1 (555) 555-5555',
  postalCode: '61234',
  state: 'IL',
};

const mockChromiumBrowser = {
  close: () => null,
  newPage: () => ({
    pdf: () => fakeData,
    setContent: () => null,
  }),
};

describe('updateUserContactInformationInteractor', () => {
  beforeEach(() => {
    user = MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];

    applicationContext.environment.stage = 'local';
    applicationContext.getChromiumBrowser.mockReturnValue(mockChromiumBrowser);
    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getCasesByUser.mockImplementation(async () => mockCase);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(async () => user);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(v => v.caseToUpdate);
    applicationContext.getUniqueId.mockReturnValue(
      'a7d90c05-f6cd-442c-a168-202db587f16f',
    );
    applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor.mockReturnValue(fakeData);
    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue({
        eventCode: 'NCA',
        title: 'Notice of Change of Address',
      });
  });

  it("should throw an error when the user's contact information has not changed", async () => {
    mockCase = [
      {
        ...MOCK_CASE,
        irsPractitioners: [
          {
            contact: {},
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          },
        ],
      },
    ];

    await expect(
      updateUserContactInformationInteractor({
        applicationContext,
        contactInfo: {},
        userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
      }),
    ).rejects.toThrow('there were no changes found needing to be updated');
  });

  it('updates the user and irsPractitioners in the case', async () => {
    mockCase = [
      {
        ...MOCK_CASE,
        irsPractitioners: [
          {
            contact: {},
            role: ROLES.irsPractitioner,
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          },
        ],
      },
    ];

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateUser,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      contact: contactInfo,
    });
    expect(
      applicationContext.getPersistenceGateway().updateUser,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      irsPractitioners: [
        {
          contact: contactInfo,
          role: ROLES.irsPractitioner,
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
    });
  });

  it('updates the user and privatePractitioners in the case but does not update cases that have been closed for more than 6 months', async () => {
    const lastYear = calculateISODate({
      dateString: createISODateString(),
      howMuch: -1,
      units: 'years',
    });
    const yesterday = calculateISODate({
      dateString: createISODateString(),
      howMuch: -1,
      units: 'days',
    });
    mockCase = [
      {
        ...MOCK_CASE,
        privatePractitioners: [
          {
            contact: {},
            role: ROLES.privatePractitioner,
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          },
        ],
      },
      {
        ...MOCK_CASE,
        closedDate: lastYear,
        privatePractitioners: [
          {
            contact: {},
            role: ROLES.privatePractitioner,
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          },
        ],
        status: CASE_STATUS_TYPES.closed,
      },
      {
        ...MOCK_CASE,
        closedDate: yesterday,
        privatePractitioners: [
          {
            contact: {},
            role: ROLES.privatePractitioner,
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          },
        ],
        status: CASE_STATUS_TYPES.closed,
      },
    ];

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    expect(
      applicationContext.getPersistenceGateway().updateUser,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      contact: contactInfo,
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls.length,
    ).toEqual(2);
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      privatePractitioners: [
        {
          contact: contactInfo,
          role: ROLES.privatePractitioner,
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[1][0]
        .caseToUpdate,
    ).toMatchObject({
      privatePractitioners: [
        {
          contact: contactInfo,
          role: ROLES.privatePractitioner,
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
    });
  });

  it('returns unauthorized error when user not authorized', async () => {
    user = {
      role: ROLES.petitionsClerk,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    };

    await expect(
      updateUserContactInformationInteractor({
        applicationContext,
        contactInfo,
        userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('returns unauthorized error when the user attempts to update a different user not owned by them', async () => {
    await expect(
      updateUserContactInformationInteractor({
        applicationContext,
        contactInfo,
        userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('includes the practitioner name in the change of address document when the practitioner changes their address', async () => {
    user = MOCK_USERS['330d4b65-620a-489d-8414-6623653ebc4f'];

    mockCase = [
      {
        ...MOCK_CASE,
      },
    ];

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: user.userId,
    });

    const updatedCase = applicationContext.getPersistenceGateway().updateCase
      .mock.calls[0][0].caseToUpdate;

    expect(
      updatedCase.documents[updatedCase.documents.length - 1],
    ).toMatchObject({
      additionalInfo: 'for Private Practitioner',
      documentTitle: 'Notice of Change of Address',
      filedBy: 'Counsel Private Practitioner',
    });
  });

  it('includes the irsPractitioner in the change of address document when the irsPractitioner changes their address', async () => {
    mockCase = [
      {
        ...MOCK_CASE,
      },
    ];

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    const updatedCase = applicationContext.getPersistenceGateway().updateCase
      .mock.calls[0][0].caseToUpdate;
    expect(
      updatedCase.documents[updatedCase.documents.length - 1],
    ).toMatchObject({
      additionalInfo: 'for IRS Practitioner',
      documentTitle: 'Notice of Change of Address',
      filedBy: 'Resp.',
    });
  });
});
