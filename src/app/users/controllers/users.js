(function (angular, _) {
    "use strict";

    angular.module("mfl.users.controllers.users", [
        "mfl.auth.services",
        "mfl.users.services",
        "ui.router",
        "mfl.common.forms"
    ])

    .controller("mfl.users.controllers.user_delete",
        ["$scope", "$log", "$state", "$stateParams", "mfl.users.services.wrappers",
        function ($scope, $log, $state, $stateParams, wrappers) {
            $scope.title = [
                {
                    icon : "fa fa-trash",
                    name : "Delete User"
                }
            ];
            $scope.user_id = $stateParams.user_id;

            wrappers.users.get($scope.user_id)
                .success(function (data) {
                    $scope.user = data;
                })
                .error(function (data) {
                    $log.error(data);
                });

            $scope.remove = function () {
                wrappers.users.remove($scope.user_id)
                    .success(function () {
                        $state.go("users");
                    })
                    .error(function (data) {
                        $log.error(data);
                    });
            };
        }]
    )

    .controller("mfl.users.controllers.user_create", ["$scope",
        function ($scope) {
            $scope.title = [
                {
                    icon : "fa-plus-circle",
                    name : "New User"
                }
            ];
            $scope.action = [
                {
                    func : "onclick='window.history.back()'",
                    class: "action-btn action-btn-primary action-btn-md",
                    color: "blue",
                    tipmsg: "Go Back",
                    icon: "fa-arrow-left"
                }
            ];
        }
    ])

    .controller("mfl.users.controllers.user_create.basic",
        ["$scope", "$log", "$state", "mfl.users.services.wrappers",
        function ($scope, $log, $state, wrappers) {
            $scope.title = [
                {
                    icon : "fa-plus-circle",
                    name : "New User"
                }
            ];
            $scope.action = [
                {
                    func : "onclick='window.history.back()'",
                    class: "action-btn action-btn-primary action-btn-md",
                    color: "blue",
                    tipmsg: "Go Back",
                    icon: "fa-arrow-left"
                }
            ];
            $scope.save = function () {
                wrappers.users.create($scope.user)
                .success(function (data) {
                    $state.go("users.user_list.user_edit.basic", {user_id: data.id});
                })
                .error(function (data) {
                    $log.error(data);
                });
            };
        }]
    )

    .controller("mfl.users.controllers.user_edit",
        ["$scope", "$stateParams", "$log", "mfl.users.services.wrappers",
        function ($scope, $stateParams, $log, wrappers) {
            $scope.title = [
                {
                    icon: "fa-edit",
                    name: "Edit User"
                }
            ];
            $scope.action = [
                {
                    func : "ui-sref='users.user_list.user_delete({user_id: user.id})' " +
                           "requires-permission='users.delete_mfluser'",
                    class: "action-btn action-btn-danger action-btn-md",
                    color: "blue",
                    tipmsg: "Delete User",
                    icon: "fa-trash"
                },
                {
                    func : "onclick='window.history.back()'",
                    class: "action-btn action-btn-primary action-btn-md",
                    color: "blue",
                    tipmsg: "Go Back",
                    icon: "fa-arrow-left"
                }
            ];
            $scope.user_id = $stateParams.user_id;

            wrappers.users.get($scope.user_id)
                .success(function (data) {
                    $scope.user = data;
                })
                .error(function (data) {
                    $log.error(data);
                });
        }]
    )

    .controller("mfl.users.controllers.user_edit.basic",
        ["$scope", "$log", "mfl.common.forms.changes", "mfl.users.services.wrappers",
        function ($scope, $log, formChanges, wrappers) {

            $scope.save = function (frm) {
                var changes = formChanges.whatChanged(frm);

                if (! _.isEmpty(changes)) {
                    wrappers.users.update($scope.user_id, changes)
                    .success(function () {

                    })
                    .error(function (data) {
                        $log.error(data);
                    });
                }
            };
        }]
    )

    .controller("mfl.users.controllers.user_edit.contacts",
        ["$scope", "$log", "mfl.users.services.wrappers",
        function ($scope, $log, wrappers) {
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.contact = {
                contact_type: "",
                contact: ""
            };

            wrappers.contact_types.list()
                .success(function (data) {
                    $scope.contact_types = data.results;
                })
                .error(function (data) {
                    $log.error(data);
                });

            wrappers.user_contacts.filter({"user": $scope.user_id})
                .success(function(data) {
                    $scope.contacts = data.results;
                })
                .error(function (data) {
                    $log.error(data);
                });

            $scope.remove = function (obj) {
                obj.delete_spinner = true;
                wrappers.user_contacts.remove(obj.id)
                .success(function () {
                    wrappers.contacts.remove(obj.contact)
                    .success(function () {
                        $scope.contacts = _.without($scope.contacts, obj);
                        obj.delete_spinner = false;
                    })
                    .error(function (data) {
                        $log.error(data);
                        obj.delete_spinner = false;
                    });
                })
                .error(function (data) {
                    $log.error(data);
                    obj.delete_spinner = false;
                });
            };

            $scope.add = function () {
                $scope.spinner = true;
                wrappers.contacts.create({
                    "contact_type": $scope.contact.contact_type,
                    "contact": $scope.contact.contact
                })
                .success(function (data) {
                    wrappers.user_contacts.create({
                        "user": $scope.user_id,
                        "contact": data.id
                    })
                    .success(function (data) {
                        $scope.contacts.push(data);
                        $scope.contact = {
                            contact_type: "",
                            contact: ""
                        };
                        $scope.spinner = false;
                    })
                    .error(function (data) {
                        $log.error(data);
                        $scope.spinner = false;
                    });
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.spinner = false;
                });
            };
        }
    ])

    .controller("mfl.users.controllers.user_edit.groups",
        ["mfl.users.services.wrappers", "$log", "$scope", function (wrappers, $log, $scope) {
            wrappers.groups.filter({page_size: 100, ordering: "name"})
            .success(function (data) {
                $scope.groups = data.results;
            })
            .error(function (data) {
                $log.error(data);
            });
            $scope.new_grp = "";

            var updateGroups = function (new_grps) {
                $scope.spinner = true;
                var grps = _.map(new_grps, function (grp) {
                    return {"id": grp.id, "name": grp.name};
                });

                wrappers.users.update($scope.user_id, {"groups": grps})
                .success(function (data) {
                    $scope.user = data;
                    $scope.new_grp = "";
                    $scope.spinner = false;
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.spinner = false;
                });
            };

            $scope.add = function () {
                var grp = _.findWhere($scope.groups, {"id": parseInt($scope.new_grp, 10)});
                var update = angular.copy($scope.user.groups);
                update.push(grp);
                updateGroups(update);
            };

            $scope.remove = function (grp) {
                var update = _.without($scope.user.groups, grp);
                updateGroups(update);
            };
        }]
    )

    .controller("mfl.users.controllers.user_edit.counties",
        ["mfl.users.services.wrappers", "$log", "$scope", function (wrappers, $log, $scope) {
            wrappers.counties.filter({page_size: 50, ordering: "name"})
            .success(function (data) {
                $scope.counties = data.results;
            })
            .error(function (data) {
                $log.error(data);
            });
            wrappers.user_counties.filter({user: $scope.user_id})
            .success(function (data) {
                $scope.user_counties = data.results;
            })
            .error(function (data) {
                $log.error(data);
            });
            $scope.new_county = "";

            $scope.add = function (county_id) {
                $scope.spinner = true;
                var payload = {
                    "user": $scope.user_id,
                    "county": county_id
                };
                wrappers.user_counties.create(payload)
                .success(function (data) {
                    $scope.user_counties.push(data);
                    $scope.spinner = false;
                })
                .error(function (data) {
                    $log.error(data);
                    $scope.spinner = false;
                });
            };
            $scope.remove = function (user_county) {
                user_county.delete_spinner = true;
                wrappers.user_counties.remove(user_county.id)
                .success(function () {
                    $scope.user_counties = _.without($scope.user_counties, user_county);
                    user_county.delete_spinner = false;
                })
                .error(function (data) {
                    $log.error(data);
                    user_county.delete_spinner = false;
                });
            };
        }]
    )

    .controller("mfl.users.controllers.users", ["$scope", function ($scope) {
        $scope.test = "Users";
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.title = [
            {
                icon: "fa-user",
                name: "Manage users"
            }
        ];
        $scope.action = [
            {
                func : "ui-sref='users.user_list.user_create.basic' " +
                        "requires-permission='users.add_mfluser' ",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "New User",
                icon: "fa-plus"
            }
        ];
    }]);

})(angular, _);
