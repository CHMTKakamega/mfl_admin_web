(function () {
    "use strict";

    describe("mflAdminApp scenario tests for facility owners:", function() {

        //variable required in test
        var getRandomString = function (characterLength) {
            var randomText = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < characterLength; i++){
                randomText += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return randomText;
        };
        var facilityOwner = getRandomString(25);

        it("should log in as superuser and load the dashboard", function() {
            //test variables
            var email, password, loginButton;

            //navigation
            browser.get("/");

            //setup interactions
            email = element(by.name("email"));
            password = element(by.name("password"));
            loginButton = element(by.id("login_btn"));

            //interations
            email.clear().then(function () {
                email.sendKeys("10000");
            });
            password.clear().then(function () {
                password.sendKeys("password1");
            });
            loginButton.click();
            browser.ignoreSynchronization = true;
            browser.driver.sleep(1000);
            browser.waitForAngular();

            expect(element(by.linkText("Home")).isPresent()).toBe(true);
        });

        //Creating without ability to delete hinders test from being included
        it("should open up new facility owner screen and save facility owner",
        function() {
            //variables
            var facilityOwner_input_name,
                facilityOwner_save_btn;

            //navigation
            browser.get("/#/setup/facility_owners/create");
//            browser.waitForAngular(); //navigation to create
            browser.driver.sleep(1000);

            //interaction setup
            facilityOwner_input_name = element(by.name("name"));
            element(by.tagName("select"))
                .element(by.cssContainingText("option", "Faith Based Organization")).click();

            facilityOwner_save_btn = element(by.buttonText("Save"));

            //interations
            facilityOwner_input_name.sendKeys(facilityOwner);
            facilityOwner_save_btn.click(); //saves facilityOwner
            browser.driver.sleep(1000);
            browser.waitForAngular(); //navigation to list page

            //expectations
            expect(browser.getLocationAbsUrl()).toEqual("/setup/facility_owners");
        });

        it("should find created facilityOwner in the list generated", function() {
            //variables
            var facilityOwnerName;

            //navigation
            browser.get("/#/setup/facility_owners");
            browser.driver.sleep(1000);
            browser.waitForAngular(); //navigation to list page

            //interaction setup
            facilityOwnerName = element(by.repeater("owner in facilityOwners")
                .row(0).column("owner.name"));

            //expectations
            expect(facilityOwnerName.getText()).toEqual(facilityOwner);
        });

        it("should go to edit view of created facility owner", function() {
            //variables
            var facilityOwnerRow, view_btn, facilityOwner_input_name;

            //interation setup
            facilityOwnerRow = element(by.repeater("owner in facilityOwners").row(0));
            view_btn = facilityOwnerRow.element(by.cssContainingText(".btn","View"));

            //interaction
            view_btn.click();
            browser.driver.sleep(1000);
            browser.waitForAngular();  //navigation to detail page

            //expectations
            facilityOwner_input_name = element(by.name("name"));
            facilityOwner_input_name.getAttribute("value").then(function (text) {
                expect(text).toEqual(facilityOwner);
            });
        });

        it("should edit facility owner, save and check if updated", function() {
            //variables
            var facilityOwner_input_name, facilityOwner_textarea_desc,
                facilityOwner_save_btn,facilityOwnerNameEl;

            //setup interaction
            facilityOwner_input_name = element(by.name("name"));
            facilityOwner_textarea_desc = element(by.name("description"));
            facilityOwner_save_btn = element(by.buttonText("Save"));
            element(by.tagName("select"))
                .element(by.cssContainingText("option", "Ministry of Health")).click();
            
            facilityOwner_save_btn = element(by.buttonText("Save"));

            //interations
            facilityOwner_input_name.clear().then(function () {
                facilityOwner_input_name.sendKeys(facilityOwner);
            });
            expect(facilityOwner_save_btn.getText()).toEqual("Save");
            facilityOwner_save_btn.click();
            browser.driver.sleep(1000);
            browser.waitForAngular();//navigates to list page
            
            facilityOwnerNameEl = element.all(by.repeater("owner in facilityOwners")
                                             .row(0).column("owner.name"));
            expect(facilityOwnerNameEl.getText()).toEqual([facilityOwner]);
        });

        //Only to be added if deleted fields can be recreated
        it("should delete facility owner from edit view",function () {
            var facilityOwner_del_btn,view_btn,del_btn,facilityOwnerRow;

            //navigation
            browser.get("/#/setup/facility_owners");
            browser.driver.sleep(1500);
            browser.waitForAngular(); //navigation to list page

            //interation setup
            facilityOwnerRow = element(by.repeater("owner in facilityOwners").row(0));
            view_btn = facilityOwnerRow.element(by.cssContainingText(".btn","View"));

            //interaction
            view_btn.click();
            browser.driver.sleep(1000);
            browser.waitForAngular();  //navigation to detail

            //interaction setup
            facilityOwner_del_btn = element(by.cssContainingText(".btn-danger","Delete"));

            //interaction
            facilityOwner_del_btn.click();
            browser.waitForAngular(); //navigation to delete page

            del_btn = element(by.id("del_btn"));
            del_btn.click();
            browser.driver.sleep(1500);
            browser.waitForAngular();//goes back to list page

            //expectations
            expect(browser.getLocationAbsUrl()).toEqual("/setup/facility_owners");
        });

        it("logout user after tests",function () {
            //variables
            var title;
            browser.get("/#/logout");
            browser.driver.sleep(1000);
            browser.waitForAngular();//goes back to login page

            //expectations
            title = element(by.css("h2"));
            expect(title.getText()).toEqual("Master Facility List V 2.0");
        });
    });
})();