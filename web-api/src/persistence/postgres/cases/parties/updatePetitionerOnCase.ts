import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';
import { pgUpdateTable } from '@web-api/persistence/postgres/utils/operation/pgUpdateTable';

export const updatePetitionerOnCase = async ({
  docketNumber,
  petitioner,
  oldContactId,
}: {
  docketNumber: string;
  petitioner: Petitioner;
  oldContactId?: string;
}): Promise<Petitioner> => {
  const updatedPetitionerData = await pgUpdateTable({
    table: 'dwPetitionerOnCase',
    values: {
      additionalName: petitioner.additionalName,
      address1: petitioner.address1,
      address2: petitioner.address2,
      address3: petitioner.address3,
      city: petitioner.city,
      contactId: petitioner.contactId,
      contactType: petitioner.contactType,
      country: petitioner.country,
      countryType: petitioner.countryType,
      email: petitioner.email,
      hasConsentedToElectronicService:
        petitioner.hasConsentedToElectronicService,
      hasElectronicAccess: petitioner.hasElectronicAccess,
      inCareOf: petitioner.inCareOf,
      isAddressSealed: petitioner.isAddressSealed,
      name: petitioner.name,
      paperPetitionEmail: petitioner.paperPetitionEmail,
      phone: petitioner.phone,
      placeOfLegalResidence: petitioner.placeOfLegalResidence,
      postalCode: petitioner.postalCode,
      sealedAndUnavailable: petitioner.sealedAndUnavailable,
      secondaryName: petitioner.secondaryName,
      serviceIndicator:
        petitioner.serviceIndicator ?? SERVICE_INDICATOR_TYPES.SI_NONE,
      state: petitioner.state,
      title: petitioner.title,
    },
    where: cb =>
      cb
        .where('contactId', '=', oldContactId ?? petitioner.contactId!)
        .where('docketNumber', '=', docketNumber),
  });

  return new Petitioner(updatedPetitionerData);
};
