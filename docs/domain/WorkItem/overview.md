# WorkItem Entity Overview

## What is a WorkItem?

A WorkItem tracks work that must be completed concerning a DocketEntry associated with a Case. WorkItems exist in service of the various inbox views to which internal DAWSON users have access.

## When is a WorkItem created?

These interactors in DAWSON's backend all instantiate WorkItems:

### 1. `createCaseInteractor`, `createCaseFromPaperInteractor`, and `addPaperFilingInteractor`

`createCaseInteractor` always instantiates a single new WorkItem. It requires `ROLE_PERMISSIONS.PETITION`.

Call stack:
- `saveAndSubmitCaseAction`
  - `filePetitionCompleteStep6Sequence`
    - `FilePetitionButtons.tsx`

`createCaseFromPaperInteractor` always instantiates a single new WorkItem. It requires `ROLE_PERMISSIONS.START_PAPER_CASE`.

Call stack:
- `createCaseFromPaperAction`
  - `submitPetitionFromPaperSequence`
    - `StartCaseInternal.tsx`

`addPaperFilingInteractor` always instantiates a new WorkItem *for each case in a consolidated group*. It requires `ROLE_PERMISSIONS.DOCKET_ENTRY`.

Call stack:
- `submitAddPaperFilingAction`
  - `submitPaperFilingSequence`
    - `PaperFiling.tsx`

### 2. `fileCourtIssuedDocketEntryInteractor` and `fileExternalDocumentInteractor`

`fileCourtIssuedDocketEntryInteractor` always instantiates a WorkItem *for each case in a consolidated group*. It requires either `ROLE_PERMISSIONS.DOCKET_ENTRY` or `ROLE_PERMISSIONS.CREATE_ORDER_DOCKET_ENTRY`.

Call stack:
- `submitCourtIssuedDocketEntryAction`
  - `submitCourtIssuedDocketEntrySequence`
    - `ConfirmInitiateSaveModal`
  - `saveCourtIssuedDocketEntrySequence`
    - `CourtIssuedDocketEntry.tsx`

- `submitCourtIssuedDocketEntryToConsolidatedGroupAction`
  - `submitCourtIssuedDocketEntrySequence`
    - `ConfirmInitiateSaveModal.tsx`

`fileExternalDocumentInteractor` always instantiates a WorkItem *for each case in a consolidated group*. It requires `ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT`.

Call stack:
`uploadExternalDocumentsInteractor`
  - `uploadExternalDocumentsAction`
    - `submitCaseAssociationRequestSequence`
      - `CaseAssociationRequestReview`
    - `submitExternalDocumentSequence`
      - `FileDocumentReview.tsx`

### 3. `assignWorkItemsInteractor` and `getWorkItemInteractor`

`assignWorkItemsInteractor` creates or updates a work item that is being assigned by the logged-in user to another user. it requires `ROLE_PERMISSIONS.ASSIGN_WORK_ITEM`.

- `assignSelectedWorkItemsAction`
  - `assignSelectedWorkItemsSequence`
    - `SectionWorkQueueInProgress.tsx`
    - `WorkQueueAssignments.tsx`
- `assignPetitionToAuthenticatedUserAction`
  - `submitPetitionFromPaperSequence`
    - `StartCaseInternal.tsx`

`getWorkItemInteractor` is wired up with a proxy and a lambda, but it does not appear to be called by any application code in the backend or any Cerebral-dependent code in the frontend. It is potentially dead code.

### 4. `saveCaseDetailInternalEditInteractor`

**If** the Case being updated is **not** a paper case, then the WorkItem associated with the petition docket entry receives the following updates:

- `assigneeId`: id of User whose interaction triggered the interactor
- `assigneeName`: as above
- `inProgress`: set to `true`

Call stack:
`saveCaseDetailInternalEditAction`
  - `saveSavedCaseForLaterSequence`
    - `CaseDetailEdit.tsx`

### 5. `updateContactInteractor`

