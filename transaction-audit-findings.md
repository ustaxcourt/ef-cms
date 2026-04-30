# Transaction and `onTransactionCommit` Audit - Branch 10705-dxox (Updated Post-Pull)

**Date:** 2026-04-28
**Branch:** 10705-dxox (commit: b085e33fec)
**Base:** staging
**Status:** RE-AUDITED AFTER PULL

## Executive Summary - UPDATED

After pulling latest changes, the situation has **regressed**:

- ❌ **3 critical issues** - S3 I/O inside transactions (performance/lock issues)
- ⚠️ **1 medium issue** - Pre-transaction email risk
- ⚠️ **1 minor consistency opportunity**
- ✅ **18 interactors** correctly implemented

**Recent change (commit 97302339ab)**: "9915 - creating the pdf after the db transaction" actually moved S3 I/O **INTO** the transaction instead of deferring it with `onTransactionCommit`. This is a performance regression.

---

## ❌ CRITICAL: S3 I/O Inside Transactions

### 1. editPaperFilingInteractor.ts - serveDocketEntry - **NEW REGRESSION**

**Location:** Lines 301-344

**Problem:**
```typescript
await withTransaction(async () => {
  // Line 302: S3 read inside transaction
  const updatedDocketEntry = await updateDocketEntry({...});

  // Lines 311-319: More DB work
  for (const aCase of caseEntitiesToFileOn) {
    await fileAndServeDocumentOnOneCase({...});
  }

  // Lines 322-328: S3 READ + S3 WRITE + PDF manipulation inside transaction!
  const paperServiceResult = await applicationContext
    .getUseCaseHelpers()
    .serveDocumentAndGetPaperServicePdf({
      applicationContext,
      caseEntities: caseEntitiesToFileOn,
      docketEntryId: updatedDocketEntry.docketEntryId,
    });

  // Lines 332-343: Notification inside transaction
  await applicationContext.getNotificationGateway().sendNotificationToUser({...});
});
```

**What `serveDocumentAndGetPaperServicePdf` does (while holding DB locks):**
- Line 59-64: `getDocument` - **S3 READ**
- Lines 68-76: `appendPaperServiceAddressPageToPdf` - CPU-intensive PDF manipulation
- Lines 82-86: `saveFileAndGenerateUrl` - **S3 WRITE**
- Lines 43-47: `sendServedPartiesEmails` - properly deferred with `onTransactionCommit` ✓

**What changed:**
Previously (before commit 97302339ab), this code used `onTransactionCommit` to defer the S3/PDF work until after commit. Now it runs inside the transaction.

**Impact:**
- ❌ **Critical performance**: Holds DB transaction open during multiple S3 round-trips + PDF manipulation
- ❌ **Lock contention**: Transaction holds locks for 100ms-1000ms+ depending on S3 latency
- ❌ **Deadlock risk**: Long-running transactions increase deadlock probability
- ❌ **Throughput**: Blocks connection pool

**Recommendation:**
Revert to using `onTransactionCommit`:
```typescript
await withTransaction(async () => {
  const updatedDocketEntry = await updateDocketEntry({...});

  for (const aCase of caseEntitiesToFileOn) {
    await fileAndServeDocumentOnOneCase({...});
  }

  onTransactionCommit(async () => {
    const paperServiceResult = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({...});

    await applicationContext
      .getNotificationGateway()
      .sendNotificationToUser({...});
  });
});
```

**Priority:** CRITICAL - Immediate performance regression

---

### 2. editPaperFilingInteractor.ts - updateDocketEntry helper - **STILL PRESENT**

**Location:** Lines 460-467 (called from lines 152 and 302)

**Problem:**
```typescript
// Called INSIDE withTransaction at lines 152 and 302
const updateDocketEntry = async ({...}) => {
  // ...
  if (editableFields.isFileAttached) {
    updatedDocketEntryEntity.numberOfPages = await applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument({  // S3 READ INSIDE TRANSACTION!
        applicationContext,
        documentStorageId: docketEntry.documentStorageId,
      });
  }
  // ...
};
```

