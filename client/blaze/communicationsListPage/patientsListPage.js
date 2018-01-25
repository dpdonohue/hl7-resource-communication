Session.setDefault( 'communicationSearchFilter', '' );
Session.setDefault( 'tableLimit', 20 );
Session.setDefault( 'paginationCount', 1 );
Session.setDefault( 'selectedPagination', 0 );
Session.setDefault( 'skipCount', 0 );



//------------------------------------------------------------------------------
// ROUTING

Router.route( '/list/communications/', {
  name: 'communicationsListPage',
  template: 'communicationsListPage',
  data: function () {
    return Communications.find();
  }
});

//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.communicationsListPage.events( {
  'click .addRecordIcon': function () {
    Router.go( '/insert/communication' );
  },
  'click .communicationItem': function () {
    Router.go( '/view/communication/' + this._id );
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #communicationSearchInput': function () {
    Session.set( 'communicationSearchFilter', $( '#communicationSearchInput' ).val() );
  }
} );


//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS


var OFFSCREEN_CLASS = 'off-screen';
var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

// Template.communicationsListPage.rendered = function () {
//   console.log( 'trying to update layout...' );
//
//   Template.appLayout.delayedLayout( 20 );
// };


Template.communicationsListPage.helpers( {
  dateOfBirth: function(){
    return moment(this.birthDate).format("MMM DD, YYYY");
  },
  getName: function(){
    return this.name[0].text;
  },
  hasNoContent: function () {
    if ( Communications.find().count() === 0 ) {
      return true;
    } else {
      return false;
    }
  },
  communicationsList: function () {
    Session.set( 'receivedData', new Date() );

    Template.appLayout.delayedLayout( 20 );

    return Communications.find();
    // return Communications.find( {
    //   'name.$.text': {
    //     $regex: Session.get( 'communicationSearchFilter' ),
    //     $options: 'i'
    //   }
    // } );
  }
} );
