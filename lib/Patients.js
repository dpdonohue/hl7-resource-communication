
/**
 * @summary Represents a Patient; typically documented by a clinician.  A Clinical Impression can be self-assigned, in which case it may be considered a Status or ReportedCondition.
 * @class Patient
 * @param {Object} document An object representing an impression, ususally a Mongo document.
 * @example
newPatient = new Patient({
  name: {
    given: "Jane",
    family: "Doe"
  },
  gender: "female",
  identifier: "12345"
});


newPatient.clean();
newPatient.validate();
newPatient.save();
 */


// create the object using our BaseModel
Patient = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
Patient.prototype._collection = Patients;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');
Patients = new Mongo.Collection('Patients');

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Patients._transform = function (document) {
  return new Patient(document);
};


if (Meteor.isClient){
  Meteor.subscribe("Patients");
}

if (Meteor.isServer){
  Meteor.publish("Patients", function (argument){
    return Patients.find();
  });
}


PatientSchema = new SimpleSchema([
  BaseSchema,
  DomainResourceSchema,
  {
  "resourceType" : {
    type: String,
    defaultValue: "Patient"
  },
  "identifier" : {
    optional: true,
    type: [ IdentifierSchema ]
    },
  "active" : {
    type: Boolean,
    defaultValue: true
    },
  "name" : {
    type: [ HumanNameSchema ]
    },
  "telecom" : {
    optional: true,
    type: [ ContactPointSchema ]
    },
  "gender" : {
    optional: true,
    type: String
    },
  "birthDate" : {
    optional: true,
    type: Date
    },
  "deceasedBoolean" : {
    optional: true,
    type: Boolean
    },
  "deceasedDateTime" : {
    optional: true,
    type: Date
    },
  "address" : {
    optional: true,
    type: [ AddressSchema ]
    },
  "maritalStatus" : {
    optional: true,
    type: CodeableConceptSchema
    },
  "multipleBirthBoolean" : {
    optional: true,
    type: Boolean
    },
  "multipleBirthInteger" : {
    optional: true,
    type: Number
    },
  "photo" : {
    optional: true,
    type: [ AttachmentSchema ]
    },
  "contact.$.relationship" : {
    optional: true,
    type: [ CodeableConceptSchema ]
    },
  "contact.$.name" : {
    optional: true,
    type: HumanNameSchema
    },
  "contact.$.telecom" : {
    optional: true,
    type: [ ContactPointSchema ]
    },
  "contact.$.address" : {
    optional: true,
    type: [ AddressSchema ]
    },
  "contact.$.gender" : {
    optional: true,
    type: String
    },
  "contact.$.organization" : {
    optional: true,
    type: String
    },
  "contact.$.period" : {
    optional: true,
    type: PeriodSchema
    },
  "animal.species" : {
    optional: true,
    type: String
    //type: CodeableConceptSchema
    },
  "animal.breed" : {
    optional: true,
    type: CodeableConceptSchema
    },
  "animal.genderStatus" : {
    optional: true,
    type: CodeableConceptSchema
    },
  "communication.$.language" : {
    optional: true,
    type: CodeableConceptSchema
    },
  "communication.$.preferred" : {
    optional: true,
    type: Boolean
    },
  "careProvider" : {
    optional: true,
    type: [ ReferenceSchema ]
    },
  "managingOrganization" : {
    optional: true,
    type: String
    },
  "link.$.other" : {
    optional: true,
    type: String
    },
  "link.$.type" : {
    optional: true,
    type: String
    },
  "test" : {
    optional: true,
    type: Boolean
    }
  }
]);
Patients.attachSchema(PatientSchema);



/**
 * @summary Search the Patients collection for a specific Meteor.userId().
 * @memberOf Patients
 * @name findUserId
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let patients = Patients.findUserId(Meteor.userId());
 *  let patient = patients[0];
 * ```
 */

Patients.findUserId = function (userId) {
  return Patients.find({'identifier.value': userId});
};

/**
 * @summary Search the Patients collection for a specific Meteor.userId().
 * @memberOf Patients
 * @name findOneUserId
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let patient = Patients.findOneUserId(Meteor.userId());
 * ```
 */

Patients.findOneUserId = function (userId) {
  return Patients.findOne({'identifier.value': userId});
};
/**
 * @summary Search the Patients collection for a specific Meteor.userId().
 * @memberOf Patients
 * @name findMrn
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let patients = Patients.findMrn('12345').fetch();
 * ```
 */

Patients.findMrn = function (userId) {
  return Patients.find({'identifier.value': userId});
};

/**
 * @summary Search the Patients collection for a specific Meteor.userId().
 * @memberOf Patients
 * @name findMrn
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let patients = Patients.findMrn('12345').fetch();
 * ```
 */

