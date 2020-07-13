# UserCaseNote
 ```
---
  type: "object"
  keys: 
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
    entityName: 
      type: "string"
      flags: 
        only: true
        presence: "required"
      allow: 
        - "UserCaseNote"
    notes: 
      type: "string"
      flags: 
        presence: "required"
    userId: 
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
