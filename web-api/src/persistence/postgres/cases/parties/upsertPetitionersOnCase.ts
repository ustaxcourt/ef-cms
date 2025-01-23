import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { getDbWriter } from '@web-api/database';

export const upsertPetitionersOnCase = async ({
  docketNumber,
  petitioners,
}: {
  docketNumber: string;
  petitioners: Petitioner[];
}) => {
  await getDbWriter(writer =>
    writer
      .insertInto('dwPetitionerOnCase')
      .values(
        petitioners.map((p, index) => ({
          additionalName: p.additionalName,
          address1: p.address1,
          address2: p.address2,
          address3: p.address3,
          city: p.city,
          contactId: p.contactId!,
          contactType: p.contactType,
          country: p.country,
          countryType: p.countryType,
          docketNumber,
          email: p.email,
          hasConsentedToEService: p.hasConsentedToEService,
          hasEAccess: p.hasEAccess,
          inCareOf: p.inCareOf,
          isAddressSealed: p.isAddressSealed,
          name: p.name,
          paperPetitionEmail: p.paperPetitionEmail,
          phone: p.phone,
          placeOfLegalResidence: p.placeOfLegalResidence,
          postalCode: p.postalCode,
          sealedAndUnavailable: p.sealedAndUnavailable,
          secondaryName: p.secondaryName,
          serviceIndicator: p.serviceIndicator,
          state: p.state,
          title: p.title,
          orderOnCase: index,
        })),
      )
      .onConflict(oc =>
        oc.columns(['docketNumber', 'contactId']).doUpdateSet(p => {
          return {
            additionalName: p.ref('excluded.additionalName'),
            address1: p.ref('excluded.address1'),
            address2: p.ref('excluded.address2'),
            address3: p.ref('excluded.address3'),
            city: p.ref('excluded.city'),
            contactType: p.ref('excluded.contactType'),
            country: p.ref('excluded.country'),
            countryType: p.ref('excluded.countryType'),
            email: p.ref('excluded.email'),
            hasConsentedToEService: p.ref('excluded.hasConsentedToEService'),
            hasEAccess: p.ref('excluded.hasEAccess'),
            inCareOf: p.ref('excluded.inCareOf'),
            isAddressSealed: p.ref('excluded.isAddressSealed'),
            name: p.ref('excluded.name'),
            paperPetitionEmail: p.ref('excluded.paperPetitionEmail'),
            phone: p.ref('excluded.phone'),
            placeOfLegalResidence: p.ref('excluded.placeOfLegalResidence'),
            postalCode: p.ref('excluded.postalCode'),
            sealedAndUnavailable: p.ref('excluded.sealedAndUnavailable'),
            secondaryName: p.ref('excluded.secondaryName'),
            serviceIndicator: p.ref('excluded.serviceIndicator'),
            state: p.ref('excluded.state'),
            title: p.ref('excluded.title'),
          };
        }),
      )
      .execute(),
  );
};
