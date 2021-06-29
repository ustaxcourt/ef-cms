const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
} = require('../../../../shared/src/business/entities/EntityConstants');
const {
  getFakeFile,
} = require('../../../../shared/src/business/test/getFakeFile');
const { asUserFromEmail } = require('../createUsers');

module.exports.createCase1 = async () => {
  let caseDetail;

  const docketNumber = await asUserFromEmail(
    'petitioner@example.com',
    async applicationContext => {
      const petitionFile = getFakeFile();
      const petitionFileId = applicationContext.getUniqueId();

      await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
        applicationContext,
        document: petitionFile,
        key: petitionFileId,
      });

      const stinFile = getFakeFile();
      const stinFileId = applicationContext.getUniqueId();

      await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
        applicationContext,
        document: stinFile,
        key: stinFileId,
      });

      caseDetail = await applicationContext
        .getUseCases()
        .createCaseInteractor(applicationContext, {
          petitionFileId,
          petitionMetadata: {
            caseType: CASE_TYPES_MAP.whistleblower,
            contactPrimary: {
              address1: '68 Fabien Freeway',
              address2: 'Suscipit animi solu',
              address3: 'Architecto assumenda',
              city: 'Aspernatur nostrum s',
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'petitioner@example.com',
              name: 'Brett Osborne',
              phone: '+1 (537) 235-6147',
              postalCode: '89499',
              state: 'AK',
            },
            filingType: 'Myself',
            hasIrsNotice: false,
            partyType: PARTY_TYPES.petitioner,
            preferredTrialCity: 'Birmingham, Alabama',
            procedureType: 'Regular',
          },
          stinFileId,
        });

      const addCoversheet = docketEntry => {
        return applicationContext
          .getUseCases()
          .addCoversheetInteractor(applicationContext, {
            docketEntryId: docketEntry.docketEntryId,
            docketNumber: caseDetail.docketNumber,
          });
      };

      const coversheets = [];

      for (const docketEntry of caseDetail.docketEntries) {
        if (!docketEntry.isMinuteEntry) {
          coversheets.push(addCoversheet(docketEntry));
        }
      }

      await Promise.all(coversheets);

      return caseDetail.docketNumber;
    },
  );

  return docketNumber;
};