When a petitioner updates a case they are associated with from the parties tab, a single new WorkItem is created **if** (1) the contact being edited is not represented by a practitioner for the case in question, **and** the case related to the contact being edited has any parties with paper service.

```typescript
// shared/src/business/useCases/updateContactInteractor.ts
const isContactRepresented = Case.isPetitionerRepresented(
    caseEntity,
    contactInfo.contactId,
);

const partyWithPaperService = caseEntity.hasPartyWithServiceType(
    SERVICE_INDICATOR_TYPES.SI_PAPER,
);
```

Call stack:
- `updateContactAction`
  - `submitEditContactSequence`
    - `ContactEdit.tsx`

### 6. `createChangeItems.generateAndServeDocketEntry`

This use case helper instantiates a new WorkItem when a DocketEntry is created **if**:

```typescript
const paperServiceRequested =
  partyWithPaperService ||
  user.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER;

let shouldCreateWorkItem;

if (
  user.role === ROLES.irsPractitioner ||
  user.role === ROLES.privatePractitioner
) {
  shouldCreateWorkItem = paperServiceRequested;
} else {
  if (paperServiceRequested || !privatePractitionersRepresentingContact) {
    shouldCreateWorkItem = true;
  }
}
```

Call stack:
- `generateChangeOfAddressHelper`
  - `generateChangeOfAddress.ts`
    - `updatePractitionerUserInteractor`
      - `updatePractitionerUserAction`
        - `submitUpdatePractitionerUserSequence`
          - `EditPractitionerUser.tsx`
    - `updateUserContactInformationInteractor`
      - `updateUserContactInformationAction`
        - `submitUpdateUserContactInformationSequence`
          - `UserContactEdit.tsx`
  - `web-api/src/lambdas/pdfGeneration/pdf-generation.ts`
- `updatePetitionerInformationInteractor`
  - `updatePetitionerInformationAction`
    - `submitUpdatePetitionerInformationSequence`
      - `submitEditPetitionerSequence`
        - `EditPetitionerInformationInternal.tsx`
      - `submitUpdatePetitionerInformationFromModalSequence`
        - `MatchingEmailFoundModal.tsx`
        - `NoMatchingEmailFoundModal.tsx`
- `updateAssociatedCaseWorker`

### 7. `setWorkItemAsReadInteractor`

`setWorkItemAsReadInteractor` updates a WorkItem by marking it as read. It requires `ROLE_PERMISSIONS.GET_READ_MESSAGES`.

Call stack:
- `setWorkItemAsReadAction`
  - `gotoDocketEntryQcSequence`
    - `'/case-detail/*/documents/*/edit..'` path in `router.ts`

## When is a WorkItem "complete"?

The `fileAndServeDocumentOnOneCase` use case helper always completes a WorkItem. It is called from a number of places in DAWSON.

Call stack:
- `fileAndServeCourtIssuedDocumentInteractor`
  - `fileAndServeCourtIssuedDocumentAction`
    - `fileAndServeCourtIssuedDocumentFromDocketEntrySequence`
      - `CourtIssuedDocketEntry.tsx`
- `serveCourtIssuedDocumentInteractor`
  - `serveCourtIssuedDocumentAction`
    - `fileAndServeCourtIssuedDocumentFromDocketEntrySequence`
      - `CourtIssuedDocketEntry.tsx`
    - `serveCourtIssuedDocumentSequence`
      - `DocumentViewerDocument.tsx`
      - `MessageDocument.tsx`
  - `fileAndServeCourtIssuedDocumentAction`
- `editPaperFilingInteractor`
  - `submitEditPaperFilingAction`
    - `submitPaperFilingSequence`
      - `PaperFiling.tsx`
- `serveExternallyFiledDocumentInteractor`
  - `servePaperFiledDocumentAction`
    - `servePaperFiledDocumentSequence`
      - `DocumentViewerDocument.tsx`
      - `MessageDocument.tsx`

`completeWorkItemInteractor` always completes a WorkItem.

Call stack:
- `completeWorkItemForDocumentSigningAction`
  - `saveDocumentSigningSequence`
    - `SignOrder.tsx`
