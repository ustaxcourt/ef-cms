# Correspondence
 ```
---
  type: "object"
  keys: 
    documentId: 
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
    documentTitle: 
      type: "string"
      flags: 
        presence: "required"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
    filedBy: 
      type: "string"
      flags: 
        presence: "optional"
      rules: 
        - 
          name: "max"
          args: 
            limit: 500
      allow: 
        - ""
    filingDate: 
      type: "date"
      flags: 
        format: 
          - "YYYY-MM-DDTHH:mm:ss.SSSZ"
          - "YYYY-MM-DD"
        presence: "required"
        description: "Date that this Document was filed."
      rules: 
        - 
          name: "max"
          args: 
            date: "now"
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
