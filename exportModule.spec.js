(function(angular) {
describe('Export Data Module Directive:', function() {
        var $compile,
            $scope,
            $window,
            $location,
            $rootScope,
            $templateCache,
            $httpBackend,
            URL_PREFIXES,
            retirementAgeHelperService,
            exportDataButton,
            exportData = '\"Some model\",\"Medium\",\"Medium\",\"45000\"',
            defaultGlidePath = {
                'characteristics': {
                    ...............
                },
                'byAgeData': [
                    {'age': 0,'totalEquityAllocation': 0},
                    {'age': 25, 'usEquityAllocation': 0.540, 'internationalEquityAllocation': 0.360, 'totalEquityAllocation': 0.900, 'usFixedAllocation': 0.070, 'internationalFixedAllocation': 0.030, 'totalFixedAllocation': 0.100, 'mTIPSAllocation': 0.000},
                    {'age': 35, 'usEquityAllocation': 0.540, 'internationalEquityAllocation': 0.360, 'totalEquityAllocation': 0.900, 'usFixedAllocation': 0.070, 'internationalFixedAllocation': 0.030, 'totalFixedAllocation': 0.100, 'mTIPSAllocation': 0.000},
                    {'age': 0,'totalEquityAllocation': 0}
                ]
            },
            modelGlidePath = {
                'characteristics': {
                    .............
                },
                'byAgeData': [
                    {........},
                    {...,......,......,.......,.........},
                    {...,......,......,.......,.........},
                    {...,......,......,.......,.........}
                ]
            },
            ageList = ['25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75'],
            yearsUntilRetirement = [-45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10],
            fundTargetDate = [2060, 2055, 2050, 2045, 2040, 2035, 2030, 2025, 2020, 2015, 2010, 'Income'],
            selectedShareClass = 'Inv',
            selectedShareClassExpenseRatios = ['0.18', '0.18', '0.18', '0.18', '0.18', '0.17', '0.17', '0.16', '0.16', '0.16', '0.16'],
            compileElement = function() {
                var element = angular.element('<div dca-export-data=""></div>');

                $compile(element)($scope);
                $scope.$digest();

                exportDataButton = element.find('#costComparisonExportDataButton');

                return element;
            };

        beforeEach(module('dcaTemplatesModule', 'exportDataModule'));
        beforeEach(inject(function($injector) {
            var exportDataTemplate;

            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            $window = $injector.get('$window');
            $location = $injector.get('$location');
            $templateCache = $injector.get('$templateCache');
            $httpBackend = $injector.get('$httpBackend');
            GlidepathData = $injector.get('GlidepathData');
            retirementAgeHelperService = $injector.get('retirementAgeHelper');
            URL_PREFIXES = $injector.get('URL_PREFIXES');

            exportDataTemplate = $templateCache.get('........./costcomparison/partials/exportData.html');
            $templateCache.put(URL_PREFIXES.WEB_RESOURCES + '/costcomparison/partials/exportData.html', exportDataTemplate);

            spyOn(GlidepathData, 'getDefaultGlidepath').andReturn(defaultGlidePath);
            spyOn(GlidepathData, 'getModelGlidepath').andReturn(modelGlidePath);
            spyOn(retirementAgeHelperService, 'getAgeList').andReturn(ageList);
                        
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('When the cost comparison page loads, it', function() {
            beforeEach(function() {
                compileElement();
            });

            it('should display the export button on the page', function() {
                expect(exportDataButton).toBeDefined();
            });
        });

        describe('When export button is clicked', function() {
            beforeEach(function() {
                compileElement();
            });
            describe('and the portfolio analytics data has been generated for the latest user inputs/selections', function() {
                describe(', it', function() {
                    beforeEach(function() {
                        CompetitorFundSeriesData.getCompetitorGlidepathSelection.andReturn(null);
                        $httpBackend.expectPOST(URL_PREFIXES.REST_SERVICES + '/export', $scope.exportDataRequest).respond(exportData);
                        $scope.exportData();
                    });
                    it('should call the REST service to create the CSV', function() {
                        $httpBackend.flush();
                    });

                describe('and retirement age is 65, it', function() {
                    beforeEach(function() {
                        $httpBackend.expectPOST(URL_PREFIXES.REST_SERVICES + '/export', $scope.exportDataRequest).respond(exportData);
                        spyOn(retirementAgeHelperService, 'getRetirementAge').andReturn(65);
                        $scope.exportData();
                    });
                    it('should send Cost Summary data to REST service to create CSV', function() {
                        var feeBreakdown;

                        $httpBackend.flush();
                        feeBreakdown = CostComparisonData.getFeeBreakdown();

                        expect($scope.exportDataRequest.costSummary).toBeDefined();
                        expect($scope.exportDataRequest.costSummary.yearsUntilRetirement).toEqual(yearsUntilRetirement);
                        expect($scope.exportDataRequest.costSummary.fundTargetDate).toEqual(fundTargetDate);
                        expect($scope.exportDataRequest.costSummary.feeBreakDown).toEqual(feeBreakdown);
                        expect($scope.exportDataRequest.costSummary.selectedFund).toEqual(selectedFunds);
                        expect($scope.exportDataRequest.costSummary.selectedShareClass).toEqual(selectedShareClass);
                        expect($scope.exportDataRequest.costSummary.selectedShareClassExpenseRatios).toEqual(selectedShareClassExpenseRatios);

                    });

                });
                describe('and retirement age is 70, it', function() {
                    beforeEach(function() {
                        $httpBackend.expectPOST(URL_PREFIXES.REST_SERVICES + '/export', $scope.exportDataRequest).respond(exportData);
                        spyOn(retirementAgeHelperService, 'getRetirementAge').andReturn(70);
                        $scope.exportData();
                    });
                    it('should send Cost Summary data to REST service to create CSV', function() {
                        var feeBreakdown;
                        $httpBackend.flush();
                        feeBreakdown = CostComparisonData.getFeeBreakdown();

                        expect($scope.exportDataRequest.costSummary).toBeDefined();
                        expect($scope.exportDataRequest.costSummary.yearsUntilRetirement).toEqual(yearsUntilRetirement);
                        expect($scope.exportDataRequest.costSummary.fundTargetDate).toEqual(fundTargetDate);
                        expect($scope.exportDataRequest.costSummary.feeBreakDown).toEqual(feeBreakdown);
                        expect($scope.exportDataRequest.costSummary.selectedFund).toEqual(selectedFunds);
                        expect($scope.exportDataRequest.costSummary.selectedShareClass).toEqual(selectedShareClass);
                        expect($scope.exportDataRequest.costSummary.selectedShareClassExpenseRatios).toEqual(selectedShareClassExpenseRatios);

                    });

                });

                describe('and the REST service call is successful, it', function() {
                    it('should NOT open the error message layer', function() {
                        $httpBackend.expectPOST(URL_PREFIXES.REST_SERVICES + '/export', $scope.exportDataRequest).respond(exportData);
                        $scope.exportData();
                        $httpBackend.flush();

                        expect($scope.isExportDataLoadFail).toEqual(false);
                    });
                });

                describe('and the browser supports blob, it', function() {
                    it('should create CSV', function() {
                        $httpBackend.expectPOST(URL_PREFIXES.REST_SERVICES + '/export', $scope.exportDataRequest).respond(defaultGlidePath);
                        $window.navigator.msSaveOrOpenBlob = angular.noop;
                        $scope.exportData();
                        $httpBackend.flush();
                    });
                });

                describe('and the browser does not support blob, it', function() {
                    it('should create CSV', function() {
                        $httpBackend.expectPOST(URL_PREFIXES.REST_SERVICES + '/export', $scope.exportDataRequest).respond(defaultGlidePath);
                        $window.navigator.msSaveOrOpenBlob = undefined;
                        $scope.exportData();
                        $httpBackend.flush();
                    });
                });

                describe('and the REST service call failed, it', function() {
                    it('should open the error message layer', function() {
                        $httpBackend.expectPOST(URL_PREFIXES.REST_SERVICES + '/export', $scope.exportDataRequest).respond(404, '');
                        $scope.exportData();
                        $httpBackend.flush();

                        expect($scope.isExportDataLoadFail).toEqual(true);
                    });
                });
            });

            describe('and the portfolio analytics data has NOT been generated for the latest user inputs/selections', function() {
                it('should open the portfolio analytics not generated message layer', function() {
                    .................
                    $scope.exportData();
                    expect($scope.isOpenPortfolioAnalyticsMessageLayer).toEqual(true);
                });
            });
        });

        describe('When portfolio analytics not generated message layer is displayed', function() {
            beforeEach(function() {
                compileElement();
                ............
                $scope.exportData();
            });
            describe('and the RETURN TO SUB_ASSET SELECTION button is clicked, it', function() {
                it('should navigate to sub asset page', function() {
                    spyOn($location, 'path').andCallFake(angular.noop);
                    $scope.goToSubAssetSelection();
                    expect($location.path).toHaveBeenCalledWith('/subasset');
                });
            });

            describe('and the EXPORT button is clicked, it', function() {
                beforeEach(function() {
                    $httpBackend.expectPOST(URL_PREFIXES.REST_SERVICES + '/export', $scope.exportDataRequest).respond(exportData);
                    $scope.generateCsv();
                });
                it('should close the layer', function() {
                    $httpBackend.flush();
                    expect($scope.isOpenPortfolioAnalyticsMessageLayer).toEqual(false);
                });
                it('should close the layer and call REST service to generate Csv', function() {
                    $httpBackend.flush();
                });
            });
        });

        describe('When OK button is clicked on the export error message layer, it', function() {
            beforeEach(function() {
                compileElement();
                $httpBackend.expectPOST(URL_PREFIXES.REST_SERVICES + '/export', $scope.exportDataRequest).respond(500, '');
                $scope.exportData();
                $httpBackend.flush();
            });
            it('should close the error message layer', function() {
                $scope.closeDataLoadError();
                expect($scope.isExportDataLoadFail).toEqual(false);
            });
        });
    });
}(angular));