Patients.fetchBundle = function (query, parameters, callback) {
  var patientArray = Patients.find(query, parameters, callback).map(function(patient){
    patient.id = patient._id;
    delete patient._document;
    return patient;
  });

  // console.log("patientArray", patientArray);

  var result = Bundle.generate(patientArray);

  // console.log("result", result.entry[0]);

  return result;
};


/**
 * @summary This function takes a FHIR resource and prepares it for storage in Mongo.
 * @memberOf Patients
 * @name toMongo
 * @version 1.6.0
 * @returns { Patient }
 * @example
 * ```js
 *  let patients = Patients.toMongo('12345').fetch();
 * ```
 */

Patients.toMongo = function (originalPatient) {
  var mongoRecord;

  if (originalPatient.identifier) {
    originalPatient.identifier.forEach(function(identifier){
      if (identifier.period) {
        if (identifier.period.start) {
          var startArray = identifier.period.start.split('-');
          identifier.period.start = new Date(startArray[0], startArray[1] - 1, startArray[2]);
        }
        if (identifier.period.end) {
          var endArray = identifier.period.end.split('-');
          identifier.period.end = new Date(startArray[0], startArray[1] - 1, startArray[2]);
        }
      }
    });
  }

  return originalPatient;
};


/**
 * @summary Similar to toMongo(), this function prepares a FHIR record for storage in the Mongo database.  The difference being, that this assumes there is already an existing record.
 * @memberOf Patients
 * @name prepForUpdate
 * @version 1.6.0
 * @returns { Object }
 * @example
 * ```js
 *  let patients = Patients.findMrn('12345').fetch();
 * ```
 */

Patients.prepForUpdate = function (patient) {

  if (patient.name && patient.name[0]) {
    //console.log("patient.name", patient.name);

    patient.name.forEach(function(name){
      name.resourceType = "HumanName";
    });
  }

  if (patient.telecom && patient.telecom[0]) {
    //console.log("patient.telecom", patient.telecom);
    patient.telecom.forEach(function(telecom){
      telecom.resourceType = "ContactPoint";
    });
  }

  if (patient.address && patient.address[0]) {
    //console.log("patient.address", patient.address);
    patient.address.forEach(function(address){
      address.resourceType = "Address";
    });
  }

  if (patient.contact && patient.contact[0]) {
    //console.log("patient.contact", patient.contact);

    patient.contact.forEach(function(contact){
      if (contact.name) {
        contact.name.resourceType = "HumanName";
      }

      if (contact.telecom && contact.telecom[0]) {
        contact.telecom.forEach(function(telecom){
          telecom.resourceType = "ContactPoint";
        });
      }

    });
  }

  return patient;
};


/**
 * @summary Scrubbing the patient; make sure it conforms to v1.6.0
 * @memberOf Patients
 * @name scrub
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let patients = Patients.findMrn('12345').fetch();
 * ```
 */

Patients.prepForFhirTransfer = function (patient) {
  //console.log("Patients.prepForBundle()");


  // FHIR has complicated and unusual rules about dates in order
  // to support situations where a family member might report on a patient's
  // date of birth, but not know the year of birth; and the other way around
  if (patient.birthDate) {
    patient.birthDate = moment(patient.birthDate).format("YYYY-MM-DD");
  }


  if (patient.name && patient.name[0]) {
    //console.log("patient.name", patient.name);

    patient.name.forEach(function(name){
      delete name.resourceType;
    });
  }

  if (patient.telecom && patient.telecom[0]) {
    //console.log("patient.telecom", patient.telecom);
    patient.telecom.forEach(function(telecom){
      delete telecom.resourceType;
    });
  }

  if (patient.address && patient.address[0]) {
    //console.log("patient.address", patient.address);
    patient.address.forEach(function(address){
      delete address.resourceType;
    });
  }

  if (patient.contact && patient.contact[0]) {
    //console.log("patient.contact", patient.contact);

    patient.contact.forEach(function(contact){

      console.log("contact", contact);


      if (contact.name && contact.name.resourceType) {
        //console.log("patient.contact.name", contact.name);
        delete contact.name.resourceType;
      }

      if (contact.telecom && contact.telecom[0]) {
        contact.telecom.forEach(function(telecom){
          delete telecom.resourceType;
        });
      }

    });
  }

  //console.log("Patients.prepForBundle()", patient);

  return patient;
};

/**
 * @summary The displayed name of the patient.
 * @memberOf Patient
 * @name displayName
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * ```
 */

Patient.prototype.displayName = function () {
  if (this.name && this.name[0]) {
    return this.name[0].text;
  }
};


/**
 * @summary The displayed Meteor.userId() of the patient.
 * @memberOf Patient
 * @name userId
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * ```
 */

Patient.prototype.userId = function () {
  var result = null;
  if (this.extension) {
    this.extension.forEach(function(extension){
      if (extension.url === "Meteor.userId()") {
        result = extension.valueString;
      }
    });
  }
  return result;
};
