# WorkItem
 ```
---
  type: "object"
  keys: 
    assigneeId: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
      allow: 
        - null
    assigneeName: 
      type: "string"
      flags: 
        presence: "optional"
      allow: 
        - null
    associatedJudge: 
      type: "string"
      flags: 
        presence: "required"
    caseId: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    caseIsInProgress: 
      type: "boolean"
      flags: 
        presence: "optional"
    caseStatus: 
      type: "string"
      flags: 
        presence: "optional"
    caseTitle: 
      type: "string"
      flags: 
        presence: "optional"
    completedAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
    completedBy: 
      type: "string"
      flags: 
        presence: "optional"
      allow: 
        - null
    completedByUserId: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
      allow: 
        - null
    completedMessage: 
      type: "string"
      flags: 
        presence: "optional"
      allow: 
        - null
    createdAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
    docketNumber: 
      type: "string"
      flags: 
        presence: "required"
    docketNumberSuffix: 
      type: "string"
      flags: 
        presence: "optional"
      allow: 
        - null
    document: 
      type: "object"
      flags: 
        presence: "required"
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "WorkItem"
    hideFromPendingMessages: 
      type: "boolean"
      flags: 
        presence: "optional"
    highPriority: 
      type: "boolean"
      flags: 
        presence: "optional"
    inProgress: 
      type: "boolean"
      flags: 
        presence: "optional"
    isInitializeCase: 
      type: "boolean"
      flags: 
        presence: "optional"
    isQC: 
      type: "boolean"
      flags: 
        presence: "required"
    isRead: 
      type: "boolean"
      flags: 
        presence: "optional"
    messages: 
      type: "array"
      flags: 
        presence: "required"
      items: 
        - 
          type: "object"
    section: 
      type: "string"
      flags: 
        presence: "required"
    sentBy: 
      type: "string"
      flags: 
        presence: "required"
    sentBySection: 
      type: "string"
      flags: 
        presence: "optional"
    sentByUserId: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"
    trialDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "optional"
      allow: 
        - null
    updatedAt: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
    workItemId: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "guid"
          args: 
            options: 
              version: 
                - "uuidv4"

 ```
