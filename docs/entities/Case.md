# Case

### associatedJudge


Judge assigned to this Case. Defaults to Chief Judge.

> `string` | required

### automaticBlocked


Temporarily blocked from trial due to a pending item or due date.

> `boolean` | optional

### automaticBlockedDate

> `any`


If `automaticBlocked` = `true`, then this field is `date` and is `required.` 


Otherwise, this field is `any` and is `optional`. `null` is allowed.

### automaticBlockedReason

> `any`


If `automaticBlocked` = `true`, then this field is `string` and is `required.` 


Otherwise, this field is `any` and is `optional`. `null` is allowed.

### blocked


Temporarily blocked from trial.

> `boolean` | optional

### blockedDate

> `any`


If `blocked` = `true`, then this field is `date` and is `required.` 


Otherwise, this field is `any` and is `optional`. `null` is allowed.

### blockedReason

> `any`


If `blocked` = `true`, then this field is `string` and is `required.` 


Otherwise, this field is `any` and is `optional`. `null` is allowed.

### caseCaption


The name of the party bringing the case, e.g. "Carol Williams, Petitioner," "Mark Taylor, Incompetent, Debra Thomas, Next Friend, Petitioner," or "Estate of Test Taxpayer, Deceased, Petitioner." This is the first half of the case title.

> `string` | required

### caseId


Unique Case ID only used by the system.

> `string` | required

### caseNote

> `string` | optional

### caseType

> `string` | required

##### Allowed Values


 - `Deficiency`
 - `CDP (Lien/Levy)`
 - `Innocent Spouse`
 - `Partnership (Section 6226)`
 - `Partnership (Section 6228)`
 - `Partnership (BBA Section 1101)`
 - `Whistleblower`
 - `Worker Classification`
 - `Declaratory Judgment (Retirement Plan)`
 - `Declaratory Judgment (Exempt Organization)`
 - `Passport`
 - `Interest Abatement`
 - `Other`

### contactPrimary

> `object` | required

### contactSecondary

> `object` | optional

##### Can be null.

### createdAt


When the Case was added to the system.

> `date` | required

### docketNumber


Unique Case ID in XXXXX-YY format.

> `string` | required

##### Regex Pattern


`/^(\d{3,5}-\d{2})$/`

### docketNumberSuffix

> `string` | optional

##### Allowed Values


 - `null`
 - `W`
 - `P`
 - `X`
 - `R`
 - `SL`
 - `L`
 - `S`

### docketRecord


List of DocketRecord Entities for the Case.

> `array` | required


An array of [`DocketRecord`](./DocketRecord.md)s

#### Rules


At least `1` item(s) must be selected.

### documents


List of Document Entities for the Case.

> `array` | required


An array of [`Document`](./Document.md)s

#### Rules


At least `1` item(s) must be selected.

### filingType

> `string` | optional

##### Allowed Values


 - `Myself`
 - `Myself and my spouse`
 - `A business`
 - `Other`
 - `Individual petitioner`
 - `Petitioner and spouse`

### hasIrsNotice

> `boolean` | optional

### hasVerifiedIrsNotice

> `boolean` | optional

##### Can be null.

### highPriority

> `boolean` | optional

### highPriorityReason

> `any`


If `highPriority` = `true`, then this field is `string` and is `required.` 


Otherwise, this field is `any` and is `optional`. `null` is allowed.

### initialDocketNumberSuffix

> `string` | optional

##### Can be null.

### initialTitle

> `string` | optional

##### Can be null.

### irsNoticeDate


Last date that the Petitioner is allowed to file before.

> `date` | optional

##### Can be null.

### irsSendDate


When the Case was sent to the IRS by the Court.

> `date` | optional

### isPaper

> `boolean` | optional

### leadCaseId


If this Case is consolidated, this is the ID of the lead Case. It is the lowest Docket Number in the consolidated group.

> `string` | optional

### mailingDate

> `any`


If `isPaper` = `true`, then this field is `string` and is `required.` 


Otherwise, this field is `string` and is `optional`. `null` is allowed.

### noticeOfAttachments

> `boolean` | optional

### noticeOfTrialDate

> `date` | optional

### orderForAmendedPetition

> `boolean` | optional

### orderForAmendedPetitionAndFilingFee

> `boolean` | optional

### orderForFilingFee

> `boolean` | optional

### orderForOds

> `boolean` | optional

### orderForRatification

> `boolean` | optional

