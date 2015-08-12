(function (angular, c3, _) {

    "use strict";

    angular.module("mfl.dashboard.controllers", ["mfl.dashboard.wrapper"])

    .controller("mfl.dashboard.content", ["$scope", "$filter", "dashboardApi",
        "mfl.auth.services.login",
        function ($scope, $filter, dashboardApi, loginService) {
            $scope.title = {
                icon: "fa-dashboard",
                name: "Dashboard"
            };
            $scope.user = loginService.getUser();
            $scope.chart = null;
            $scope.spinner = true;
            $scope.county = false;
            var c3_generate = function (_payload){
                c3.generate(_payload);
                $scope.loading = false;
            };
            var updateRecent = function (params) {
                $scope.recent_spinner = true;
                dashboardApi.api.filter(params)
                .success(function(data) {
                    $scope.summary = data;
                    $scope.recent_spinner = false;
                }).error(function (err) {
                    $scope.err = err;
                    $scope.recent_spinner = false;
                });
            };
            $scope.weekly = function () {
                updateRecent({"weekly":"True"});
            };
            $scope.monthly = function () {
                updateRecent({"monthly":"True"});
            };
            $scope.quarterly = function () {
                updateRecent({"quarterly":"True"});
            };
            $scope.showGraph = function(_data) {
                //owner chart
                var owners_chart = function (_dt) {
                    var _list = [];

                    angular.forEach(_dt.owner_types, function (item) {
                        item.name = $filter("uppercase")(item.name);
                        var _item = [item.name, item.count];
                        _list[_list.length] = _item;
                    });

                    var obj = {
                        bindto: "#chartowners",
                        data: {
                            columns: _list,
                            type : "pie"
                        },
                        empty: {
                            label:{
                                text: "no data"
                            }
                        }
                    };
                    return obj;
                };

                var facility_chart = function(_dt) {
                    var _list = [];
                    var _facility_names = [];
                    angular.forEach(_dt.types_summary, function (item) {
                        _list.push(item.count);
                        _facility_names.push(item.name);
                    });
                    _list.unshift("Facility");

                    var obj = {
                        bindto: "#chartfacility",
                        data: {
                            columns: [
                                _list
                            ],
                            bar: {
                                width: 10
                            },
                            type : "bar",
                            color: function () {
                                return "#4caf50";
                            },
                            empty: {
                                label:{
                                    text: "Sorry, data is unavailable"
                                }
                            }
                        },
                        tooltip: {
                            grouped: false
                        },
                        axis: {
                            x: {
                                type: "categorized",
                                categories: _facility_names,
                                tick: {
                                    rotate: -30,//rotates graph labels
                                    multiline: true
                                },
                                height: 130
                            },
                            y: {
                                label: {
                                    text: "Facility count",
                                    position: "outer-middle"
                                }
                            }

                        }
                    };
                    return obj;
                };
                var top_ten = function (_dt) {
                    var _list = [];
                    var _names_list = [];

                    if(!_.isEmpty(_dt.county_summary)) {
                        $scope.county = true;
                        angular.forEach(_dt.county_summary, function (item) {
                            _list.push(item.count);
                            _names_list.push(item.name);
                        });
                        _list.unshift("county");
                    }
                    if(!_.isEmpty(_dt.constituencies_summary)) {
                        $scope.constituency = true;
                        angular.forEach(_dt.constituencies_summary, function (item) {
                            _list.push(item.count);
                            _names_list.push(item.name);
                        });
                        _list.unshift("constituency");
                    }
                    if(!_.isEmpty(_dt.wards_summary)) {
                        $scope.ward = true;
                        angular.forEach(_dt.wards_summary, function (item) {
                            _list.push(item.count);
                            _names_list.push(item.name);
                        });
                        _list.unshift("wards");
                    }
                    var obj = {
                        bindto: "#facilitybar",
                        data: {
                            columns:[
                                _list
                            ],
                            bar: {
                                width: 10
                            },
                            type : "bar",
                            color: function () {
                                return "#03a9f4";
                            },
                            empty: {
                                label:{
                                    text: "Sorry, data is unavailable"
                                }
                            }
                        },
                        axis: {
                            x: {
                                type: "categorized",
                                categories: _names_list,
                                tick: {
                                    rotate: -30,//rotates graph labels
                                    multiline: false
                                },
                                height: 150
                            },
                            y: {
                                label: {
                                    text: "Facility Count",
                                    position: "outer-middle"
                                }
                            }

                        }
                    };
                    return obj;
                };

                c3_generate(owners_chart(_data));
                c3_generate(facility_chart(_data));
                c3_generate(top_ten(_data));
            };

            //dashboardApi
            dashboardApi.api.list()
                .success(function (data) {
                    $scope.spinner = false;
                    $scope.summary = data;
                    $scope.loading = true;
                    $scope.showGraph(data);
                })
                .error(function (err) {
                    $scope.spinner = false;
                    $scope.loading = false;
                    $scope.chart_err = err.error;
                });
        }
    ]);

})(window.angular, window.c3, window._);
