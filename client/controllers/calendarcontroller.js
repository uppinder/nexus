angular.module('nexus').controller('calendarController', [ '$scope', '$http', 'moment', 'calendarConfig' , function($scope, $http, moment, calendarConfig, alert) {

    //These variables MUST be set as a minimum for the calendar to work
    $scope.calendarView = 'month';
    $scope.viewDate = new Date();
    var actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function(args) {
        alert.show('Edited', args.calendarEvent);
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function(args) {
        alert.show('Deleted', args.calendarEvent);
      }
    }];

    $scope.events = [];
  
    function getData() {
		return $http({
			method: 'GET',
			url: '/user_data/events',
			cache: true
		})
		.then(function(res) {
			// console.log(res);
      return res.data;
		}, function() {
			// console.log("Couldn't load the events!");
		});
	};
	
   	getData().then(function(data) {
        // console.log(data);
   			// console.log(typeof "data");
        if(data !== "")
			   $scope.events = data;
		})
		.catch(function(err) {
			// console.log(err);
		});

    $scope.cellIsOpen = true;

    $scope.addEvent = function() {
    	var event = {
    		title: 'New event lasjdflka jdsl',
        startsAt: moment().startOf('day').toDate(),
        endsAt: moment().endOf('day').toDate(),
        color:{
          primary: "red",
          secondary: "yellow"
        },
        draggable: true,
        resizable: true
    	};

      // $scope.events.push(event);
      $http.post('/user_data/addevent', {
       event: event
      })
      .then(function() {
        $scope.events.push(event);
    	  // getData().then(function(data) {
              // console.log(data);
       //        $scope.events = data;
       //    })
       //    .catch(function(err) {
            // console.log(err);
       //    });
				// console.log("Event added successfully");
			}, function(err) {
        // console.log(err);
				// console.log("Couldn't add the event!");
			});
    };

    // $scope.eventClicked = function(event) {
    //   alert.show('Clicked', event);
    // };

    // $scope.eventEdited = function(event) {
    //   alert.show('Edited', event);
    // };

    // $scope.eventDeleted = function(event) {
    //   alert.show('Deleted', event);
    // };

    // $scope.eventTimesChanged = function(event) {
    //   alert.show('Dropped or resized', event);
    // };

    // $scope.toggle = function($event, field, event) {
    //   $event.preventDefault();
    //   $event.stopPropagation();
    //   event[field] = !event[field];
    // };

    // $scope.timespanClicked = function(date, cell) {

    //   if ($scope.calendarView === 'month') {
    //     if (($scope.cellIsOpen && moment(date).startOf('day').isSame(moment($scope.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
    //       $scope.cellIsOpen = false;
    //     } else {
    //       $scope.cellIsOpen = true;
    //       $scope.viewDate = date;
    //     }
    //   } else if ($scope.calendarView === 'year') {
    //     if (($scope.cellIsOpen && moment(date).startOf('month').isSame(moment($scope.viewDate).startOf('month'))) || cell.events.length === 0) {
    //       $scope.cellIsOpen = false;
    //     } else {
    //       $scope.cellIsOpen = true;
    //       $scope.viewDate = date;
    //     }
    //   }
    // };
}]);