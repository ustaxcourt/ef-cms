# Case

### associatedJudge


Judge assigned to this case. Defaults to Chief Judge.


Restricted

> `string` | optional

##### Maximum limit


`50`

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


Restricted

> `boolean` | optional

### blockedDate


Restricted

> `any`


If `blocked` = `true`, then this field is `date` and is `required.` 


Otherwise, this field is `any` and is `optional`. `null` is allowed.

### blockedReason


Restricted

> `any`


If `blocked` = `true`, then this field is `string` and is `required.` 


Otherwise, this field is `any` and is `optional`. `null` is allowed.

### caseCaption


The name of the party bringing the case, e.g. "Carol Williams, Petitioner," "Mark Taylor, Incompetent, Debra Thomas, Next Friend, Petitioner," or "Estate of Test Taxpayer, Deceased, Petitioner." This is the first half of the case title.

> `string` | required

##### Maximum limit


`500`

### caseId


Unique case ID only used by the system.

> `string` | required

### caseNote


Restricted

> `string` | optional

##### Maximum limit


`500`

### caseType

> `string` | required

##### Allowed Values


 - `CDP (Lien/Levy)`
 - `Deficiency`
 - `Declaratory Judgment (Exempt Organization)`
 - `Declaratory Judgment (Retirement Plan)`
 - `Innocent Spouse`
 - `Interest Abatement`
 - `Other`
 - `Partnership (BBA Section 1101)`
 - `Partnership (Section 6226)`
 - `Partnership (Section 6228)`
 - `Passport`
 - `Whistleblower`
 - `Worker Classification`

### contactPrimary

> `object` | required

### contactSecondary

> `object` | optional

##### Can be null.

### createdAt


When the paper or electronic case was added to the system. This value cannot be edited.

> `date` | required

### docketNumber


Unique case ID in XXXXX-YY format.

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


List of DocketRecord Entities for the case.

> `array` | required


An array of [`DocketRecord`](./DocketRecord.md)s

#### Rules

### documents


List of Document Entities for the case.

> `array` | required


An array of [`Document`](./Document.md)s

### entityName

> `string` | required

##### Can be Case.

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


Restricted

> `boolean` | optional

### highPriorityReason


Restricted

> `any`


If `highPriority` = `true`, then this field is `string` and is `required.` 


Otherwise, this field is `any` and is `optional`. `null` is allowed.

### initialCaption


Case caption before modification.

> `string` | optional

##### Maximum limit


`500`

##### Can be null.

### initialDocketNumberSuffix


Case docket number suffix before modification.

> `string` | optional

##### Maximum limit


`2`

##### Can be null.

### irsNoticeDate


Last date that the petitioner is allowed to file before.

> `date` | optional

##### Maximum date


`now`

##### Can be null.

### irsPractitioners


List of IRS practitioners (also known as respondents) associated with the case.

> `array` | optional

### irsSendDate


When the case was sent to the IRS by the court.

> `date` | optional

### isPaper

> `boolean` | optional

### leadCaseId


If this case is consolidated, this is the ID of the lead case. It is the lowest docket number in the consolidated group.

> `string` | optional

### mailingDate


Date that petition was mailed to the court.

> `any`


If `isPaper` = `true`, then this field is `string` and is `required.` 


Otherwise, this field is `string` and is `optional`. `null` is allowed.

### noticeOfAttachments


Reminder for clerks to review the notice of attachments.

> `boolean` | optional

### noticeOfTrialDate


Reminder for clerks to review the notice of trial date.

> `date` | optional

### orderDesignatingPlaceOfTrial


Reminder for clerks to review the Order Designating Place of Trial.

> `boolean` | optional

### orderForAmendedPetition


Reminder for clerks to review the order for amended Petition.

> `boolean` | optional

### orderForAmendedPetitionAndFilingFee


Reminder for clerks to review the order for amended Petition And filing fee.

> `boolean` | optional

### orderForFilingFee


Reminder for clerks to review the order for filing fee.

> `boolean` | optional

### orderForOds


Reminder for clerks to review the order for ODS.

> `boolean` | optional

### orderForRatification


Reminder for clerks to review the Order for Ratification.

> `boolean` | optional

### orderToChangeDesignatedPlaceOfTrial


Reminder for clerks to review the Order to Change Designated Place Of Trial.

> `boolean` | optional

### orderToShowCause


Reminder for clerks to review the Order to Show Cause.

> `boolean` | optional

### partyType


Party type of the case petitioner.

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


Status of the case fee payment.

> `string` | required

##### Allowed Values


 - `Paid`
 - `Not Paid`
 - `Waived`

### petitionPaymentDate


When the petitioner paid the case fee.

> `any`


If `petitionPaymentStatus` = `Paid`, then this field is `date` and is `required.` 


Otherwise, this field is `date` and is `optional`. `null` is allowed.

### petitionPaymentMethod


How the petitioner paid the case fee.

> `any`


If `petitionPaymentStatus` = `Paid`, then this field is `string` and is `required.` 


Otherwise, this field is `string` and is `optional`. `null` is allowed.

### petitionPaymentWaivedDate


When the case fee was waived.

> `any`


If `petitionPaymentStatus` = `Waived`, then this field is `date` and is `required.` 


Otherwise, this field is `date` and is `optional`. `null` is allowed.

### preferredTrialCity


Where the petitioner would prefer to hold the case trial.

> `conditional` | optional


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

### privatePractitioners


List of private practitioners associated with the case.

> `array` | optional

### procedureType


Procedure type of the case.

> `string` | required

##### Allowed Values


 - `Regular`
 - `Small`

### qcCompleteForTrial


QC Checklist object that must be completed before the case can go to trial.


Restricted

> `object` | optional

### receivedAt


When the case was received by the court. If electronic, this value will be the same as createdAt. If paper, this value can be edited.

> `date` | required

### sealedDate


When the case was sealed from the public.

> `date` | optional

##### Can be null.

### sortableDocketNumber


A sortable representation of the docket number (auto-generated by constructor).

> `number` | required

### status


Status of the case.


Restricted

> `string` | optional

##### Allowed Values


 - `Assigned - Case`
 - `Assigned - Motion`
 - `Calendared`
 - `CAV`
 - `Closed`
 - `General Docket - Not at Issue`
 - `General Docket - At Issue (Ready for Trial)`
 - `Jurisdiction Retained`
 - `New`
 - `On Appeal`
 - `Rule 155`
 - `Submitted`

### closedDate

> `any`


If `status` = `Closed`, then this field is `date` and is `required.` 


Otherwise, this field is `any` and is `optional`. `null` is allowed.

### trialDate


When this case goes to trial.

> `date` | optional

##### Can be null.

### trialLocation


Where this case goes to trial. This may be different that the preferred trial location.

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


The unique ID of the trial session associated with this case.

> `string` | optional

### trialTime


Time of day when this case goes to trial.

> `string` | optional

##### Regex Pattern


`/^[0-9]{1,2}:([0-5][0-9])$/`

### userId


The unique ID of the User who added the case to the system.


Restricted

> `string` | optional

##### Maximum limit


`50`

### workItems


List of system messages associated with this case.


Restricted

> `array` | optional