**Impact:**
- ❌ Holds DB locks during S3 read (PDF fetch + page count)

**Recommendation:**
Move `countPagesInDocument` calls BEFORE transactions:
```typescript
// BEFORE withTransaction
let numberOfPages: number | undefined;
if (documentMetadata.isFileAttached) {
  numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      documentStorageId: docketEntry.documentStorageId,
    });
}

await withTransaction(async () => {
  // Pass numberOfPages as a parameter, don't re-fetch
  const updatedDocketEntry = new DocketEntry({
    ...docketEntry,
    numberOfPages,  // Use pre-fetched value
    // ...
  });
});
```

**Priority:** HIGH

---

### 3. addPaperFilingInteractor.ts - Functional but not optimal

**Location:** Lines 126-206 (transaction), then 207-251 (post-transaction)

**Current Implementation:**
```typescript
await withTransaction(async () => {
  // DB work only - good!
});

// Lines 219-227: AFTER transaction - S3 + emails
const paperServiceResult = await applicationContext
  .getUseCaseHelpers()
  .serveDocumentAndGetPaperServicePdf({...});

// Lines 237-251: AFTER transaction - notification
await applicationContext.getNotificationGateway().sendNotificationToUser({...});
```

**Analysis:**
- ✅ **Functionally correct** - transaction re-throws, so post-work only runs on success
- ⚠️ **Not optimal** - Should use explicit `onTransactionCommit` for consistency

**Recommendation:**
```typescript
await withTransaction(async () => {
  // ... DB work ...

  onTransactionCommit(async () => {
    const paperServiceResult = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({...});

    await applicationContext
      .getNotificationGateway()
      .sendNotificationToUser({...});
  });
});
```

**Priority:** LOW (cosmetic consistency)

---

## ⚠️ Pre-Transaction Orphan Risk (Known Limitation)

### completeDocketEntryQCInteractor.ts - **Email risk**

**Location:** Lines 237-355 (before transaction at line 357)

**Problem:**
Pre-transaction work includes:
- Lines 237-283: S3 write + PDF manipulation (orphan risk if tx fails)
- Lines 284-355: More S3 writes + **`serveDocumentAndGetPaperServicePdf`** which sends emails

At lines 343-349, `serveDocumentAndGetPaperServicePdf` is called. This function (at lines 34-47 of serveDocumentAndGetPaperServicePdf.ts) calls `sendServedPartiesEmails`.

**Risk:**
If the transaction at lines 357-366 fails, emails have already been sent notifying parties about a docket entry that was never committed to the database.

**Impact:**
- ⚠️ **Medium**: Parties receive incorrect notifications
- ⚠️ S3 orphans (mitigated by temp bucket cleanup)

**Recommendation:**
Move all S3 writes and email operations inside transaction with `onTransactionCommit`, OR clearly document the risk + add monitoring.

**Priority:** MEDIUM

---

## ✅ Correctly Implemented Interactors

### Pure DB Work (No External I/O)

1. **archiveDraftDocumentInteractor.ts** ✅
2. **addConsolidatedCaseInteractor.ts** ✅
3. **removeConsolidatedCasesInteractor.ts** ✅
4. **createCaseDeadlineInteractor.ts** ✅
5. **deleteCaseDeadlineInteractor.ts** ✅
6. **updateCourtIssuedDocketEntryInteractor.ts** ✅
7. **removePetitionerEmailInteractor.ts** ✅
8. **saveCaseDetailInternalEditInteractor.ts** ✅
9. **createCaseInteractor.ts** ✅
10. **createCaseFromPaperInteractor.ts** ✅

### Correctly Using `onTransactionCommit`

11. **fileCourtIssuedOrderInteractor.ts** ✅
    - Correctly defers S3 writes with `onTransactionCommit`

