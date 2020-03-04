const {
  calculateISODate,
  createISODateString,
} = require('../../utilities/DateHandler');
const {
  updateUserContactInformationInteractor,
} = require('./updateUserContactInformationInteractor');
const { Case } = require('../../entities/cases/Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

let user;

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

const contactInfo = {
  address1: '234 Main St',
  address2: 'Apartment 4',
  address3: 'Under the stairs',
  city: 'Chicago',
  country: 'Brazil',
  countryType: 'international',
  phone: '+1 (555) 555-5555',
  postalCode: '61234',
  state: 'IL',
};

let applicationContext;
const saveDocumentFromLambdaStub = jest.fn();
const sendServedPartiesEmailsStub = jest.fn();
let getCasesByUserStub;
const updateCaseSpy = jest.fn().mockImplementation(v => v.caseToUpdate);
const updateUserSpy = jest.fn();

describe('updateUserContactInformationInteractor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    user = MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];

    applicationContext = {
      environment: { stage: 'local' },
      getCaseCaptionNames: Case.getCaseCaptionNames,
      getCurrentUser: () => user,
      getPersistenceGateway: () => {
        return {
          getCasesByUser: getCasesByUserStub,
          getUserById: () => Promise.resolve(user),
          saveDocumentFromLambda: saveDocumentFromLambdaStub,
          saveWorkItemForNonPaper: () => null,
          updateCase: updateCaseSpy,
          updateUser: updateUserSpy,
        };
      },
      getTemplateGenerators: () => {
        return {
          generateChangeOfAddressTemplate: async () => '<div></div>',
          generateHTMLTemplateForPDF: () => '<div></div>',
          generatePrintableDocketRecordTemplate: async () => '<div></div>',
        };
      },
      getUniqueId: () => 'a7d90c05-f6cd-442c-a168-202db587f16f',
      getUseCaseHelpers: () => ({
        sendServedPartiesEmails: sendServedPartiesEmailsStub,
      }),
      getUseCases: () => ({
        generatePdfFromHtmlInteractor: () => fakeFile,
      }),
      getUtilities: () => ({
        formatDateString: () => '11/11/2011',
        getDocumentTypeForAddressChange: () => ({
          eventCode: 'NCA',
          title: 'Notice of Change of Address',
        }),
      }),
      logger: {
        time: () => null,
        timeEnd: () => null,
      },
    };
  });

  it("should throw an error when the user's contact information has not changed", async () => {
    getCasesByUserStub = jest.fn().mockResolvedValue([
      {
        ...MOCK_CASE,
        respondents: [
          {
            contact: {},
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          },
        ],
      },
    ]);

    await expect(
      updateUserContactInformationInteractor({
        applicationContext,
        contactInfo: {},
        userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
      }),
    ).rejects.toThrow('there were no changes found needing to be updated');
  });

  it('updates the user and respondents in the case', async () => {
    getCasesByUserStub = jest.fn().mockResolvedValue([
      {
        ...MOCK_CASE,
        respondents: [
          {
            contact: {},
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          },
        ],
      },
    ]);
    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });
    expect(sendServedPartiesEmailsStub).toHaveBeenCalled();
    expect(updateUserSpy).toHaveBeenCalled();

    expect(updateUserSpy.mock.calls[0][0].user).toMatchObject({
      contact: contactInfo,
    });
    expect(updateCaseSpy).toHaveBeenCalled();
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      respondents: [
        {
          contact: contactInfo,
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
    });
  });

  it('updates the user and practitioners in the case but does not update cases that have been closed for more than 6 months', async () => {
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
    getCasesByUserStub = jest.fn().mockResolvedValue([
      {
        ...MOCK_CASE,
        practitioners: [
          {
            contact: {},
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          },
        ],
      },
      {
        ...MOCK_CASE,
        closedDate: lastYear,
        practitioners: [
          {
            contact: {},
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          },
        ],
        status: Case.STATUS_TYPES.closed,
      },
      {
        ...MOCK_CASE,
        closedDate: yesterday,
        practitioners: [
          {
            contact: {},
            userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
          },
        ],
        status: Case.STATUS_TYPES.closed,
      },
    ]);

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });
    expect(updateUserSpy).toHaveBeenCalled();

    expect(updateUserSpy.mock.calls[0][0].user).toMatchObject({
      contact: contactInfo,
    });
    expect(updateCaseSpy).toHaveBeenCalled();
    expect(updateCaseSpy.mock.calls.length).toEqual(2);
    expect(updateCaseSpy.mock.calls[0][0].caseToUpdate).toMatchObject({
      practitioners: [
        {
          contact: contactInfo,
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
    });
    expect(updateCaseSpy.mock.calls[1][0].caseToUpdate).toMatchObject({
      practitioners: [
        {
          contact: contactInfo,
          userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
    });
  });

  it('returns unauthorized error when user not authorized', async () => {
    applicationContext.getCurrentUser = () => ({
      role: User.ROLES.petitionsClerk,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

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

    getCasesByUserStub = jest.fn().mockResolvedValue([
      {
        ...MOCK_CASE,
      },
    ]);

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: '330d4b65-620a-489d-8414-6623653ebc4f',
    });

    const updatedCase = updateCaseSpy.mock.calls[0][0].caseToUpdate;
    expect(
      updatedCase.documents[updatedCase.documents.length - 1],
    ).toMatchObject({
      additionalInfo: 'for Practitioner',
      documentTitle: 'Notice of Change of Address',
      filedBy: 'Counsel Practitioner',
    });
  });

  it('includes the respondent in the change of address document when the respondent changes their address', async () => {
    getCasesByUserStub = jest.fn().mockResolvedValue([
      {
        ...MOCK_CASE,
      },
    ]);

    await updateUserContactInformationInteractor({
      applicationContext,
      contactInfo,
      userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
    });

    const updatedCase = updateCaseSpy.mock.calls[0][0].caseToUpdate;
    expect(
      updatedCase.documents[updatedCase.documents.length - 1],
    ).toMatchObject({
      additionalInfo: 'for Respondent',
      documentTitle: 'Notice of Change of Address',
      filedBy: 'Resp.',
    });
  });
});
