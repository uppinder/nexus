angular.module('nexus')
	.factory('chatSocket', function(socketFactory) {
	 	return socketFactory();
	}
);