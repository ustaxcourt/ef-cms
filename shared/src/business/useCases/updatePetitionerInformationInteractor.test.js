const fs = require('fs');
const path = require('path');
const {
  createISODateString,
  formatDateString,
} = require('../utilities/DateHandler');
const {
  getDocumentTypeForAddressChange,
} = require('../utilities/generateChangeOfAddressTemplate');
const {
  updatePetitionerInformationInteractor,
} = require('./updatePetitionerInformationInteractor');
const { Case } = require('../entities/cases/Case');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { MOCK_CASE } = require('../../test/mockCase');
const { SERVICE_INDICATOR_TYPES } = require('../entities/cases/CaseConstants');
const { User } = require('../entities/User');

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const testAssetsPath = path.join(__dirname, '../../../test-assets/');

const testPdfDocBytes = () => {
  // sample.pdf is a 1 page document
  return new Uint8Array(
    new Uint8Array(fs.readFileSync(testAssetsPath + 'sample.pdf')),
  );
};

let testPdfDoc;

testPdfDoc = testPdfDocBytes();

const updateCaseStub = jest.fn();
const generateChangeOfAddressTemplateStub = jest.fn();
const generatePdfFromHtmlInteractorStub = jest.fn();
const getAddressPhoneDiffStub = jest.fn();
const saveDocumentFromLambdaStub = jest.fn();
const generatePaperServiceAddressPagePdfMock = jest
  .fn()
  .mockResolvedValue(testPdfDoc);
const sendServedPartiesEmailsMock = jest.fn();

let persistenceGateway = {
  getCaseByCaseId: () => MOCK_CASE,
  getDownloadPolicyUrl: () => ({
    url: 'https://www.example.com',
  }),
  saveDocumentFromLambda: saveDocumentFromLambdaStub,
  saveWorkItemForNonPaper: () => null,
  updateCase: updateCaseStub,
};

const useCases = {
  generatePdfFromHtmlInteractor: () => {
    generatePdfFromHtmlInteractorStub();
    return fakeData;
  },
  userIsAssociated: () => true,
};

const userData = {
  name: 'administrator',
  role: User.ROLES.docketClerk,
  userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
};
let userObj = userData;
const applicationContext = {
  environment: { stage: 'local' },
  getCaseTitle: Case.getCaseTitle,
  getChromiumBrowser: () => ({
    close: () => null,
    newPage: () => ({
      pdf: () => fakeData,
      setContent: () => null,
    }),
  }),
  getCurrentUser: () => {
    return new User(userObj);
  },
  getPersistenceGateway: () => {
    return persistenceGateway;
  },
  getTemplateGenerators: () => {
    return {
      generateChangeOfAddressTemplate: async () => {
        generateChangeOfAddressTemplateStub();
        return '<html></html>';
      },
    };
  },
  getUniqueId: () => 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
  getUseCaseHelpers: () => ({
    generatePaperServiceAddressPagePdf: generatePaperServiceAddressPagePdfMock,
    sendServedPartiesEmails: sendServedPartiesEmailsMock,
  }),
  getUseCases: () => useCases,
  getUtilities: () => {
    return {
      createISODateString,
      formatDateString,
      getAddressPhoneDiff: () => {
        getAddressPhoneDiffStub();
        return {
          address1: {
            newData: 'new test',
            oldData: 'old test',
          },
        };
      },
      getDocumentTypeForAddressChange,
    };
  },
  logger: {
    error: e => console.log(e),
    time: () => null,
    timeEnd: () => null,
  },
};

