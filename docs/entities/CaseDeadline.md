# CaseDeadline
 ```
---
  type: "object"
  keys: 
    caseDeadlineId: 
      type: "string"
      flags: 
        presence: "required"
        description: "Unique Case Deadline ID only used by the system."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    caseId: 
      type: "string"
      flags: 
        presence: "required"
        description: "Unique Case ID only used by the system."
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    createdAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
        description: "When the Case Deadline was added to the system."
    deadlineDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
        description: "When the Case Deadline expires."
    description: 
      type: "string"
      flags: 
        presence: "required"
        description: "User provided description of the Case Deadline."
      rules: 
        - 
          name: "max"
          args: 
            limit: 120
        - 
          name: "min"
          args: 
            limit: 1
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "CaseDeadline"

 ```
