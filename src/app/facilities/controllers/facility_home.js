(function(angular){
    "use strict";
    angular.module("mfl.facilities.controllers.home", [])
    .controller("mfl.facilities.controllers.home.list", ["$scope", function($scope){
        console.log("at home controller");
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.title = [
            {
                icon: "fa-building",
                name: "Manage Facitilites"
            }
        ];
        $scope.action = [
            {
                func : "ui-sref='facilities.create' " +
                        "has-permission='users.add_mfluser' ",
                class: "action-btn action-btn-info action-btn-md",
                color: "blue",
                tipmsg: "New User",
                icon: "fa-user-plus"
            },
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
    }]);
})(angular);
