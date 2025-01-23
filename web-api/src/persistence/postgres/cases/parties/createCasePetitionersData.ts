import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { getDbWriter } from '@web-api/database';
import { getUniqueId } from '@shared/sharedAppContext';

export const createCasePetitionersData = async ({
  docketNumber,
  petitioners,
}: {
  docketNumber: string;
  petitioners: Petitioner[];
}): Promise<void> => {
  await getDbWriter(writer =>
    writer
      .insertInto('dwPetitionerOnCase')
      .values(
        petitioners.map((petitionerData, index) => ({
          additionalName: petitionerData.additionalName,
          address1: petitionerData.address1,
          address2: petitionerData.address2,
          address3: petitionerData.address3,
          city: petitionerData.city,
          contactId: petitionerData.contactId || getUniqueId(),
          contactType: petitionerData.contactType,
          country: petitionerData.country,
          countryType: petitionerData.countryType,
          docketNumber,
          email: petitionerData.email,
          hasConsentedToEService: petitionerData.hasConsentedToEService,
          hasEAccess: petitionerData.hasEAccess,
          inCareOf: petitionerData.inCareOf,
          isAddressSealed: petitionerData.isAddressSealed,
          name: petitionerData.name,
          paperPetitionEmail: petitionerData.paperPetitionEmail,
          phone: petitionerData.phone,
          placeOfLegalResidence: petitionerData.placeOfLegalResidence,
          postalCode: petitionerData.postalCode,
          sealedAndUnavailable: petitionerData.sealedAndUnavailable,
          secondaryName: petitionerData.secondaryName,
          serviceIndicator: petitionerData.serviceIndicator,
          state: petitionerData.state,
          title: petitionerData.title,
          orderOnCase: index,
        })),
      )
      .execute(),
  );
};
