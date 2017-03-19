##  clinical:hl7-resource-patient   

HL7 FHIR Resource - Patient


--------------------------------------------  
#### Schema  

The resource in this package implements the FHIR Patient Resource schema provided at  [https://www.hl7.org/fhir/patient.html](https://www.hl7.org/fhir/patient.html).  


--------------------------------------------  
#### Installation  

```bash
meteor add clinical:hl7-resource-patient
```


--------------------------------------------  
#### Example    

```js
var newPatient = {
  'name' : [
    {
      'text' : 'Jane Doe',
      'given' : 'Jane',
      'family' : 'Doe',
      'resourceType' : 'HumanName'
    }
  ],
  'active' : true,
  'gender' : 'female',
  'identifier' : [{
      'use' : 'usual',
      'type' : {
        text: 'Medical record number',
        'coding' : [
          {
            'system' : 'http://hl7.org/fhir/v2/0203',
            'code' : 'MR'
          }
        ]
      },
      'system' : 'urn:oid:1.2.36.146.595.217.0.1',
      'value' : '123',
      'period' : {}
   }],
  'birthdate' : new Date(1970, 1, 25),
  'resourceType' : 'Patient'
};
Patients.insert(newPatient);
```

--------------------------------------------  
#### Extending the Schema  

```js
ExtendedPatientSchema = new SimpleSchema([
  PatientSchema,
  {
    "createdAt": {
      "type": Date,
      "optional": true
    }
  }
]);
Patients.attachSchema( ExtendedPatientSchema );
```

--------------------------------------------  
#### Conformance Statement  

This package conforms to version `FHIR 1.6.0 - STU3 Ballot`, as per the Touchstone testing utility.  

![https://raw.githubusercontent.com/clinical-meteor/hl7-resource-patient/master/screenshots/Screen%20Shot%202017-03-18%20at%2010.56.09%20PM.png](https://raw.githubusercontent.com/clinical-meteor/hl7-resource-patient/master/screenshots/Screen%20Shot%202017-03-18%20at%2010.56.09%20PM.png)  


--------------------------------------------  
#### Licensing   

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
