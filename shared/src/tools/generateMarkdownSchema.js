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
const { Batch } = require('../business/entities/Batch');
const { Case } = require('../business/entities/cases/Case');
const { CaseDeadline } = require('../business/entities/CaseDeadline');
const { Correspondence } = require('../business/entities/Correspondence');
const { DocketRecord } = require('../business/entities/DocketRecord');
const { Document } = require('../business/entities/Document');
const { ForwardMessage } = require('../business/entities/ForwardMessage');
const { Statistic } = require('../business/entities/Statistic');

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
generateMarkdownSchema(Correspondence, 'Correspondence');
generateMarkdownSchema(DocketRecord, 'DocketRecord');
generateMarkdownSchema(Document, 'Document');
generateMarkdownSchema(ForwardMessage, 'ForwardMessage');
generateMarkdownSchema(Statistic, 'Statistic');
