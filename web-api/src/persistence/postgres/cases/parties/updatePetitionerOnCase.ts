import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { getDbWriter } from '@web-api/database';

export const updatePetitionerOnCase = async ({
  docketNumber,
  petitioner,
}: {
  docketNumber: string;
  petitioner: Petitioner;
}): Promise<Petitioner> => {
  const updatedPetitionerData = await getDbWriter(writer =>
    writer
      .updateTable('dwPetitionerOnCase')
      .set({
        additionalName: petitioner.additionalName,
        address1: petitioner.address1,
        address2: petitioner.address2,
        address3: petitioner.address3,
        city: petitioner.city,
        contactType: petitioner.contactType,
        country: petitioner.country,
        countryType: petitioner.countryType,
        email: petitioner.email,
        hasConsentedToEService: petitioner.hasConsentedToEService,
        hasEAccess: petitioner.hasEAccess,
        inCareOf: petitioner.inCareOf,
        isAddressSealed: petitioner.isAddressSealed,
        name: petitioner.name,
        paperPetitionEmail: petitioner.paperPetitionEmail,
        phone: petitioner.phone,
        placeOfLegalResidence: petitioner.placeOfLegalResidence,
        postalCode: petitioner.postalCode,
        sealedAndUnavailable: petitioner.sealedAndUnavailable,
        secondaryName: petitioner.secondaryName,
        serviceIndicator: petitioner.serviceIndicator,
        state: petitioner.state,
        title: petitioner.title,
      })
      .where('contactId', '=', petitioner.contactId!)
      .where('docketNumber', '=', docketNumber)
      .returningAll()
      .executeTakeFirst(),
  );

  return new Petitioner(updatedPetitionerData);
};
