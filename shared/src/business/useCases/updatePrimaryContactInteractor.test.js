const {
  updatePrimaryContactInteractor,
} = require('./updatePrimaryContactInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

import {
  createISODateString,
  formatDateString,
} from '../../../../shared/src/business/utilities/DateHandler';

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

const updateCaseStub = jest.fn();
const generateChangeOfAddressTemplateStub = jest.fn();
const generatePdfFromHtmlInteractorStub = jest.fn();
const getAddressPhoneDiffStub = jest.fn();
const getDocumentTypeForAddressChangeStub = jest.fn();
const saveDocumentStub = jest.fn();

let persistenceGateway = {
  getCaseByCaseId: () => MOCK_CASE,
  saveDocument: saveDocumentStub,
  saveWorkItemForNonPaper: () => null,
  updateCase: updateCaseStub,
};

const useCases = {
  generatePdfFromHtmlInteractor: () => {
    generatePdfFromHtmlInteractorStub();
    return fakeFile;
  },
  userIsAssociated: () => true,
};

const applicationContext = {
  environment: { stage: 'local' },
  getCurrentUser: () => {
    return new User({
      name: 'bob',
      role: User.ROLES.petitioner,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });
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
  getUseCases: () => useCases,
  getUtilities: () => {
    return {
      createISODateString,
      formatDateString,
      getAddressPhoneDiff: () => {
        getAddressPhoneDiffStub();
        return {
          address1: {
            newData: 'tset',
            oldData: 'test',
          },
        };
      },
      getDocumentTypeForAddressChange: () => {
        getDocumentTypeForAddressChangeStub();
        return {
          eventCode: 'NCA',
          title: 'Notice of Change of Address',
        };
      },
    };
  },
  logger: {
    time: () => null,
    timeEnd: () => null,
  },
};

describe('update primary contact on a case', () => {
  it('updates contactPrimary', async () => {
    await updatePrimaryContactInteractor({
      applicationContext,
      caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      contactInfo: {},
    });
    expect(updateCaseStub).toHaveBeenCalled();
    expect(generateChangeOfAddressTemplateStub).toHaveBeenCalled();
    expect(generatePdfFromHtmlInteractorStub).toHaveBeenCalled();
  });

  it('throws an error if the case was not found', async () => {
    persistenceGateway.getCaseByCaseId = async () => null;
    let error = null;
    try {
      await updatePrimaryContactInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        contactInfo: {},
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual(
      'Case a805d1ab-18d0-43ec-bafb-654e83405416 was not found.',
    );
  });

  it('throws an error if the user making the request is not associated with the case', async () => {
    persistenceGateway.getCaseByCaseId = async () => ({
      ...MOCK_CASE,
      userId: '123',
    });
    useCases.userIsAssociated = () => false;
    let error = null;
    try {
      await updatePrimaryContactInteractor({
        applicationContext,
        caseId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
        contactInfo: {},
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('Unauthorized for update case contact');
  });
});
