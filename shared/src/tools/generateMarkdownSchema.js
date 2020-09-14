const fs = require('fs');
const json2yaml = require('json2yaml');
const {
  ContactFactory,
} = require('../business/entities/contacts/ContactFactory');
const {
  getNextFriendForIncompetentPersonContact,
} = require('../business/entities/contacts/NextFriendForIncompetentPersonContact');
const {
  getNextFriendForMinorContact,
} = require('../business/entities/contacts/NextFriendForMinorContact');
const {
  getOtherFilerContact,
} = require('../business/entities/contacts/OtherFilerContact');
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
  OrderWithoutBody,
} = require('../business/entities/orders/OrderWithoutBody');
const {
  PrivatePractitioner,
} = require('../business/entities/PrivatePractitioner');
const {
  TrialSession,
} = require('../business/entities/trialSessions/TrialSession');
const { Batch } = require('../business/entities/Batch');
const { Case } = require('../business/entities/cases/Case');
const { CaseDeadline } = require('../business/entities/CaseDeadline');
const { CaseExternal } = require('../business/entities/cases/CaseExternal');
const { CaseInternal } = require('../business/entities/cases/CaseInternal');
const { Correspondence } = require('../business/entities/Correspondence');
const { COUNTRY_TYPES } = require('../business/entities/EntityConstants');
const { DocketEntry } = require('../business/entities/DocketEntry');
const { IrsPractitioner } = require('../business/entities/IrsPractitioner');
const { Message } = require('../business/entities/Message');
const { NewMessage } = require('../business/entities/NewMessage');
const { NewPractitioner } = require('../business/entities/NewPractitioner');
const { Note } = require('../business/entities/notes/Note');
const { Order } = require('../business/entities/orders/Order');
const { PARTY_TYPES } = require('../business/entities/EntityConstants');
const { Practitioner } = require('../business/entities/Practitioner');
const { PublicCase } = require('../business/entities/cases/PublicCase');
const { PublicUser } = require('../business/entities/PublicUser');
const { Scan } = require('../business/entities/Scan');
const { Statistic } = require('../business/entities/Statistic');
const { User } = require('../business/entities/User');
const { UserCase } = require('../business/entities/UserCase');
const { UserCaseNote } = require('../business/entities/notes/UserCaseNote');
const { WorkItem } = require('../business/entities/WorkItem');

let contactMapping = '# Party Type Contact Type Mappings\n';

for (const partyType in PARTY_TYPES) {
  const constructors = ContactFactory.getContactConstructors({
    partyType: PARTY_TYPES[partyType],
  });

  contactMapping += `### ${partyType}\n\nPrimary contact: ${constructors.primary.contactName}\n\n`;
  if (constructors.secondary) {
    contactMapping += `Secondary contact: ${constructors.secondary.contactName}\n\n`;
  }
  if (constructors.otherFilers) {
    contactMapping += `Other filers contact: ${constructors.otherFilers.contactName}\n\n`;
  }
  if (constructors.otherPetitioners) {
    contactMapping += `Other petitioners contact: ${constructors.otherPetitioners.contactName}\n\n`;
  }
}

fs.writeFileSync('./docs/entities/ContactMapping.md', contactMapping);

const generateMarkdownSchema = (entity, entityName) => {
  const json = entity.getSchema().describe();

  fs.writeFileSync(
    `./docs/entities/${entityName}.md`,
    '# ' + entityName + '\n ```\n' + json2yaml.stringify(json) + '\n ```\n',
  );
};

generateMarkdownSchema(
  getNextFriendForIncompetentPersonContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/NextFriendForIncompetentPersonContact(DOMESTIC)',
);
generateMarkdownSchema(
  getNextFriendForIncompetentPersonContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/NextFriendForIncompetentPersonContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getNextFriendForMinorContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/NextFriendForMinorContact(DOMESTIC)',
);
generateMarkdownSchema(
  getNextFriendForMinorContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/NextFriendForMinorContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPartnershipAsTaxMattersPartnerPrimaryContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PartnershipAsTaxMattersPartnerContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPartnershipAsTaxMattersPartnerPrimaryContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PartnershipAsTaxMattersPartnerContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPartnershipBBAPrimaryContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PartnershipBBAPrimaryContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPartnershipBBAPrimaryContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PartnershipBBAPrimaryContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPartnershipOtherThanTaxMattersPrimaryContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PartnershipOtherThanTaxMattersPrimaryContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPartnershipOtherThanTaxMattersPrimaryContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PartnershipOtherThanTaxMattersPrimaryContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPetitionerConservatorContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerConservatorContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPetitionerConservatorContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PetitionerConservatorContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPetitionerCorporationContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerCorporationContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPetitionerCorporationContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PetitionerCorporationContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPetitionerCustodianContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerCustodianContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPetitionerCustodianContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PetitionerCustodianContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPetitionerDeceasedSpouseContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerDeceasedSpouseContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPetitionerDeceasedSpouseContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PetitionerDeceasedSpouseContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPetitionerEstateWithExecutorPrimaryContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerEstateWithExecutorPrimaryContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPetitionerEstateWithExecutorPrimaryContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PetitionerEstateWithExecutorPrimaryContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPetitionerGuardianContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerGuardianContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPetitionerGuardianContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PetitionerGuardianContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPetitionerIntermediaryContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerIntermediaryContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPetitionerIntermediaryContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PetitionerIntermediaryContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPetitionerPrimaryContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerPrimaryContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPetitionerPrimaryContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PetitionerPrimaryContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPetitionerSpouseContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerSpouseContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPetitionerSpouseContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PetitionerSpouseContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getPetitionerTrustContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/PetitionerTrustContact(DOMESTIC)',
);
generateMarkdownSchema(
  getPetitionerTrustContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/PetitionerTrustContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getSurvivingSpouseContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/SurvivingSpouseContact(DOMESTIC)',
);
generateMarkdownSchema(
  getSurvivingSpouseContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/SurvivingSpouseContact(INTERNATIONAL)',
);

generateMarkdownSchema(
  getOtherFilerContact({
    countryType: COUNTRY_TYPES.DOMESTIC,
    isPaper: true,
  }),
  'contacts/OtherFilerContact(DOMESTIC)',
);
generateMarkdownSchema(
  getOtherFilerContact({
    countryType: COUNTRY_TYPES.INTERNATIONAL,
    isPaper: true,
  }),
  'contacts/OtherFilerContact(INTERNATIONAL)',
);

generateMarkdownSchema(Batch, 'Batch');
generateMarkdownSchema(Case, 'Case');
generateMarkdownSchema(CaseDeadline, 'CaseDeadline');
generateMarkdownSchema(CaseExternal, 'CaseExternal');
generateMarkdownSchema(CaseInternal, 'CaseInternal');
generateMarkdownSchema(Message, 'Message');
generateMarkdownSchema(Correspondence, 'Correspondence');
generateMarkdownSchema(DocketEntry, 'DocketEntry');
generateMarkdownSchema(IrsPractitioner, 'IrsPractitioner');
generateMarkdownSchema(NewMessage, 'NewMessage');
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
generateMarkdownSchema(TrialSession, 'TrialSession');
generateMarkdownSchema(PublicCase, 'PublicCase');
