if(Package['clinical:autopublish']){
  console.log("*****************************************************************************")
  console.log("HIPAA WARNING:  Your app has the 'clinical-autopublish' package installed.");
  console.log("Any protected health information (PHI) stored in this app should be audited."); 
  console.log("Please consider writing secure publish/subscribe functions and uninstalling.");  
  console.log("");  
  console.log("meteor remove clinical:autopublish");  
  console.log("");  
}
if(Package['autopublish']){
  console.log("*****************************************************************************")
  console.log("HIPAA WARNING:  DO NOT STORE PROTECTED HEALTH INFORMATION IN THIS APP. ");  
  console.log("Your application has the 'autopublish' package installed.  Please uninstall.");
  console.log("");  
  console.log("meteor remove autopublish");  
  console.log("meteor add clinical:autopublish");  
  console.log("");  
}







/**
 * @summary Represents a Communication; typically documented by a clinician.  A Clinical Impression can be self-assigned, in which case it may be considered a Status or ReportedCondition.
 * @class Communication
 * @param {Object} document An object representing an impression, ususally a Mongo document.
 * @example
newCommunication = new Communication({
  name: {
    given: "Jane",
    family: "Doe"
  },
  gender: "female",
  identifier: "12345"
});


newCommunication.clean();
newCommunication.validate();
newCommunication.save();
 */


// create the object using our BaseModel
Communication = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
Communication.prototype._collection = Communications;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Communications = new Mongo.Collection('HL7.Resources.Communications');
Communications = new Mongo.Collection('Communications');

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Communications._transform = function (document) {
  return new Communication(document);
};




