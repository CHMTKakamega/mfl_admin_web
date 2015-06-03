(function (angular) {
    "use strict";

    angular.module("mfl.service_mgmt.controllers.options", [
        "mfl.service_mgmt.services",
        "ui.router",
        "mfl.common.forms"
    ])

    .controller("mfl.service_mgmt.controllers.option_list", [angular.noop])

    .controller("mfl.service_mgmt.controllers.option_edit",
        ["$scope", "$state", "$stateParams", "$log",
        "mfl.service_mgmt.wrappers", "mfl.common.forms.changes",
        function ($scope, $state, $stateParams, $log, wrappers, forms) {
            $scope.option_id = $stateParams.option_id;
            $scope.option_types = wrappers.OPTION_TYPES;

            wrappers.options.get($scope.option_id).success(function (data) {
                $scope.option = data;
            }).error(function (data) {
                $log.warn(data);
            });

            $scope.save = function (frm) {
                var changed = forms.whatChanged(frm);

                if (! _.isEmpty(changed)) {
                    wrappers.options.update($scope.option_id, changed)
                        .success(function () {
                            $state.go(
                                "service_mgmt.option_list",
                                {"option_id": $scope.option_id}
                            );
                        });
                }
            };
        }
    ])

    .controller("mfl.service_mgmt.controllers.option_create",
        ["$scope", "$state", "$stateParams", "$log",
        "mfl.service_mgmt.wrappers",
        function ($scope, $state, $stateParams, $log, wrappers) {
            $scope.option = wrappers.newOption();
            $scope.option_types = wrappers.OPTION_TYPES;

            $scope.save = function () {
                wrappers.options.create($scope.option)
                .success(function (data) {
                    $state.go(
                        "service_mgmt.option_list",
                        {"option_id": data.id}
                    );
                });
            };
        }
    ])

    .controller("mfl.service_mgmt.controllers.option_delete",
        ["$scope", "$state", "$stateParams", "$log", "mfl.service_mgmt.wrappers",
        function ($scope, $state, $stateParams, $log, wrappers) {
            $scope.option_id = $stateParams.option_id;
            wrappers.options.get($scope.option_id).success(function (data) {
                $scope.option = data;
            }).error(function (data) {
                $log.warn(data);
            });

            $scope.save = function () {
                wrappers.options.remove($scope.option_id)
                .success(function () {
                    $state.go("service_mgmt.option_list");
                }).error(function (data) {
                    $log.warn(data);
                });
            };
        }
    ]);

})(angular);