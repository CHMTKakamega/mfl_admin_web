(function (angular) {
    "use strict";

    angular.module("mfl.users.services", ["api.wrapper"])

    .service("mfl.users.services.wrappers", ["api", function (api) {
        this.groups = api.setBaseUrl("api/users/groups/");
        this.permissions = api.setBaseUrl("api/users/permissions/");
        this.users = api.setBaseUrl("api/users/");
        this.contact_types = api.setBaseUrl("api/common/contact_types/");
        this.user_contacts = api.setBaseUrl("api/common/user_contacts/");
        this.user_counties = api.setBaseUrl("api/common/user_counties/");
        this.counties = api.setBaseUrl("api/common/counties/");
        this.constituencies = api.setBaseUrl("api/common/constituencies/");
        this.user_constituencies = api.setBaseUrl("api/common/user_constituencies/");
        this.contacts = api.setBaseUrl("api/common/contacts/");
        this.regulatory_bodies = api.setBaseUrl("api/facilities/regulating_bodies/");
        this.regulatory_body_users = api.setBaseUrl("api/facilities/regulatory_body_users/");
    }]);

})(angular);
