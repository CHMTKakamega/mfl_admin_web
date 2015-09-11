(function(angular){
    "use strict";

    angular.module("mfl.facility_mgmt.controllers.list", [])

    .controller("mfl.facility_mgmt.controllers.facility_list",
        ["$scope", function ($scope) {
            $scope.title = {
                "name": "All Facilities",
                "icon": "fa-building"
            };
            $scope.filters = {
                "rejected": false,
                "closed": false,
                "fields": "id,code,name,facility_type_name,owner_name,county," +
                          "sub_county,constituency,ward_name,updated,operation_status_name"
            };
            $scope.action = [
                {
                    func : "ui-sref='facilities.facility_create({furthest : 1})'" +
                           "requires-permission='facilities.add_facility'",
                    class: "btn btn-primary",
                    tipmsg: "Add Facility",
                    icon: "",
                    wording : " Add Facility"
                }
            ];
        }]
    )

    .controller("mfl.facility_mgmt.controllers.facility_approve_list",
        ["$scope", function ($scope) {
            $scope.title = { "name": "Approved Facilities", "icon": "fa-building" };
            $scope.filters = {
                "approved": true,
                "rejected": false,
                "fields": "id,code,name,facility_type_name,owner_name,county," +
                          "sub_county,constituency,ward_name,updated," +
                          "operation_status_name,date_requested,date_approved"
            };
        }]
    );

})(window.angular);
