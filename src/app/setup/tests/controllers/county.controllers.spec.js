(function(_){
    "use strict";
    describe("county controllers test suite", function(){
        var createController, $scope, $stateParams, $httpBackend, $state, adminApi;
        var formService, SERVER_URL;

        beforeEach(function(){
            module("mflAdminApp");
            inject(["$rootScope", "$controller", "$stateParams", "$httpBackend",
                   "$state", "adminApi","mfl.common.forms.changes","SERVER_URL",
                   function($rootScope, $controller,_$stateParams,
                    _$httpBackend, _$state, _adminApi, frm, _SERVER_URL){
                $scope = $rootScope.$new();
                SERVER_URL = _SERVER_URL;
                $httpBackend = _$httpBackend;
                $stateParams = _$stateParams;
                $state = _$state;
                adminApi = _adminApi;
                formService = frm;
                var data = {
                    $scope: $scope
                };
                createController = function(name, params){
                    return $controller("mfl.setup.controller.county."+name, _.extend(data, params));

                };
            }]);
        });

        afterEach(function(){
            $httpBackend.verifyNoOutstandingRequest();
        });

        it("should have `mfl.setup.controller.county.list` defined",
           function(){
                var ctrl = createController("list", {});
                expect(ctrl).toBeDefined();
            });
        it("should have `mfl.setup.controller.county.create` defined",
           function(){
                var ctrl = createController("create", {});
                expect(ctrl).toBeDefined();
            });
        it("should have post new county with success",
            inject(["$rootScope",function($rootScope){
                var data = {
                    "$scope": $rootScope.$new()
                };
                var frm = {
                    name:"NAIROBI",
                    code:47
                };
                $httpBackend.expectPOST(SERVER_URL+"api/common/counties/")
                .respond(201);
                createController("create",data);
                data.$scope.saveFrm(frm);
                $httpBackend.flush();
            }])
        );
        it("should have post new county but fail",
            inject(["$rootScope",function($rootScope){
                var data = {
                    "$scope": $rootScope.$new()
                };
                var frm = {
                    name:"NAIROBI",
                    code:47
                };
                $httpBackend.expectPOST(SERVER_URL+"api/common/counties/")
                .respond(500);
                createController("create",data);
                data.$scope.saveFrm(frm);
                $httpBackend.flush();
            }])
        );
        it("should have patch county with form changes succeeded patch",
            inject(["$rootScope","mfl.common.forms.changes",function($rootScope,formChanges){
                var data = {
                    "$scope": $rootScope.$new(),
                    "mfl.common.forms.changes" : formChanges,
                    "$stateParams": {count_id: 1}
                };
                var frm = {
                    name:"NAIROBI",
                    code:47
                };
                $httpBackend.expectGET(SERVER_URL+"api/common/counties/1/")
                .respond(200);
                createController("view",data);
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingRequest();
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.resetExpectations();
                spyOn(formChanges, "whatChanged").andReturn({name:"NAIROBI"});
                $httpBackend.expectPATCH(SERVER_URL+"api/common/counties/1/")
                .respond(200, {"id": 1});
                data.$scope.saveFrm(frm);
                $httpBackend.flush();
            }])
        );
        it("should have patch county with form changes failed patch",
            inject(["$rootScope","mfl.common.forms.changes",function($rootScope,formChanges){
                var data = {
                    "$scope": $rootScope.$new(),
                    "mfl.common.forms.changes" : formChanges,
                    "$stateParams": {count_id: 1}
                };
                var frm = {
                    name:"NAIROBI",
                    code:47
                };
                $httpBackend.expectGET(SERVER_URL+"api/common/counties/1/")
                .respond(200);
                createController("view",data);
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingRequest();
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.resetExpectations();
                spyOn(formChanges, "whatChanged").andReturn({name:"NAIROBI"});
                $httpBackend.expectPATCH(SERVER_URL+"api/common/counties/1/")
                .respond(500);
                data.$scope.saveFrm(frm);
                $httpBackend.flush();
            }])
        );
        it("should have patch county without form changes",
            inject(["$rootScope","mfl.common.forms.changes",function($rootScope,formChanges){
                var data = {
                    "$scope": $rootScope.$new(),
                    "mfl.common.forms.changes" : formChanges,
                    "$stateParams": {count_id: 1}
                };
                var frm = {
                    name:"NAIROBI",
                    code:47
                };
                $httpBackend.expectGET(SERVER_URL+"api/common/counties/1/")
                .respond(200);
                createController("view",data);
                $httpBackend.flush();
                $httpBackend.verifyNoOutstandingRequest();
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.resetExpectations();
                spyOn(formChanges, "whatChanged").andReturn({});
                data.$scope.saveFrm(frm);
            }])
        );

    });
})(window._);
