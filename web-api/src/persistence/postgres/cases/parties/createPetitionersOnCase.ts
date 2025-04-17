import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { getUniqueId } from '@shared/sharedAppContext';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const createPetitionersOnCase = async ({
  docketNumber,
  petitioners,
}: {
  docketNumber: string;
  petitioners: Petitioner[];
}): Promise<void> => {
  await pgInsertInto({
    table: 'dwPetitionerOnCase',
    values: petitioners.map((petitionerData, index) => ({
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
      hasConsentedToElectronicService:
        petitionerData.hasConsentedToElectronicService,
      hasElectronicAccess: petitionerData.hasElectronicAccess,
      inCareOf: petitionerData.inCareOf,
      isAddressSealed: petitionerData.isAddressSealed,
      name: petitionerData.name,
      paperPetitionEmail: petitionerData.paperPetitionEmail,
      phone: petitionerData.phone,
      placeOfLegalResidence: petitionerData.placeOfLegalResidence,
      postalCode: petitionerData.postalCode,
      sealedAndUnavailable: petitionerData.sealedAndUnavailable,
      secondaryName: petitionerData.secondaryName,
      serviceIndicator:
        petitionerData.serviceIndicator || SERVICE_INDICATOR_TYPES.SI_NONE,
      state: petitionerData.state,
      title: petitionerData.title,
      orderOnCase: index,
    })),
  });
};
