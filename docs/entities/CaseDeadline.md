# CaseDeadline

### associatedJudge


Judge assigned to this Case. Defaults to Chief Judge.

> `string` | required

### caseDeadlineId


Unique Case Deadline ID only used by the system.

> `string` | required

### caseId


Unique Case ID only used by the system.

> `string` | required

### caseTitle


Title of the Case.

> `string` | required

### createdAt


When the Case Deadline was added to the system.

> `date` | required

### deadlineDate


When the Case Deadline expires.

> `date` | required

### description


User provided description of the Case Deadline.

> `string` | required

### docketNumber


Unique Case ID in XXXXX-YY format.

> `string` | required

##### Regex Pattern


`/^(\d{3,5}-\d{2})$/`

### docketNumberSuffix

> `string` | optional

##### Can be null.
