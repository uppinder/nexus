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

	// getting data from the server and displaying on the client side initially
	function getData() {
	return $http({
		method: 'GET',
		url: '/user_data/events',
		cache: true
	}).then(function(res) {
			return res.data;
		}, function() {
			console.log("Couldn't load the events!");
		});
	};
	
	getData()
		.then(function(data) {
			if(data !== "")
				data.forEach( function(event) {
					event.startsAt = new Date(event.startsAt);
					event.endsAt = new Date(event.endsAt);
				});
				$scope.events = data;
		})
		.catch(function(err) {
			console.log(err);
	});

	$scope.cellIsOpen = true;

	$scope.addEvent = function() {
		var event = {
			title: 'New Event Title',
			startsAt: moment().startOf('day').add(8, 'hours').toDate(),
			endsAt: moment().startOf('day').add(10, 'hours').toDate(),
			color: calendarConfig.colorTypes.important,
			draggable: true,
			resizable: true
		};
		// adding this new event to the database(server side)
		$http.post('/user_data/events/add', {
			event: event
		})
		.then(function() {
			// update the new event in the client side also
			$scope.events.push(event);
		}, function(err) {
			console.log("Couldn't add the event. ERR : " + err);
		});
	};	

	$scope.eventDelete = function(eventId, index) {
		$http.delete('user_data/events/delete/' + eventId)
			.then(function(){
				$scope.events.splice(index, 1)
			}, function(err) {
				console.log(err);
			});
	};

	$scope.eventUpdate = function(event){
		$http.put('user_data/events/update/' + event._id, { updatedEvent : event})
			.then(function() {
				console.log("update successful")
			}, function(err) {
				console.log(err);
			});
	};

	$scope.toggle = function($event, field, event) {
	  $event.preventDefault();
	  $event.stopPropagation();
	  event[field] = !event[field];
	};

	$scope.timespanClicked = function(date, cell) {

	  if ($scope.calendarView === 'month') {
	    if (($scope.cellIsOpen && moment(date).startOf('day').isSame(moment($scope.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
	      $scope.cellIsOpen = false;
	    } else {
	      $scope.cellIsOpen = true;
	      $scope.viewDate = date;
	    }
	  } else if ($scope.calendarView === 'year') {
	    if (($scope.cellIsOpen && moment(date).startOf('month').isSame(moment($scope.viewDate).startOf('month'))) || cell.events.length === 0) {
	      $scope.cellIsOpen = false;
	    } else {
	      $scope.cellIsOpen = true;
	      $scope.viewDate = date;
	    }
	  }
	};
}]);