### orderToChangeDesignatedPlaceOfTrial

> `boolean` | optional

### orderToShowCause

> `boolean` | optional

### partyType

> `string` | required

##### Allowed Values


 - `Conservator`
 - `Corporation`
 - `Custodian`
 - `Donor`
 - `Estate with an executor/personal representative/fiduciary/etc.`
 - `Estate without an executor/personal representative/fiduciary/etc.`
 - `Guardian`
 - `Next friend for a legally incompetent person (without a guardian, conservator, or other like fiduciary)`
 - `Next friend for a minor (without a guardian, conservator, or other like fiduciary)`
 - `Partnership (as the Tax Matters Partner)`
 - `Partnership (as a partnership representative under the BBA regime)`
 - `Partnership (as a partner other than Tax Matters Partner)`
 - `Petitioner`
 - `Petitioner & deceased spouse`
 - `Petitioner & spouse`
 - `Surviving spouse`
 - `Transferee`
 - `Trust`

### petitionPaymentStatus

> `string` | required

##### Allowed Values


 - `Paid`
 - `Not Paid`
 - `Waived`

### petitionPaymentDate

> `any`


If `petitionPaymentStatus` = `Paid`, then this field is `date` and is `required.` 


Otherwise, this field is `date` and is `optional`. `null` is allowed.

### petitionPaymentMethod

> `any`


If `petitionPaymentStatus` = `Paid`, then this field is `string` and is `required.` 


Otherwise, this field is `string` and is `optional`. `null` is allowed.

### petitionPaymentWaivedDate

> `any`


If `petitionPaymentStatus` = `Waived`, then this field is `date` and is `required.` 


Otherwise, this field is `date` and is `optional`. `null` is allowed.

### practitioners

> `array` | optional

### preferredTrialCity

> `conditional` | required


*Must match 1 of the following conditions:*

#### Condition #1 for `preferredTrialCity`: 

> `string`

##### Allowed Values


 - `Fresno, California`
 - `Tallahassee, Florida`
 - `Pocatello, Idaho`
 - `Peoria, Illinois`
 - `Wichita, Kansas`
 - `Shreveport, Louisiana`
 - `Portland, Maine`
 - `Billings, Montana`
 - `Albany, New York`
 - `Syracuse, New York`
 - `Bismarck, North Dakota`
 - `Aberdeen, South Dakota`
 - `Burlington, Vermont`
 - `Roanoke, Virginia`
 - `Cheyenne, Wyoming`
 - `Birmingham, Alabama`
 - `Mobile, Alabama`
 - `Anchorage, Alaska`
 - `Phoenix, Arizona`
 - `Little Rock, Arkansas`
 - `Los Angeles, California`
 - `San Diego, California`
 - `San Francisco, California`
 - `Denver, Colorado`
 - `Hartford, Connecticut`
 - `Washington, District of Columbia`
 - `Jacksonville, Florida`
 - `Miami, Florida`
 - `Tampa, Florida`
 - `Atlanta, Georgia`
 - `Honolulu, Hawaii`
 - `Boise, Idaho`
 - `Chicago, Illinois`
 - `Indianapolis, Indiana`
 - `Des Moines, Iowa`
 - `Louisville, Kentucky`
 - `New Orleans, Louisiana`
 - `Baltimore, Maryland`
 - `Boston, Massachusetts`
 - `Detroit, Michigan`
 - `St. Paul, Minnesota`
 - `Jackson, Mississippi`
 - `Kansas City, Missouri`
 - `St. Louis, Missouri`
 - `Helena, Montana`
 - `Omaha, Nebraska`
 - `Las Vegas, Nevada`
 - `Reno, Nevada`
 - `Albuquerque, New Mexico`
 - `Buffalo, New York`
 - `New York City, New York`
 - `Winston-Salem, North Carolina`
 - `Cincinnati, Ohio`
 - `Cleveland, Ohio`
 - `Columbus, Ohio`
 - `Oklahoma City, Oklahoma`
 - `Portland, Oregon`
 - `Philadelphia, Pennsylvania`
 - `Pittsburgh, Pennsylvania`
 - `Columbia, South Carolina`
 - `Knoxville, Tennessee`
 - `Memphis, Tennessee`
 - `Nashville, Tennessee`
 - `Dallas, Texas`
 - `El Paso, Texas`
 - `Houston, Texas`
 - `Lubbock, Texas`
 - `San Antonio, Texas`
 - `Salt Lake City, Utah`
 - `Richmond, Virginia`
 - `Seattle, Washington`
 - `Spokane, Washington`
 - `Charleston, West Virginia`
 - `Milwaukee, Wisconsin`
 - `null`

