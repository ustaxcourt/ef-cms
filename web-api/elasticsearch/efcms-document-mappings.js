module.exports = {
  properties: {
    'addToCoversheet.BOOL': {
      type: 'boolean',
    },
    'additionalInfo.S': {
      type: 'text',
    },
    'additionalInfo2.S': {
      type: 'text',
    },
    'archived.BOOL': {
      type: 'boolean',
    },
    'associatedJudge.S': {
      type: 'text',
    },
    'attachments.BOOL': {
      type: 'boolean',
    },
    'automaticBlocked.BOOL': {
      type: 'boolean',
    },
    'automaticBlockedDate.S': {
      type: 'date',
    },
    'automaticBlockedReason.S': {
      type: 'text',
    },
    'blocked.BOOL': {
      type: 'boolean',
    },
    'caseCaption.S': {
      type: 'text',
    },
    'caseType.S': {
      type: 'text',
    },
    'certificateOfService.BOOL': {
      type: 'boolean',
    },
    'certificateOfServiceDate.S': {
      type: 'date',
    },
    'closedDate.S': {
      type: 'date',
    },
    'contactPrimary.M.address1.S': {
      type: 'text',
    },
    'contactPrimary.M.address2.S': {
      type: 'text',
    },
    'contactPrimary.M.address3.S': {
      type: 'text',
    },
    'contactPrimary.M.city.S': {
      type: 'text',
    },
    'contactPrimary.M.contactId.S': {
      type: 'text',
    },
    'contactPrimary.M.countryType.S': {
      type: 'text',
    },
    'contactPrimary.M.email.S': {
      type: 'text',
    },
    'contactPrimary.M.inCareOf.S': {
      type: 'text',
    },
    'contactPrimary.M.name.S': {
      type: 'text',
    },
    'contactPrimary.M.phone.S': {
      type: 'text',
    },
    'contactPrimary.M.postalCode.S': {
      type: 'text',
    },
    'contactPrimary.M.secondaryName.S': {
      type: 'text',
    },
    'contactPrimary.M.serviceIndicator.S': {
      type: 'text',
    },
    'contactPrimary.M.state.S': {
      type: 'text',
    },
    'contactPrimary.M.title.S': {
      type: 'text',
    },
    'contactSecondary.M.address1.S': {
      type: 'text',
    },
    'contactSecondary.M.address2.S': {
      type: 'text',
    },
    'contactSecondary.M.address3.S': {
      type: 'text',
    },
    'contactSecondary.M.city.S': {
      type: 'text',
    },
    'contactSecondary.M.contactId.S': {
      type: 'text',
    },
    'contactSecondary.M.countryType.S': {
      type: 'text',
    },
    'contactSecondary.M.inCareOf.S': {
      type: 'text',
    },
    'contactSecondary.M.name.S': {
      type: 'text',
    },
    'contactSecondary.M.phone.S': {
      type: 'text',
    },
    'contactSecondary.M.postalCode.S': {
      type: 'text',
    },
    'contactSecondary.M.serviceIndicator.S': {
      type: 'text',
    },
    'contactSecondary.M.state.S': {
      type: 'text',
    },
    'correspondence.L.M.documentId.S': {
      type: 'text',
    },
    'correspondence.L.M.documentTitle.S': {
      type: 'text',
    },
    'correspondence.L.M.filedBy.S': {
      type: 'text',
    },
    'correspondence.L.M.filingDate.S': {
      type: 'date',
    },
    'correspondence.L.M.indexedTimestamp.N': {
      type: 'text',
    },
    'correspondence.L.M.pk.S': {
      type: 'text',
    },
    'correspondence.L.M.sk.S': {
      type: 'text',
    },
    'correspondence.L.M.userId.S': {
      type: 'text',
    },
    'createdAt.S': {
      type: 'date',
    },
    'damages.S': {
      type: 'text',
    },
    'date.S': {
      type: 'date',
    },
    'docketNumber.S': {
      type: 'text',
    },
    'docketNumberSuffix.S': {
      type: 'text',
    },
    'docketNumberWithSuffix.S': {
      type: 'text',
    },
    'documentContents.S': {
      analyzer: 'ustc_analyzer',
      type: 'text',
    },
    'documentContentsId.S': {
      type: 'text',
    },
    'documentId.S': {
      type: 'text',
    },
    'documentIdBeforeSignature.S': {
      type: 'text',
    },
    'documentTitle.S': {
      analyzer: 'ustc_analyzer',
      type: 'text',
    },
    'documentType.S': {
      type: 'text',
    },
    'entityName.S': {
      type: 'text',
    },
    'eventCode.S': {
      type: 'text',
    },
    'filedBy.S': {
      type: 'text',
    },
    'filingDate.S': {
      type: 'date',
    },
    'filingType.S': {
      type: 'text',
    },
    'freeText.S': {
      type: 'text',
    },
    'gsi1pk.S': {
      type: 'text',
    },
    'hasOtherFilingParty.BOOL': {
      type: 'boolean',
    },
    'hasPendingItems.BOOL': {
      type: 'boolean',
    },
    'hasSupportingDocuments.BOOL': {
      type: 'boolean',
    },
    'hasVerifiedIrsNotice.BOOL': {
      type: 'boolean',
    },
    'highPriority.BOOL': {
      type: 'boolean',
    },
    'indexedTimestamp.N': {
      type: 'text',
    },
    'initialCaption.S': {
      type: 'text',
    },
    'initialDocketNumberSuffix.S': {
      type: 'text',
    },
    'irsNoticeDate.S': {
      type: 'date',
    },
    'irsPractitioners.L.M.barNumber.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.contact.M.address1.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.contact.M.address2.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.contact.M.address3.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.contact.M.city.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.contact.M.countryType.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.contact.M.phone.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.contact.M.postalCode.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.contact.M.state.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.email.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.entityName.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.indexedTimestamp.N': {
      type: 'text',
    },
    'irsPractitioners.L.M.name.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.pk.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.role.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.section.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.serviceIndicator.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.sk.S': {
      type: 'text',
    },
    'irsPractitioners.L.M.userId.S': {
      type: 'text',
    },
    'isAutoGenerated.BOOL': {
      type: 'boolean',
    },
    'isDraft.BOOL': {
      type: 'boolean',
    },
    'isFileAttached.BOOL': {
      type: 'boolean',
    },
    'isPaper.BOOL': {
      type: 'boolean',
    },
    'isSealed.BOOL': {
      type: 'boolean',
    },
    'judge.S': {
      type: 'text',
    },
    'leadDocketNumber.S': {
      type: 'text',
    },
    'litigationCosts.S': {
      type: 'text',
    },
    'lodged.BOOL': {
      type: 'boolean',
    },
    'mailingDate.S': {
      type: 'text',
    },
    'noticeOfAttachments.BOOL': {
      type: 'boolean',
    },
    'noticeOfTrialDate.S': {
      type: 'date',
    },
    'numberOfPages.N': {
      type: 'text',
    },
    'objections.S': {
      type: 'text',
    },
    'orderDesignatingPlaceOfTrial.BOOL': {
      type: 'boolean',
    },
    'orderForAmendedPetition.BOOL': {
      type: 'boolean',
    },
    'orderForAmendedPetitionAndFilingFee.BOOL': {
      type: 'boolean',
    },
    'orderForFilingFee.BOOL': {
      type: 'boolean',
    },
    'orderForOds.BOOL': {
      type: 'boolean',
    },
    'orderForRatification.BOOL': {
      type: 'boolean',
    },
    'orderToChangeDesignatedPlaceOfTrial.BOOL': {
      type: 'boolean',
    },
    'orderToShowCause.BOOL': {
      type: 'boolean',
    },
    'ordinalValue.S': {
      type: 'text',
    },
    'otherFilers.L.M.address1.S': {
      type: 'text',
    },
    'otherFilers.L.M.address2.S': {
      type: 'text',
    },
    'otherFilers.L.M.city.S': {
      type: 'text',
    },
    'otherFilers.L.M.contactId.S': {
      type: 'text',
    },
    'otherFilers.L.M.countryType.S': {
      type: 'text',
    },
    'otherFilers.L.M.name.S': {
      type: 'text',
    },
    'otherFilers.L.M.otherFilerType.S': {
      type: 'text',
    },
    'otherFilers.L.M.phone.S': {
      type: 'text',
    },
    'otherFilers.L.M.postalCode.S': {
      type: 'text',
    },
    'otherFilers.L.M.state.S': {
      type: 'text',
    },
    'otherFilers.L.M.title.S': {
      type: 'text',
    },
    'otherFilingParty.S': {
      type: 'text',
    },
    'otherPetitioners.L.M.additionalName.S': {
      type: 'text',
    },
    'otherPetitioners.L.M.address1.S': {
      type: 'text',
    },
    'otherPetitioners.L.M.address2.S': {
      type: 'text',
    },
    'otherPetitioners.L.M.city.S': {
      type: 'text',
    },
    'otherPetitioners.L.M.contactId.S': {
      type: 'text',
    },
    'otherPetitioners.L.M.countryType.S': {
      type: 'text',
    },
    'otherPetitioners.L.M.name.S': {
      type: 'text',
    },
    'otherPetitioners.L.M.phone.S': {
      type: 'text',
    },
    'otherPetitioners.L.M.postalCode.S': {
      type: 'text',
    },
    'otherPetitioners.L.M.state.S': {
      type: 'text',
    },
    'otherPetitioners.L.M.title.S': {
      type: 'text',
    },
    'partyIrsPractitioner.BOOL': {
      type: 'boolean',
    },
    'partyPrimary.BOOL': {
      type: 'boolean',
    },
    'partySecondary.BOOL': {
      type: 'boolean',
    },
    'partyType.S': {
      type: 'text',
    },
    'pending.BOOL': {
      type: 'boolean',
    },
    'petitionPaymentDate.S': {
      type: 'date',
    },
    'petitionPaymentMethod.S': {
      type: 'text',
    },
    'petitionPaymentStatus.S': {
      type: 'text',
    },
    'petitionPaymentWaivedDate.S': {
      type: 'date',
    },
    'pk.S': {
      type: 'text',
    },
    'preferredTrialCity.S': {
      type: 'text',
    },
    'previousDocument.M.documentId.S': {
      type: 'text',
    },
    'previousDocument.M.documentTitle.S': {
      type: 'text',
    },
    'previousDocument.M.documentType.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.barNumber.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.contact.M.address1.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.contact.M.address2.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.contact.M.address3.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.contact.M.city.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.contact.M.countryType.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.contact.M.phone.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.contact.M.postalCode.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.contact.M.state.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.email.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.entityName.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.indexedTimestamp.N': {
      type: 'text',
    },
    'privatePractitioners.L.M.name.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.pk.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.representingPrimary.BOOL': {
      type: 'boolean',
    },
    'privatePractitioners.L.M.representingSecondary.BOOL': {
      type: 'boolean',
    },
    'privatePractitioners.L.M.role.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.section.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.serviceIndicator.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.sk.S': {
      type: 'text',
    },
    'privatePractitioners.L.M.userId.S': {
      type: 'text',
    },
    'procedureType.S': {
      type: 'text',
    },
    'processingStatus.S': {
      type: 'text',
    },
    'qcAt.S': {
      type: 'text',
    },
    'qcByUserId.S': {
      type: 'text',
    },
    'receivedAt.S': {
      type: 'date',
    },
    'relationship.S': {
      type: 'text',
    },
    'scenario.S': {
      type: 'text',
    },
    'secondaryDate.S': {
      type: 'date',
    },
    'secondaryDocument.M.attachments.BOOL': {
      type: 'boolean',
    },
    'secondaryDocument.M.category.S': {
      type: 'text',
    },
    'secondaryDocument.M.certificateOfServiceDate.S': {
      type: 'date',
    },
    'secondaryDocument.M.documentTitle.S': {
      type: 'text',
    },
    'secondaryDocument.M.documentType.S': {
      type: 'text',
    },
    'secondaryDocument.M.eventCode.S': {
      type: 'text',
    },
    'secondaryDocument.M.lodged.BOOL': {
      type: 'boolean',
    },
    'secondaryDocument.M.objections.S': {
      type: 'text',
    },
    'secondaryDocument.M.scenario.S': {
      type: 'text',
    },
    'servedAt.S': {
      type: 'date',
    },
    'servedParties.L.M.address1.S': {
      type: 'text',
    },
    'servedParties.L.M.address2.S': {
      type: 'text',
    },
    'servedParties.L.M.address3.S': {
      type: 'text',
    },
    'servedParties.L.M.city.S': {
      type: 'text',
    },
    'servedParties.L.M.contactId.S': {
      type: 'text',
    },
    'servedParties.L.M.countryType.S': {
      type: 'text',
    },
    'servedParties.L.M.email.S': {
      type: 'text',
    },
    'servedParties.L.M.inCareOf.S': {
      type: 'text',
    },
    'servedParties.L.M.name.S': {
      type: 'text',
    },
    'servedParties.L.M.phone.S': {
      type: 'text',
    },
    'servedParties.L.M.postalCode.S': {
      type: 'text',
    },
    'servedParties.L.M.role.S': {
      type: 'text',
    },
    'servedParties.L.M.secondaryName.S': {
      type: 'text',
    },
    'servedParties.L.M.serviceIndicator.S': {
      type: 'text',
    },
    'servedParties.L.M.state.S': {
      type: 'text',
    },
    'serviceDate.S': {
      type: 'date',
    },
    'serviceStamp.S': {
      type: 'text',
    },
    'signatedAt.S': {
      type: 'date',
    },
    'signedByUserId.S': {
      type: 'text',
    },
    'signedJudgeName.S': {
      type: 'text',
    },
    'sk.S': {
      type: 'text',
    },
    'sortableDocketNumber.N': {
      type: 'text',
    },
    'statistics.L.M.determinationDeficiencyAmount.S': {
      type: 'text',
    },
    'statistics.L.M.determinationTotalPenalties.S': {
      type: 'text',
    },
    'statistics.L.M.entityName.S': {
      type: 'text',
    },
    'statistics.L.M.irsDeficiencyAmount.S': {
      type: 'text',
    },
    'statistics.L.M.irsTotalPenalties.S': {
      type: 'text',
    },
    'statistics.L.M.lastDateOfPeriod.S': {
      type: 'date',
    },
    'statistics.L.M.statisticId.S': {
      type: 'text',
    },
    'statistics.L.M.year.S': {
      type: 'text',
    },
    'statistics.L.M.yearOrPeriod.S': {
      type: 'text',
    },
    'status.S': {
      type: 'text',
    },
    'supportingDocument.S': {
      type: 'text',
    },
    'trialDate.S': {
      type: 'date',
    },
    'trialLocation.S': {
      type: 'text',
    },
    'trialSessionId.S': {
      type: 'text',
    },
    'trialTime.S': {
      type: 'text',
    },
    'useSameAsPrimary.BOOL': {
      type: 'boolean',
    },
    'userId.S': {
      type: 'text',
    },
  },
};
