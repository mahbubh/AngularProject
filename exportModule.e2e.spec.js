(function(describe, beforeAll, beforeEach, it, expect, browser, element, protractor, by) {
describe('Fund Selection page:', function() {
        describe('Fund Smart Search: ', function() {
            beforeAll(function() {
                browser.get(browser.params.APPLICATION_URL_PREFIX + '/.............');
                browser.findElement(by.id('fundSelectionTabItem')).click();
            });

            describe('When the user enters 500 into the smart search field, it', function() {
                it('should show all share classes of the 500 Index and S&P 500 funds', function() {
                    var searchField = element(by.css('#fundSmartSearch .vuiAutosuggestInput')),
                        items;

                    searchField.sendKeys('500');
                    items = element(by.id('fundSmartSearch')).all(by.css('.vuiAutosuggestItem'));

                    expect(items.count()).toBe(4);
                    expect(items.get(0).getInnerHtml()).toContain('SWPPX');
                    expect(items.get(1).getInnerHtml()).toContain('PREIX');
                    expect(items.get(2).getInnerHtml()).toContain('VFIAX');
                    expect(items.get(3).getInnerHtml()).toContain('VFINX');

                    // Clear field before next test runs
                    searchField.clear();
                });
            });

            describe('When the user enters vfinx into the smart search field, it', function() {
                it('should show the ............. 500 Index Fund Investor Shares', function() {
                    var searchField = element(by.css('#fundSmartSearch .vuiAutosuggestInput')),
                        items;

                    searchField.sendKeys('vfinx');
                    items = element(by.id('fundSmartSearch')).all(by.css('.vuiAutosuggestItem'));

                    expect(items.count()).toBe(1);
                    expect(items.get(0).getInnerHtml()).toContain('............. 500 Index Inv');

                    // Clear field before next test runs
                    searchField.clear();
                });
            });

            describe('When the user searches for external funds by entering "....." into the smart search field', function() {
                var fundSearchResults;
                beforeAll(function() {
                    var searchField = element(by.css('#fundSmartSearch .vuiAutosuggestInput'));
                    searchField.sendKeys('"....."');
                    fundSearchResults = element(by.id('fundSmartSearch')).all(by.css('.vuiAutosuggestItem'));
                });
                describe(', it', function() {
                    it('should show the ..... & Cox funds', function() {

                        expect(fundSearchResults.count()).toBe(5);
                        expect(fundSearchResults.get(0).getInnerHtml()).toContain('..... &amp; Cox Balanced');
                    });
                });
                describe('and clicked on the matching ..... & Cox Balanced fund search result, it', function() {
                    it('should add the ...... & Cox Balanced fund to the selected fund table', function() {

                        browser.actions().mouseDown(fundSearchResults.get(0)).perform();
                        browser.actions().mouseUp().perform();

                        expect(element(by.id('selectedRiskyFundsTable')).all(by.linkText('...... & Cox Balanced (......)')).count()).toEqual(1);
                        expect(browser.findElement(by.id('allocation_dodge_cox_balanced')).isDisplayed()).toEqual(true);
                    });
                });
            });
        });

        describe('When the user clicks on the ............. Short-Term Inflation-Protected Securities Index Fund Investor Shares fund from the funds list table, it', function() {
            it('should go to the ............. Short-Term Inflation-Protected Securities Index Fund Investor Shares page on the IAM site', function() {
                browser.get(browser.params.APPLICATION_URL_PREFIX + '/........');
                browser.findElement(by.id('fundSelectionTabItem')).click();
                browser.findElement(by.linkText('............. Shrt-Term Infl-Prot Sec Idx Inv (.........)')).click();

                expect(browser.driver.getCurrentUrl()).toBe('https://......................com:1443/us/funds/snapshot?FundId=1967&FundIntExt=INT');
            });
        });

        describe('Fund Filter Dropdown: ', function() {
            describe('When the user views the fund filter dropdown, it', function() {
                it('should contain 3 entries to filter by "All ............. Funds", "TDF Underlying Funds", and "PRD Approved Funds"', function() {
                    var fundListFilter,
                        menuItems;

                    browser.get(browser.params.APPLICATION_URL_PREFIX + '/.............');
                    browser.findElement(by.id('fundSelectionTabItem')).click();

                    fundListFilter = element(by.id('fundListSelection'));
                    menuItems = fundListFilter.all(by.css('.vuiMenuitem'));

                    expect(menuItems.count()).toEqual(3);
                    expect(menuItems.get(0).getInnerHtml()).toContain('All ............. funds');
                    expect(menuItems.get(1).getInnerHtml()).toContain('............. TDF underlying funds');
                    expect(menuItems.get(2).getInnerHtml()).toContain('PRD-approved non-............. funds');
                });
            });

            describe('When the user selects "PRD-approved non-............. funds" from the fund filter dropdown, it', function() {
                it('should display the list of PRD approved funds in the fund list section', function() {
                    var fundListFilter,
                        menuLabel,
                        menuItems,
                        funds;

                    fundListFilter = element(by.id('fundListSelection'));
                    menuLabel = fundListFilter.all(by.css('.vuiMenuLabel'));
                    menuItems = fundListFilter.all(by.css('.vuiMenuitem'));

                    menuLabel.click();
                    menuItems.get(2).click();

                    funds = element.all(by.repeater('fund in fundList'));
                    expect(funds.count()).toEqual(0);
                });
            });

            describe('When the user changes the filter to "TDF underlying funds, it"', function() {
                it('should update the fund list to display the TDF underlying funds ', function() {
                    var fundListFilter,
                        menuLabel,
                        menuItems,
                        funds;

                    fundListFilter = element(by.id('fundListSelection'));
                    menuLabel = fundListFilter.all(by.css('.vuiMenuLabel'));
                    menuItems = fundListFilter.all(by.css('.vuiMenuitem'));

                    menuLabel.click();
                    menuItems.get(1).click();

                    funds = element.all(by.repeater('fund in fundList'));
                    expect(funds.count()).toEqual(18);
                });
            });
        });
	});
}(angular));