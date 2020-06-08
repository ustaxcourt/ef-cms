const fs = require('fs');
const json2yaml = require('json2yaml');
const {
  getNextFriendForIncompetentPersonContact,
} = require('../business/entities/contacts/NextFriendForIncompetentPersonContact');
const {
  getNextFriendForMinorContact,
} = require('../business/entities/contacts/NextFriendForMinorContact');
const {
  getPartnershipAsTaxMattersPartnerPrimaryContact,
} = require('../business/entities/contacts/PartnershipAsTaxMattersPartnerContact');
const {
  getPartnershipBBAPrimaryContact,
} = require('../business/entities/contacts/PartnershipBBAContact');
const {
  getPartnershipOtherThanTaxMattersPrimaryContact,
} = require('../business/entities/contacts/PartnershipOtherThanTaxMattersContact');
const {
  getPetitionerConservatorContact,
} = require('../business/entities/contacts/PetitionerConservatorContact');
const {
  getPetitionerCorporationContact,
} = require('../business/entities/contacts/PetitionerCorporationContact');
const {
  getPetitionerCustodianContact,
} = require('../business/entities/contacts/PetitionerCustodianContact');
const {
  getPetitionerDeceasedSpouseContact,
} = require('../business/entities/contacts/PetitionerDeceasedSpouseContact');
const {
  getPetitionerEstateWithExecutorPrimaryContact,
} = require('../business/entities/contacts/PetitionerEstateWithExecutorPrimaryContact');
const {
  getPetitionerGuardianContact,
} = require('../business/entities/contacts/PetitionerGuardianContact');
const {
  getPetitionerIntermediaryContact,
} = require('../business/entities/contacts/PetitionerIntermediaryContact');
const {
  getPetitionerPrimaryContact,
} = require('../business/entities/contacts/PetitionerPrimaryContact');
const {
  getPetitionerSpouseContact,
} = require('../business/entities/contacts/PetitionerSpouseContact');
const {
  getPetitionerTrustContact,
} = require('../business/entities/contacts/PetitionerTrustContact');
const {
  getSurvivingSpouseContact,
} = require('../business/entities/contacts/SurvivingSpouseContact');
const {
  InitialWorkItemMessage,
} = require('../business/entities/InitialWorkItemMessage');
const {
  OrderWithoutBody,
} = require('../business/entities/orders/OrderWithoutBody');
const {
  PrivatePractitioner,
} = require('../business/entities/PrivatePractitioner');
const { Batch } = require('../business/entities/Batch');
const { Case } = require('../business/entities/cases/Case');
const { CaseDeadline } = require('../business/entities/CaseDeadline');
const { CaseMessage } = require('../business/entities/CaseMessage');
const { Correspondence } = require('../business/entities/Correspondence');
const { DocketRecord } = require('../business/entities/DocketRecord');
const { Document } = require('../business/entities/Document');
const { ForwardMessage } = require('../business/entities/ForwardMessage');
const { IrsPractitioner } = require('../business/entities/IrsPractitioner');
const { Message } = require('../business/entities/Message');
const { NewCaseMessage } = require('../business/entities/NewCaseMessage');
const { NewPractitioner } = require('../business/entities/NewPractitioner');
const { Note } = require('../business/entities/notes/Note');
const { Order } = require('../business/entities/orders/Order');
const { Practitioner } = require('../business/entities/Practitioner');
const { PublicUser } = require('../business/entities/PublicUser');
const { Scan } = require('../business/entities/Scan');
const { Statistic } = require('../business/entities/Statistic');
const { User } = require('../business/entities/User');
const { UserCase } = require('../business/entities/UserCase');
const { UserCaseNote } = require('../business/entities/notes/UserCaseNote');
const { WorkItem } = require('../business/entities/WorkItem');

const generateMarkdownSchema = (entity, entityName) => {
  const json = entity.getSchema().describe();

  fs.writeFileSync(
    `./docs/entities/${entityName}.md`,
    '# ' + entityName + '\n ```\n' + json2yaml.stringify(json) + '\n ```\n',
  );
};

generateMarkdownSchema(
  getNextFriendForIncompetentPersonContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/NextFriendForIncompetentPersonContact',
);

generateMarkdownSchema(
  getNextFriendForMinorContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/NextFriendForMinorContact',
);

generateMarkdownSchema(
  getPartnershipAsTaxMattersPartnerPrimaryContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PartnershipAsTaxMattersPartnerContact',
);

generateMarkdownSchema(
  getPartnershipBBAPrimaryContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PartnershipBBAPrimaryContact',
);

generateMarkdownSchema(
  getPartnershipOtherThanTaxMattersPrimaryContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PartnershipOtherThanTaxMattersPrimaryContact',
);

generateMarkdownSchema(
  getPetitionerConservatorContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PetitionerConservatorContact',
);

generateMarkdownSchema(
  getPetitionerCorporationContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PetitionerCorporationContact',
);

generateMarkdownSchema(
  getPetitionerCustodianContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PetitionerCustodianContact',
);

generateMarkdownSchema(
  getPetitionerDeceasedSpouseContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PetitionerDeceasedSpouseContact',
);

generateMarkdownSchema(
  getPetitionerEstateWithExecutorPrimaryContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PetitionerEstateWithExecutorPrimaryContact',
);

generateMarkdownSchema(
  getPetitionerGuardianContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PetitionerGuardianContact',
);

generateMarkdownSchema(
  getPetitionerIntermediaryContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PetitionerIntermediaryContact',
);

generateMarkdownSchema(
  getPetitionerPrimaryContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PetitionerPrimaryContact',
);

generateMarkdownSchema(
  getPetitionerSpouseContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PetitionerSpouseContact',
);

generateMarkdownSchema(
  getPetitionerTrustContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/PetitionerTrustContact',
);

generateMarkdownSchema(
  getSurvivingSpouseContact({
    countryType: 'domestic',
    isPaper: true,
  }),
  'contacts/SurvivingSpouseContact',
);

generateMarkdownSchema(Batch, 'Batch');
generateMarkdownSchema(Case, 'Case');
generateMarkdownSchema(CaseDeadline, 'CaseDeadline');
generateMarkdownSchema(CaseMessage, 'CaseMessage');
generateMarkdownSchema(Correspondence, 'Correspondence');
generateMarkdownSchema(DocketRecord, 'DocketRecord');
generateMarkdownSchema(Document, 'Document');
generateMarkdownSchema(ForwardMessage, 'ForwardMessage');
generateMarkdownSchema(InitialWorkItemMessage, 'InitialWorkItemMessage');
generateMarkdownSchema(IrsPractitioner, 'IrsPractitioner');
generateMarkdownSchema(Message, 'Message');
generateMarkdownSchema(NewCaseMessage, 'NewCaseMessage');
generateMarkdownSchema(NewPractitioner, 'NewPractitioner');
generateMarkdownSchema(Note, 'Note');
generateMarkdownSchema(Order, 'Order');
generateMarkdownSchema(OrderWithoutBody, 'OrderWithoutBody');
generateMarkdownSchema(Practitioner, 'Practitioner');
generateMarkdownSchema(PrivatePractitioner, 'PrivatePractitioner');
generateMarkdownSchema(PublicUser, 'PublicUser');
generateMarkdownSchema(Scan, 'Scan');
generateMarkdownSchema(Statistic, 'Statistic');
generateMarkdownSchema(User, 'User');
generateMarkdownSchema(UserCase, 'UserCase');
generateMarkdownSchema(UserCaseNote, 'UserCaseNote');
generateMarkdownSchema(WorkItem, 'WorkItem');