12. **archiveCorrespondenceDocumentInteractor.ts** ✅
    - Correctly defers S3 deletes with `onTransactionCommit`

13. **fileExternalDocumentInteractor.ts** ✅
    - Correctly defers emails with `onTransactionCommit`
    - Page counting done before transaction (acceptable)

14. **fileCourtIssuedDocketEntryInteractor.ts** ✅
    - Pure DB work inside transaction
    - Page counting done before transaction (acceptable)

### Acceptable Pattern: S3 Reads BEFORE Transaction

15. **addPaperFilingInteractor.ts** - Page count before tx (lines 87-93) ✅
16. **fileExternalDocumentInteractor.ts** - Batch page count before tx (lines 145-162) ✅
17. **fileCourtIssuedDocketEntryInteractor.ts** - Page count before tx (line 76) ✅
18. **completeDocketEntryQCInteractor.ts** - Page count before tx (line 315) ✅

**Note:** S3 reads before transactions are acceptable because they don't hold DB locks during I/O.

---

## Summary Statistics - UPDATED

| Category | Count | Status |
|----------|-------|--------|
| Pure DB interactors | 10 | ✅ Correct |
| Correct `onTransactionCommit` usage | 4 | ✅ Correct |
| S3 reads before transaction (acceptable) | 4 | ✅ Acceptable |
| **S3 I/O INSIDE transaction** | **2** | **❌ CRITICAL** |
| **S3 + PDF work inside transaction (NEW)** | **1** | **❌ CRITICAL** |
| Pre-transaction email risk | 1 | ⚠️ Medium |
| Post-transaction consistency opportunities | 1 | ⚠️ Low |

---

## Recommendations - UPDATED

### Priority 1: CRITICAL - Fix Immediately ❌

#### 1a. **editPaperFilingInteractor.ts - serveDocketEntry** (lines 301-344)
**Revert commit 97302339ab behavior** - Move `serveDocumentAndGetPaperServicePdf` and `sendNotificationToUser` back into `onTransactionCommit`.

**Impact:** S3 I/O + PDF manipulation happening inside transaction
**Files:** `editPaperFilingInteractor.ts` lines 322-343

#### 1b. **editPaperFilingInteractor.ts - updateDocketEntry** (lines 460-467)
**Move `countPagesInDocument` outside** - Fetch page counts before calling `updateDocketEntry`.

**Impact:** S3 reads happening inside transaction
**Files:** `editPaperFilingInteractor.ts` lines 152, 302 (call sites), 460-467 (function body)

### Priority 2: MEDIUM - Address Soon ⚠️

#### **completeDocketEntryQCInteractor.ts** (lines 237-355)
Move S3 writes and emails inside `onTransactionCommit` OR document the risk.

**Impact:** Emails sent for uncommitted work

### Priority 3: LOW - Optional Consistency ⚠️

#### **addPaperFilingInteractor.ts** (lines 219-251)
Wrap post-transaction work in explicit `onTransactionCommit` for consistency.

---

## Regression Analysis

**Commit 97302339ab** ("9915 - creating the pdf after the db transaction") appears to have:
1. ❌ Moved S3/PDF work from `onTransactionCommit` to inside the transaction body
2. ❌ Kept `sendNotificationToUser` inside transaction
3. ✓ The helper `serveDocumentAndGetPaperServicePdf` does defer emails via `onTransactionCommit`

**Net effect:** Performance regression - S3 I/O now blocks database transactions.

---

## Conclusion - UPDATED

**BLOCKING ISSUES FOR MERGE:**

1. ❌ **editPaperFilingInteractor.ts** - S3 reads/writes + PDF manipulation inside transaction (CRITICAL)
2. ❌ **editPaperFilingInteractor.ts** - `countPagesInDocument` called inside transaction (HIGH)
3. ⚠️ **completeDocketEntryQCInteractor.ts** - Pre-transaction email risk (MEDIUM)

**Recent changes have introduced performance regressions that must be addressed.**
