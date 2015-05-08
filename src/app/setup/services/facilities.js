"use strict";

(function(angular){
    angular.module("mfl.setup.facilities.wrapper", ["sil.api.wrapper"])
    .provider("facilityOwnerTypesApi", function(){
        var self = this;
        self.baseUrl = "api/facilities/owner_types";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    })

    .provider("facilityOwnersApi", function(){
        var self = this;
        self.baseUrl = "api/facilities/owners";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    })
    .provider("facilityJobTitlesApi", function(){
        var self = this;
        self.baseUrl = "api/facilities/job_titles";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    })
    .provider("facilityRegulatoryBodiesApi", function(){
        var self = this;
        self.baseUrl = "api/facilities/regulating_bodies";
        this.$get = ["api", function(api){
            return {
                baseUrl: self.baseUrl,
                api: api.setBaseUrl(this.baseUrl)
            };
        }];
    });
})(angular);