CommunicationSchema = new SimpleSchema([
  BaseSchema,
  DomainResourceSchema,
  {
  "resourceType" : {
    type: String,
    defaultValue: "Communication"
  },
  "identifier" : {
    optional: true,
    type: [ IdentifierSchema ]
    },
  "active" : {
    type: Boolean,
    optional: true,
    defaultValue: true
    },
  "name" : {
    optional: true,
    type: [ HumanNameSchema ]
    },
  "telecom" : {
    optional: true,
    type: [ ContactPointSchema ]
    },
  "gender" : {
    optional: true,
    allowedValues: ['male', 'female', 'other', 'unknown'],
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
    allowedValues: ['male', 'female', 'other', 'unknown'],
    type: Code
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
  "generalPractitioner" : {
    optional: true,
    type: [ ReferenceSchema ]
    },
  "managingOrganization" : {
    optional: true,
    type: ReferenceSchema
    },
  "link.$.other" : {
    optional: true,
    type: ReferenceSchema
    },
  "link.$.type" : {
    optional: true,
    allowedValues: ['replaced-by', 'replaces', 'refer', 'seealso'],
    type: Code
    },
  "test" : {
    optional: true,
    type: Boolean
    }
  }
]);
Communications.attachSchema(CommunicationSchema);


Communication.prototype.toFhir = function(){
  console.log('Communication.toFhir()');



  return EJSON.stringify(this.name);
}

/**
 * @summary Search the Communications collection for a specific Meteor.userId().
 * @memberOf Communications
 * @name findUserId
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let communications = Communications.findUserId(Meteor.userId());
 *  let communication = communications[0];
 * ```
 */

Communications.findUserId = function (userId) {
  process.env.TRACE && console.log("Communications.findUserId()");
  return Communications.find({'identifier.value': userId});
};

/**
 * @summary Search the Communications collection for a specific Meteor.userId().
 * @memberOf Communications
 * @name findOneUserId
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let communication = Communications.findOneUserId(Meteor.userId());
 * ```
 */

Communications.findOneUserId = function (userId) {
  process.env.TRACE && console.log("Communications.findOneUserId()");  
  return Communications.findOne({'identifier.value': userId});
};
/**
 * @summary Search the Communications collection for a specific Meteor.userId().
 * @memberOf Communications
 * @name findMrn
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let communications = Communications.findMrn('12345').fetch();
 * ```
 */

Communications.findMrn = function (userId) {
  process.env.TRACE && console.log("Communications.findMrn()");  
  return Communications.find({'identifier.value': userId});
};

/**
 * @summary Search the Communications collection for a specific Meteor.userId().
 * @memberOf Communications
 * @name findMrn
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let communications = Communications.findMrn('12345').fetch();
 * ```
 */

Communications.fetchBundle = function (query, parameters, callback) {
  process.env.TRACE && console.log("Communications.fetchBundle()");  
  var communicationArray = Communications.find(query, parameters, callback).map(function(communication){
    communication.id = communication._id;
    delete communication._document;
    return communication;
  });

  // console.log("communicationArray", communicationArray);

  var result = Bundle.generate(communicationArray);

  // console.log("result", result.entry[0]);

  return result;
};


/**
 * @summary This function takes a FHIR resource and prepares it for storage in Mongo.
 * @memberOf Communications
 * @name toMongo
 * @version 1.6.0
 * @returns { Communication }
 * @example
 * ```js
 *  let communications = Communications.toMongo('12345').fetch();
 * ```
 */

Communications.toMongo = function (originalCommunication) {
  var mongoRecord;
  process.env.TRACE && console.log("Communications.toMongo()");  

  if (originalCommunication.identifier) {
    originalCommunication.identifier.forEach(function(identifier){
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

  return originalCommunication;
};



/**
 * @summary This function takes a DTSU2 resource and returns it as STU3.  i.e. it converts from v1.0.2 to v3.0.0
 * @name toMongo
 * @version 3.0.0
 * @returns { Communication }
 * @example
 * ```js
 * ```
 */
Communications.toStu3 = function(communicationJson){
  if(communicationJson){

    // quick cast from string to boolean
    if(typeof communicationJson.birthDate === "string"){
      communicationJson.birthDate = new Date(communicationJson.birthDate);
    }

    // quick cast from string to boolean
    if(communicationJson.deceasedBoolean){
      communicationJson.deceasedBoolean = (communicationJson.deceasedBoolean == "true") ? true : false;
    }

    // STU3 only has a single entry for family name; not an array
    if(communicationJson.name && communicationJson.name[0] && communicationJson.name[0].family && communicationJson.name[0].family[0] ){
      communicationJson.name[0].family = communicationJson.name[0].family[0];      
    }

    // make sure the full name is filled out
    if(communicationJson.name && communicationJson.name[0] && communicationJson.name[0].family && !communicationJson.name[0].text ){
      communicationJson.name[0].text = communicationJson.name[0].given[0] + ' ' + communicationJson.name[0].family;      
    }
  }
  return communicationJson;
}


/**
 * @summary Similar to toMongo(), this function prepares a FHIR record for storage in the Mongo database.  The difference being, that this assumes there is already an existing record.
 * @memberOf Communications
 * @name prepForUpdate
 * @version 1.6.0
 * @returns { Object }
 * @example
 * ```js
 *  let communications = Communications.findMrn('12345').fetch();
 * ```
 */

Communications.prepForUpdate = function (communication) {
  process.env.TRACE && console.log("Communications.prepForUpdate()");  

  if (communication.name && communication.name[0]) {
    //console.log("communication.name", communication.name);

    communication.name.forEach(function(name){
      name.resourceType = "HumanName";
    });
  }

  if (communication.telecom && communication.telecom[0]) {
    //console.log("communication.telecom", communication.telecom);
    communication.telecom.forEach(function(telecom){
      telecom.resourceType = "ContactPoint";
    });
  }

  if (communication.address && communication.address[0]) {
    //console.log("communication.address", communication.address);
    communication.address.forEach(function(address){
      address.resourceType = "Address";
    });
  }

  if (communication.contact && communication.contact[0]) {
    //console.log("communication.contact", communication.contact);

    communication.contact.forEach(function(contact){
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

  return communication;
};


/**
 * @summary Scrubbing the communication; make sure it conforms to v1.6.0
 * @memberOf Communications
 * @name scrub
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 *  let communications = Communications.findMrn('12345').fetch();
 * ```
 */

Communications.prepForFhirTransfer = function (communication) {
  process.env.TRACE && console.log("Communications.prepForFhirTransfer()");  


  // FHIR has complicated and unusual rules about dates in order
  // to support situations where a family member might report on a communication's
  // date of birth, but not know the year of birth; and the other way around
  if (communication.birthDate) {
    communication.birthDate = moment(communication.birthDate).format("YYYY-MM-DD");
  }


  if (communication.name && communication.name[0]) {
    //console.log("communication.name", communication.name);

    communication.name.forEach(function(name){
      delete name.resourceType;
    });
  }

  if (communication.telecom && communication.telecom[0]) {
    //console.log("communication.telecom", communication.telecom);
    communication.telecom.forEach(function(telecom){
      delete telecom.resourceType;
    });
  }

  if (communication.address && communication.address[0]) {
    //console.log("communication.address", communication.address);
    communication.address.forEach(function(address){
      delete address.resourceType;
    });
  }

  if (communication.contact && communication.contact[0]) {
    //console.log("communication.contact", communication.contact);

    communication.contact.forEach(function(contact){

      console.log("contact", contact);


      if (contact.name && contact.name.resourceType) {
        //console.log("communication.contact.name", contact.name);
        delete contact.name.resourceType;
      }

      if (contact.telecom && contact.telecom[0]) {
        contact.telecom.forEach(function(telecom){
          delete telecom.resourceType;
        });
      }

    });
  }

  //console.log("Communications.prepForBundle()", communication);

  return communication;
};

/**
 * @summary The displayed name of the communication.
 * @memberOf Communication
 * @name displayName
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * ```
 */

Communication.prototype.displayName = function () {
  process.env.TRACE && console.log("Communications.displayName()");  

  if (this.name && this.name[0]) {
    return this.name[0].text;
  }
};


/**
 * @summary The displayed Meteor.userId() of the communication.
 * @memberOf Communication
 * @name userId
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * ```
 */

Communication.prototype.userId = function () {
  process.env.TRACE && console.log("Communications.userId()");  

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



/**
 * @summary The displayed Meteor.userId() of the communication.
 * @memberOf Communication
 * @name userId
 * @version 1.2.3
 * @returns {Boolean}
 * @example
 * ```js
 * ```
 */


/**
 * @summary Anonymize the communication record
 * @memberOf Communication
 * @name removeProtectedInfo
 * @version 1.2.3
 * @returns {Object}
 * @example
 * ```js
 * ```
 */

Communication.prototype.removeProtectedInfo = function (options) {
  process.env.TRACE && console.log("Communications.anonymize()", this);  

  console.log("Communications.anonymize()");  

  // 1. Names
  if(this.name && this.name[0]){
    var anonymizedName = this.name[0];

    if(this.name[0].family){
      anonymizedName.family = '';
    }
    if(this.name[0].given && this.name[0].given[0]){
      anonymizedName.given = [];          
    }
    if(this.name[0].text){
      anonymizedName.text = '';
    }

    this.name = [];
    this.name.push(anonymizedName);
  }

  // 3.  dates


  // 4. Phone numbers
  // 5.  Fax Numbers
  // 6.  Identifiers
  // 7.  Medical Record Nubers
  // 17.  Photos

  return this;
}


/**
 * @summary Anonymize the communication record
 * @memberOf Communication
 * @name anonymize
 * @version 1.2.3
 * @returns {Object}
 * @example
 * ```js
 * ```
 */

Communication.prototype.anonymize = function () {
  process.env.TRACE && console.log("Communications.hash()", this);  

  console.log("Communications.hash()");  


  if(this.name && this.name[0]){
    var anonymizedName = this.name[0];

    if(this.name[0].family){
      anonymizedName.family = Anon.name(this.name[0].family);        
    }
    if(this.name[0].given && this.name[0].given[0]){
      var secretGiven = Anon.name(this.name[0].given[0]);
      anonymizedName.given = [];      
      anonymizedName.given.push(secretGiven);
    }
    if(this.name[0].text){
      anonymizedName.text = Anon.name(this.name[0].text);
    }

    this.name = [];
    this.name.push(anonymizedName);
  }

  return this;
}


Anon = {
  name: function(name){
    var anonName = '';
    for(var i = 0; i < name.length; i++){
      if(name[i] === " "){
        anonName = anonName + " ";
      } else {
        anonName = anonName + "*";
      }
    }
    return anonName;
  },
  phone: function(){
    return "NNN-NNN-NNNN";
  },
  ssn: function(){
    return "###-##-####"
  }
}


export { Communication, Communications, CommunicationSchema };
// // export Communication;