Issue observed in: `judge-activity-report.cy.ts`

Specifically, in: `cypress/helpers/fileAPetition/create-and-serve-paper-petition.ts`

The code below expects these docket entries to be rendered in the exact same
order every time:

```ts
    cy.get('[data-testid="docket-entry-description-0"]').should(
    'have.text',
    'Notice of Attachments in the Nature of Evidence',
    );
    cy.get('[data-testid="docket-entry-description-1"]').should(
    'have.text',
    'Order',
    );
    cy.get('[data-testid="docket-entry-description-2"]').should(
    'have.text',
    'Order',
    );
    cy.get('[data-testid="docket-entry-description-3"]').should(
    'have.text',
    'Order to Show Cause',
    );
```

However, there is no guarantee that these docket entries will appear in the UI
in this exact order:

`web-client/src/views/DocketRecord/DraftDocumentViewer.tsx`
```ts
    <div className="document-viewer--documents-list">
    {formattedDocketEntries.formattedDraftDocuments.map(
        (draftDocument, idx) => (
        <Button
        ...
```

`web-client/src/presenter/computeds/formattedDocketEntries.ts`
```ts
// inside `formattedDocketEntries`
const result = formatCase(applicationContext, caseDetail, user);
// ...
result.formattedDraftDocuments = result.draftDocuments.map(draftDocument => {
    return {
    ...draftDocument,
    descriptionDisplay: draftDocument.documentTitle,
    showDocumentViewerLink: permissions.UPDATE_CASE,
    };
});
```

`shared/src/business/utilities/getFormattedCaseDetail.ts`
```ts
// inside `formatCase`
const result = cloneDeep(caseDetail);

if (result.docketEntries) {
    result.draftDocumentsUnsorted = result.docketEntries
        .filter(docketEntry => docketEntry.isDraft && !docketEntry.archived)
        .map(docketEntry => ({
            ...formatDocketEntry(applicationContext, docketEntry),
            editUrl: getEditUrl(docketEntry),
            signUrl: `/case-detail/${caseDetail.docketNumber}/edit-order/${docketEntry.docketEntryId}/sign`,
            signedAtFormatted: applicationContext
            .getUtilities()
            .formatDateString(docketEntry.signedAt, 'MMDDYY'),
            signedAtFormattedTZ: applicationContext
            .getUtilities()
            .formatDateString(docketEntry.signedAt, 'DATE_TIME_TZ'),
        }));

result.draftDocuments = sortBy(result.draftDocumentsUnsorted, 'receivedAt');
```

So, we know how `formattedDocketEntries.formattedDraftDocuments` is sorted.

Working backward: how was the case served?

`web-api/src/business/useCases/serveCaseToIrs/serveCaseToIrsInteractor.ts`
```ts
if (caseEntity.noticeOfAttachments) {
    const { noticeOfAttachmentsInNatureOfEvidence } =
    SYSTEM_GENERATED_DOCUMENT_TYPES;
    generatedDocuments.push(
    applicationContext
        .getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder({ // LOOK HERE
        applicationContext,
        authorizedUser,
        caseEntity,
        systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
        }),
    );
}
```

`web-api/src/business/useCaseHelper/addDocketEntryForSystemGeneratedOrder.ts`
```ts
// inside `addDocketEntryForSystemGeneratedOrder`
const newDocketEntry = new DocketEntry(
    {
    documentTitle: systemGeneratedDocument.documentTitle,
    documentType: systemGeneratedDocument.documentType,
    draftOrderState: {
        docketNumber: caseEntity.docketNumber,
        documentTitle: systemGeneratedDocument.documentTitle,
        documentType: systemGeneratedDocument.documentType,
        eventCode: systemGeneratedDocument.eventCode,
        ...(isNotice && { freeText: systemGeneratedDocument.documentTitle }),
    },
    eventCode: systemGeneratedDocument.eventCode,
    ...(isNotice && { freeText: systemGeneratedDocument.documentTitle }),
    isDraft: true,
    isFileAttached: true,
    },
    { authorizedUser },
);

newDocketEntry.setFiledBy(authorizedUser);

caseEntity.addDocketEntry(newDocketEntry);
```

`shared/src/business/entities/DocketEntry.ts`
```ts
// inside `DocketEntry` entity constructor
this.receivedAt = createISODateAtStartOfDayEST(rawDocketEntry.receivedAt);
```

`shared/src/business/utilities/DateHandler.ts`
```ts
export const createISODateAtStartOfDayEST = (dateString?: string): string => {
  const dtObj = dateString
    ? DateTime.fromISO(dateString, { zone: USTC_TZ })
    : DateTime.now().setZone(USTC_TZ); // LOOK HERE, no `dateString` argument was provided

  const iso = dtObj.startOf('day').setZone('utc').toISO();

  return iso!;
};
```

Following the breadcrumbs, we find that:

1. A `DocketEntry` entity's `receivedAt` property is an ISO string at the start
of the day the entity was constructed.
2. When `addDocketEntryForSystemGeneratedOrder` runs, it instantiates a new
`DocketEntry`.
3. `addDocketEntryForSystemGeneratedOrder` is invoked when `serveCaseToIrsInteractor`
is called.
4. `serveCaseToIrsInteractor` is called when a case is served to the IRS.
5. In `cypress/helpers/fileAPetition/create-and-serve-paper-petition.ts`, that
interactor is called when a button is clicked (line 127).

So, when the case created in this Cypress helper is served to the IRS, it calls
`Promise.all` on an array of `addDocketEntryForSystemGeneratedOrder` functions.
A new Docket Entry is instantiated for each one that needs to be created. Since
these were all created on the same date, the receivedAt property of the Docket
Entry will always be the output of `createISODateAtStartOfDayEST` when called
without an argument. Thus the receivedBy property is identical for all these
Docket Entries on this Case that was just served. Therefore, they are sorted
on a property that is identical across the board so who knows what appears in
what order.
