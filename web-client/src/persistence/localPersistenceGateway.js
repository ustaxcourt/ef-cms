import User from '../entities/User';

const fakeCase = {
  caseId: 'f41d33b2-3127-4256-a63b-a6ea7181645b',
  createdAt: '2018-11-12T18:26:20.121Z',
  userId: 'taxpayer',
  docketNumber: '00107-18',
  documents: [
    {
      documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      createdAt: '2018-11-12T18:26:19.852Z',
      userId: { name: 'taxpayer' },
      documentType: 'petitionFile',
      type: 'petitionFile',
    },
    {
      documentId: '5f348cd1-ec42-4838-b58c-6fd3e8dbedb6',
      createdAt: '2018-11-12T18:26:19.897Z',
      userId: { name: 'taxpayer' },
      documentType: 'requestForPlaceOfTrial',
      type: 'requestForPlaceOfTrial',
    },
    {
      documentId: '0e0fadf0-1650-44e1-8c9e-bc19829219e7',
      createdAt: '2018-11-12T18:26:19.946Z',
      userId: { name: 'taxpayer' },
      documentType: 'statementOfTaxpayerIdentificationNumber',
      type: 'statementOfTaxpayerIdentificationNumber',
    },
  ],
  status: 'new',
};

const createCase = async function createCase() {
  return;
};

const uploadCasePdfs = async function uploadCasePdfs() {
  return {
    petitionFileId: 'a',
    requestForPlaceOfTrialId: 'b',
    statementOfTaxpayerIdentificationNumberId: 'c',
  };
};

const updateCase = async function updateCase() {
  return;
};

const getUser = userId => {
  if (userId === 'taxpayer') {
    return new User({
      userId: userId,
      role: 'taxpayer',
      firstName: 'Test',
      lastName: 'Taxpayer',
    });
  }
  if (userId === 'petitionsclerk') {
    return new User({
      userId: userId,
      role: 'petitionsclerk',
      firstName: 'Petitions',
      lastName: 'Clerk',
    });
  }
  return;
};

const getCases = () => {
  return [fakeCase];
};

const getPetitionsClerkCaseList = () => {
  return [fakeCase];
};

const getCaseDetail = () => {
  return fakeCase;
};

const localPersistenceGateway = {
  createCase,
  getCaseDetail,
  getCases,
  getPetitionsClerkCaseList,
  getUser,
  updateCase,
  uploadCasePdfs,
};

export default localPersistenceGateway;
