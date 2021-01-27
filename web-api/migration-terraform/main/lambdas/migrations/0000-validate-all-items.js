const createApplicationContext = require('../../../../src/applicationContext');
const {
  Case,
} = require('../../../../../shared/src/business/entities/cases/Case');
const {
  CaseDeadline,
} = require('../../../../../shared/src/business/entities/CaseDeadline');
const {
  Correspondence,
} = require('../../../../../shared/src/business/entities/Correspondence');
const {
  DocketEntry,
} = require('../../../../../shared/src/business/entities/DocketEntry');
const {
  IrsPractitioner,
} = require('../../../../../shared/src/business/entities/IrsPractitioner');
const {
  Message,
} = require('../../../../../shared/src/business/entities/Message');
const {
  Practitioner,
} = require('../../../../../shared/src/business/entities/Practitioner');
const {
  PrivatePractitioner,
} = require('../../../../../shared/src/business/entities/PrivatePractitioner');
const {
  TrialSession,
} = require('../../../../../shared/src/business/entities/trialSessions/TrialSession');
const {
  TrialSessionWorkingCopy,
} = require('../../../../../shared/src/business/entities/trialSessions/TrialSessionWorkingCopy');
const {
  UserCase,
} = require('../../../../../shared/src/business/entities/UserCase');
const {
  UserCaseNote,
} = require('../../../../../shared/src/business/entities/notes/UserCaseNote');
const {
  WorkItem,
} = require('../../../../../shared/src/business/entities/WorkItem');
const { User } = require('../../../../../shared/src/business/entities/User');
const applicationContext = createApplicationContext({});

const migrateItems = items => {
  for (const item of items) {
    switch (item.entityName) {
      case 'Case':
        new Case(item, { applicationContext }).validate();
        break;
      case 'Correspondence':
        new Correspondence(item, { applicationContext }).validate();
        break;
      case 'CaseDeadline':
        new CaseDeadline(item, { applicationContext }).validate();
        break;
      case 'DocketEntry':
        new DocketEntry(item, { applicationContext }).validate();
        break;
      case 'Practitioner':
        new Practitioner(item, { applicationContext }).validate();
        break;
      case 'IrsPractitioner':
        new IrsPractitioner(item, { applicationContext }).validate();
        break;
      case 'PrivatePractitioner':
        new PrivatePractitioner(item, { applicationContext }).validate();
        break;
      case 'Message':
        new Message(item, { applicationContext }).validate();
        break;
      case 'TrialSession':
        new TrialSession(item, { applicationContext }).validate();
        break;
      case 'TrialSessionWorkingCopy':
        new TrialSessionWorkingCopy(item, { applicationContext }).validate();
        break;
      case 'User':
        new User(item, { applicationContext }).validate();
        break;
      case 'UserCase':
        new UserCase(item, { applicationContext }).validate();
        break;
      case 'UserCaseNote':
        new UserCaseNote(item, { applicationContext }).validate();
        break;
      case 'WorkItem':
        new WorkItem(item, { applicationContext }).validate();
        break;
      default:
        break;
    }
  }
  return items;
};

exports.migrateItems = migrateItems;