#### Condition #2 for `preferredTrialCity`: 

> `string`

##### Regex Pattern


`/^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/`

### procedureType

> `string` | required

##### Allowed Values


 - `Regular`
 - `Small`

### qcCompleteForTrial


QC Checklist object that must be completed before the Case can go to trial.

> `object` | required

### receivedAt


When the case was received by the Court.

> `date` | required

##### Can be null.

### respondents

> `array` | optional

### sealedDate

> `date` | optional

##### Can be null.

### status

> `string` | required

##### Allowed Values


 - `Assigned - Case`
 - `Assigned - Motion`
 - `Batched for IRS`
 - `Calendared`
 - `CAV`
 - `Closed`
 - `General Docket - Not at Issue`
 - `General Docket - At Issue (Ready for Trial)`
 - `Jurisdiction Retained`
 - `New`
 - `On Appeal`
 - `Recalled`
 - `Rule 155`
 - `Submitted`

### trialDate

> `date` | optional

##### Can be null.

### trialLocation

> `conditional` | optional


*Must match 1 of the following conditions:*

#### Condition #1 for `trialLocation`: 

> `string`

##### Allowed Values


 - `Fresno, California`
 - `Tallahassee, Florida`
 - `Pocatello, Idaho`
 - `Peoria, Illinois`
 - `Wichita, Kansas`
 - `Shreveport, Louisiana`
 - `Portland, Maine`
 - `Billings, Montana`
 - `Albany, New York`
 - `Syracuse, New York`
 - `Bismarck, North Dakota`
 - `Aberdeen, South Dakota`
 - `Burlington, Vermont`
 - `Roanoke, Virginia`
 - `Cheyenne, Wyoming`
 - `Birmingham, Alabama`
 - `Mobile, Alabama`
 - `Anchorage, Alaska`
 - `Phoenix, Arizona`
 - `Little Rock, Arkansas`
 - `Los Angeles, California`
 - `San Diego, California`
 - `San Francisco, California`
 - `Denver, Colorado`
 - `Hartford, Connecticut`
 - `Washington, District of Columbia`
 - `Jacksonville, Florida`
 - `Miami, Florida`
 - `Tampa, Florida`
 - `Atlanta, Georgia`
 - `Honolulu, Hawaii`
 - `Boise, Idaho`
 - `Chicago, Illinois`
 - `Indianapolis, Indiana`
 - `Des Moines, Iowa`
 - `Louisville, Kentucky`
 - `New Orleans, Louisiana`
 - `Baltimore, Maryland`
 - `Boston, Massachusetts`
 - `Detroit, Michigan`
 - `St. Paul, Minnesota`
 - `Jackson, Mississippi`
 - `Kansas City, Missouri`
 - `St. Louis, Missouri`
 - `Helena, Montana`
 - `Omaha, Nebraska`
 - `Las Vegas, Nevada`
 - `Reno, Nevada`
 - `Albuquerque, New Mexico`
 - `Buffalo, New York`
 - `New York City, New York`
 - `Winston-Salem, North Carolina`
 - `Cincinnati, Ohio`
 - `Cleveland, Ohio`
 - `Columbus, Ohio`
 - `Oklahoma City, Oklahoma`
 - `Portland, Oregon`
 - `Philadelphia, Pennsylvania`
 - `Pittsburgh, Pennsylvania`
 - `Columbia, South Carolina`
 - `Knoxville, Tennessee`
 - `Memphis, Tennessee`
 - `Nashville, Tennessee`
 - `Dallas, Texas`
 - `El Paso, Texas`
 - `Houston, Texas`
 - `Lubbock, Texas`
 - `San Antonio, Texas`
 - `Salt Lake City, Utah`
 - `Richmond, Virginia`
 - `Seattle, Washington`
 - `Spokane, Washington`
 - `Charleston, West Virginia`
 - `Milwaukee, Wisconsin`
 - `null`

#### Condition #2 for `trialLocation`: 

> `string`

##### Regex Pattern


`/^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/`

### trialSessionId

> `string` | optional

### trialTime

> `string` | optional

##### Regex Pattern


`/^[0-9]+:([0-5][0-9])$/`

### userId


The ID of the User who added the Case to the System.

> `string` | optional

### workItems

> `array` | optional
