(function () {
    "use strict";
    angular.module("mfl.users", [
        //3rd party stuff
        "ui.router",
        "ui.bootstrap",
        "ui.bootstrap.tpls",
        //our stuff
        "mfl.users.controllers",
        "mfl.users.routes",
        "mfl.users.wrapper",
        "mfl.common.directives",
        "mfl.common.filters"
    ]);
})();