describe('update petitioner contact information on a case', () => {
  beforeEach(() => {
    userObj = userData;
  });

  it('updates case even if no change of address or phone is detected', async () => {
    await updatePetitionerInformationInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactPrimary: MOCK_CASE.contactPrimary,
      partyType: ContactFactory.PARTY_TYPES.petitioner,
    });
    expect(generateChangeOfAddressTemplateStub).not.toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorStub).not.toHaveBeenCalled();
    expect(updateCaseStub).toHaveBeenCalled();
  });

  it('throws an error if contactSecondary is required for the party type and is not valid', async () => {
    await expect(
      updatePetitionerInformationInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        contactPrimary: MOCK_CASE.contactPrimary,
        contactSecondary: { countryType: 'domestic' },
        partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
      }),
    ).rejects.toThrow();
    expect(generateChangeOfAddressTemplateStub).not.toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorStub).not.toHaveBeenCalled();
    expect(updateCaseStub).not.toHaveBeenCalled();
  });

  it('updates petitioner contact when primary contact info changes and serves the notice created', async () => {
    await updatePetitionerInformationInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactPrimary: {
        address1: '456 Center St', // the address changes ONLY
        city: 'Somewhere',
        countryType: 'domestic',
        email: 'test@example.com',
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
      partyType: ContactFactory.PARTY_TYPES.petitioner,
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(generateChangeOfAddressTemplateStub).toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorStub).toHaveBeenCalled();
    expect(sendServedPartiesEmailsMock).toHaveBeenCalled();
  });

  it('updates petitioner contact when secondary contact info changes and does not generate or serve a notice if the secondary contact was not previously present', async () => {
    await updatePetitionerInformationInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactPrimary: MOCK_CASE.contactPrimary,
      contactSecondary: {
        address1: '789 Division St',
        city: 'Somewhere',
        countryType: 'domestic',
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(generateChangeOfAddressTemplateStub).not.toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorStub).not.toHaveBeenCalled();
    expect(sendServedPartiesEmailsMock).not.toHaveBeenCalled();
  });

  it('updates petitioner contact when secondary contact info changes, serves the generated notice, and returns the download URL for the paper notice if the contactSecondary was previously on the case', async () => {
    persistenceGateway.getCaseByCaseId = () => ({
      ...MOCK_CASE,
      contactSecondary: {
        address1: '789 Division St',
        city: 'Somewhere',
        countryType: 'domestic',
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });

    const result = await updatePetitionerInformationInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactPrimary: MOCK_CASE.contactPrimary,
      contactSecondary: {
        address1: '789 Division St APT 123', //changed address1
        city: 'Somewhere',
        countryType: 'domestic',
        name: 'Test Petitioner',
        phone: '1234567',
        postalCode: '12345',
        state: 'TN',
        title: 'Executor',
      },
      partyType: ContactFactory.PARTY_TYPES.petitionerSpouse,
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(generateChangeOfAddressTemplateStub).toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorStub).toHaveBeenCalled();
    expect(sendServedPartiesEmailsMock).toHaveBeenCalled();
    expect(result.paperServicePdfUrl).toEqual('https://www.example.com');
  });

  it('does not serve a document or return a paperServicePdfUrl if only the serviceIndicator changes but not the address', async () => {
    const result = await updatePetitionerInformationInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactPrimary: {
        ...MOCK_CASE.contactPrimary,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
      partyType: ContactFactory.PARTY_TYPES.petitioner,
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(generateChangeOfAddressTemplateStub).not.toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorStub).not.toHaveBeenCalled();
    expect(sendServedPartiesEmailsMock).not.toHaveBeenCalled();
    expect(result.paperServicePdfUrl).toBeUndefined();
  });

  it('does not update contactPrimary email if it is passed in', async () => {
    await updatePetitionerInformationInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactPrimary: {
        ...MOCK_CASE.contactPrimary,
        email: 'test@example.com',
      },
      partyType: ContactFactory.PARTY_TYPES.petitioner,
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(
      updateCaseStub.mock.calls[0][0].caseToUpdate.contactPrimary.email,
    ).not.toBe('test@example.com');
  });

  it('throws an error when attempting to update contactPrimary.countryType to an invalid value', async () => {
    await expect(
      updatePetitionerInformationInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        contactPrimary: {
          ...MOCK_CASE.contactPrimary,
          countryType: 'alien',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
        partyType: ContactFactory.PARTY_TYPES.petitioner,
      }),
    ).rejects.toThrow('The Case entity was invalid');
    expect(updateCaseStub).not.toHaveBeenCalled();
  });

  it('throws an error if the user making the request does not have permission to edit petition details', async () => {
    persistenceGateway.getCaseByCaseId = async () => ({
      ...MOCK_CASE,
    });
    userObj.role = User.ROLES.petitioner;
    await expect(
      updatePetitionerInformationInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrow('Unauthorized for editing petition details');
  });
});
