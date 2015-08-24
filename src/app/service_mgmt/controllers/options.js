(function (angular, _) {
    "use strict";

    angular.module("mfl.service_mgmt.controllers.options", [
        "mfl.service_mgmt.services",
        "ui.router",
        "mfl.common.forms"
    ])

    .controller("mfl.service_mgmt.controllers.option_group_list", ["$scope",
        function ($scope) {
            $scope.filters = {
                "fields": "id,name"
            };
        }
    ])

    .controller("mfl.service_mgmt.controllers.option_group_create", ["$scope",
        "$stateParams", "mfl.service_mgmt.wrappers",
        "mfl.common.forms.changes", "$state",
        function ($scope, $stateParams, wrappers, forms, $state) {
            $scope.option_group_id = $stateParams.option_group_id;
            $scope.edit_view = $scope.option_group_id ? true : false;
            $scope.filters = {group:$scope.option_group_id};
            if($scope.edit_view) {
                wrappers.option_groups.get($scope.option_group_id).success(function (data) {
                    $scope.option_group = data;
                }).error(function (data) {
                    $scope.errors = data;
                });
            }
            $scope.addOption = function () {
                $scope.option_group.options.push({
                    option_type : "",
                    display_text : "",
                    value : ""
                });
            };
            $scope.removeOption = function (obj) {
                if(_.isUndefined(obj.id)) {
                    $scope.option_group.options =
                        _.without($scope.option_group.options, obj);
                }
            };
            $scope.option_types = wrappers.OPTION_TYPES;
            $scope.save = function (frm) {
                var changed = forms.whatChanged(frm);
                if(!$scope.edit_view){
                    wrappers.option_groups.create($scope.option_group)
                    .success(function () {
                        $state.go( "service_mgmt.option_groups_list",
                            {reload: true});
                    })
                    .error(function (data) {
                        $scope.errors = data;
                    });
                }else{
                    if (! _.isEmpty(changed)) {
                        wrappers.option_groups.update($scope.option_group_id, changed)
                            .success(function () {
                                $state.go(
                                    "service_mgmt.option_groups_list",
                                    {reload: true});
                            })
                            .error(function (data) {
                                $scope.errors = data;
                            });
                    }
                }
            };
            $scope.remove = function () {
                wrappers.option_groups.remove($scope.option_group_id).success(function(){
                    $state.go("service_mgmt.option_groups_list",{reload:true});
                }).error(function(data){
                    $scope.errors = data;
                });
            };
            $scope.cancel = function () {
                $state.go("service_mgmt.option_groups_list.option_group_edit",
                    {option_group_id : $scope.option_group_id});
            };
        }
    ])

    .controller("mfl.service_mgmt.controllers.option_list", ["$scope", function ($scope) {
        $scope.filters = {
            "fields": "id,display_text,value,is_exclusive_option,option_type"
        };
    }])

    .controller("mfl.service_mgmt.controllers.option_edit",
        ["$scope", "$state", "$stateParams", "$log",
        "mfl.service_mgmt.wrappers", "mfl.common.forms.changes",
        function ($scope, $state, $stateParams, $log, wrappers, forms) {
            $scope.option_id = $stateParams.option_id;
            $scope.option_types = wrappers.OPTION_TYPES;
            $scope.wrapper = wrappers.options;
            wrappers.option_groups.filter({page_size: 1000}).success(function (data) {
                $scope.option_groups = data.results;
            }).error(function (data) {
                $scope.errors = data;
            });
            wrappers.options.get($scope.option_id).success(function (data) {
                $scope.option = data;
                $scope.deleteText = $scope.option.display_text;
            }).error(function (data) {
                $log.warn(data);
            });
            $scope.edit_view = true;
            $scope.save = function (frm) {
                var changed = forms.whatChanged(frm);

                if (! _.isEmpty(changed)) {
                    wrappers.options.update($scope.option_id, changed)
                        .success(function () {
                            $state.go(
                                "service_mgmt.option_list",
                                {"option_id": $scope.option_id},
                                {reload: true}
                            );
                        });
                }
            };
            $scope.remove = function () {
                wrappers.options.remove($scope.option_id).success(function(){
                    $state.go("service_mgmt.option_list",{},{reload:true});
                }).error(function(error){
                    $log.warn(error);
                });
            };
            $scope.cancel = function () {
                $state.go("service_mgmt.option_list.option_edit");
            };
        }
    ])

    .controller("mfl.service_mgmt.controllers.option_create",
        ["$scope", "$state", "$stateParams", "$log",
        "mfl.service_mgmt.wrappers",
        function ($scope, $state, $stateParams, $log, wrappers) {
            $scope.option = wrappers.newOption();
            $scope.option_types = wrappers.OPTION_TYPES;
            wrappers.option_groups.filter({page_size: 1000}).success(function (data) {
                $scope.option_groups = data.results;
            }).error(function (data) {
                $scope.errors = data;
            });
            $scope.save = function () {
                wrappers.options.create($scope.option)
                .success(function (data) {
                    $state.go(
                        "service_mgmt.option_list",
                        {"option_id": data.id},
                        {reload: true}
                    );
                });
            };
        }
    ]);

})(window.angular, window._);
