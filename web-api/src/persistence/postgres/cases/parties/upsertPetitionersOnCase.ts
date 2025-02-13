import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

// 10502 TODO: This currently requires ALL case petitioners to maintain order. That's dangerous. Maybe pass in case instead, which is slightly less terrible.
export const upsertPetitionersOnCase = async ({
  docketNumber,
  petitioners,
}: {
  docketNumber: string;
  petitioners: Petitioner[];
}) => {
  await pgInsertInto({
    table: 'dwPetitionerOnCase',
    values: petitioners.map((p, index) => ({
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
      hasConsentedToElectronicService: p.hasConsentedToElectronicService,
      hasElectronicAccess: p.hasElectronicAccess,
      inCareOf: p.inCareOf,
      isAddressSealed: p.isAddressSealed,
      name: p.name,
      paperPetitionEmail: p.paperPetitionEmail,
      phone: p.phone,
      placeOfLegalResidence: p.placeOfLegalResidence,
      postalCode: p.postalCode,
      sealedAndUnavailable: p.sealedAndUnavailable,
      secondaryName: p.secondaryName,
      serviceIndicator: p.serviceIndicator || SERVICE_INDICATOR_TYPES.SI_NONE,
      state: p.state,
      title: p.title,
      orderOnCase: index,
    })),
    onConflictColumns: ['docketNumber', 'contactId'],
  });
};
