(function(angular,_){
    "use strict";

    angular.module("mfl.chul.controllers.approve", ["angular-toasty"])

    .controller("mfl.chul.controllers.approve_reject", ["$scope",
        "mfl.chul.services.wrappers", "$stateParams","$state","toasty",
        function ($scope, wrappers, $stateParams,$state,toasty){
            $scope.spinner = true;
            $scope.wrapper = wrappers.chuls;
            wrappers.chuls.get($stateParams.unit_id)
            .success(function (data) {
                $scope.unit = data;
                $scope.approveChuUpdate = function (approve) {
                    if(approve=== true){
                        $scope.approval = {
                            is_approved: true
                        };
                    } else {
                        $scope.approval = {
                            is_rejected: true
                        };
                    }
                    wrappers.chuls_updates.update($scope.unit.latest_update,$scope.approval)
                    .success(function () {
                        if(approve === true){
                            toasty.success({
                                title: "Community Unit Update",
                                msg: "Community Unit update successfully updated"
                            });
                        } else {
                            toasty.success({
                                title: "Community Unit Update",
                                msg: "Community Unit update successfully rejected"
                            });
                        }
                        $state.go("chu_pending_approvals");
                    })
                    .error(function (error) {
                        $scope.alert =  error;
                    });
                };
                $scope.updates_empty = _.isEmpty(data.pending_updates);
                //checks if chul has been approved/rejected at least once
                $scope.approve_reject = $scope.unit.is_approved || $scope.unit.is_rejected;
                //status of approval
                $scope.approved = $scope.unit.is_approved;
                //status of rejection
                $scope.rejected = $scope.unit.is_rejected;
                $scope.spinner = false;
            })
            .error(function (data) {
                $scope.spinner = false;
                $scope.error = data;
            });
            $scope.approveChu = function (status,comment) {
                if(status === true){
                    $scope.post = {
                        is_approved: true,
                        approval_comment: comment,
                        is_rejected: false
                    };
                } else{
                    $scope.post = {
                        is_rejected: true,
                        rejection_reason: comment,
                        is_approved: false
                    };
                }
                wrappers.chuls.update($stateParams.unit_id,$scope.post)
                .success(function (data) {
                    $scope.unit = data;
                    $scope.spinner = false;
                    if(status === true){
                        toasty.success({
                            title: "Community Unit Approval",
                            msg: "Community Unit successfully approved"
                        });
                        $state.go("chu_approve_list");
                    } else {
                        toasty.success({
                            title: "Community Unit Rejection",
                            msg: "Community Unit successfully rejected"
                        });
                        $state.go("chu_reject_list");
                    }
                })
                .error(function (data) {
                    $scope.spinner = false;
                    $scope.error = data;
                });
            };
        }]
    );

})(window.angular, window._);
