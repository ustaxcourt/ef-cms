import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { getDbWriter } from '@web-api/database';

export const updateCasePetitionerData = async ({
  docketNumber,
  petitionerData,
}: {
  docketNumber: string;
  petitionerData: Petitioner;
}): Promise<Petitioner> => {
  const updatedPetitionerData = await getDbWriter(writer =>
    writer
      .updateTable('dwPetitionerOnCase')
      .set({
        additionalName: petitionerData.additionalName,
        address1: petitionerData.address1,
        address2: petitionerData.address2,
        address3: petitionerData.address3,
        city: petitionerData.city,
        contactType: petitionerData.contactType,
        country: petitionerData.country,
        countryType: petitionerData.countryType,
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
        secondaryName: petitionerData.secondaryName, // how is this different from additional name?
        serviceIndicator: petitionerData.serviceIndicator,
        state: petitionerData.state,
        title: petitionerData.title,
      })
      .where('contactId', '=', petitionerData.contactId!) // 10502 TODO: Why is contactId optional?!
      .where('docketNumber', '=', docketNumber)
      .returningAll()
      .executeTakeFirst(),
  );

  return new Petitioner(updatedPetitionerData);
};
