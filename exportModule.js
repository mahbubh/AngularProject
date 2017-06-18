(function(angular) {
angular.module('exportDataModule', [ ........,'retirementAgeHelperModule',..........])
        .directive('dcaExportData', ['$window', '$http', '$location', 'URL_PREFIXES', '............', 'retirementAgeHelper', '............',
            function($window, $http, $location, URL_PREFIXES, ........., retirementAgeHelper, ..............) {
            return {
                templateUrl: URL_PREFIXES.WEB_RESOURCES + '/costcomparison/partials/exportData.html',
                link: function(scope, element, attrs) {
                    var populateExportDataRequest = function() {
                        var startIndex = retirementAgeHelper.getRetirementAge() === 65 ? (1) : 0,
                            defaultGlidepath = GlidepathData.getDefaultGlidepath(),
                            modelGlidepath = GlidepathData.getModelGlidepath(),
                            allocationStyleWeightDifferencesByAge = angular.copy(FundSelectionData.getAllocationStyleWeightDifferencesByAge()),
                            costSummary,
                            costSummaryFeeBreakdown,
                            generateCostSummaryData = function(start) {
                                costSummaryFeeBreakdown = CostComparisonData.getFeeBreakdown().slice(start, CostComparisonData.getFeeBreakdown().length);
                                costSummary = {
                                    yearsUntilRetirement: retirementAgeHelper.getYearsUntilRetirementData().ageList,
                                    fundTargetDate: retirementAgeHelper.getYearsUntilRetirementData().fundName,
                                    feeBreakDown: costSummaryFeeBreakdown,
                                    selectedShareClass: CostComparisonData.getCompareToTdfShareClassName(),
                                    selectedShareClassExpenseRatios: CostComparisonData.getSelectedShareClassExpenseRatios()
                                };
                                return costSummary;
                            };

                        scope.exportDataRequest = {};
                        scope.exportDataRequest.defaultGlidepath = defaultGlidepath;
                        scope.exportDataRequest.modelGlidepath = modelGlidepath;
                        scope.exportDataRequest.competitorSeries = angular.copy(CompetitorFundSeriesData.getCompetitorGlidepathSelection());
                        if('Generate' !== SubAssetData.getPortfolioAnalyticsAction()) {
                            scope.exportDataRequest.portfolioAnalytics = SubAssetData.getPortfolioAnalyticsServiceData();
                        }
                        scope.exportDataRequest.ageList = retirementAgeHelper.getAgeList();
                        scope.exportDataRequest.costSummary = generateCostSummaryData(startIndex);
                        if(SubAssetData.getSubAssetDefaultDataLoadFailedStatus()) {
                            allocationStyleWeightDifferencesByAge.comparedToVanguard = [];
                        }
                        scope.exportDataRequest.allocationStyleWeightDifferencesByAge = allocationStyleWeightDifferencesByAge;
                    };

                    scope.exportData = function() {
                        if('Generate' === SubAssetData.getPortfolioAnalyticsAction()) {
                            scope.isOpenPortfolioAnalyticsMessageLayer = true;
                        } else {
                            scope.generateCsv();
                        }
                    };
                    scope.generateCsv = function() {
                        scope.isOpenPortfolioAnalyticsMessageLayer = false;
                        populateExportDataRequest();
                        $http.post(URL_PREFIXES.REST_SERVICES + '/export', scope.exportDataRequest).success(function(data, status) {
                            var blob, anchor,
                                clickEvent = document.createEvent('MouseEvents');
                            clickEvent.initEvent('click', true, true );

                            if ($window.navigator.msSaveOrOpenBlob) {
                                blob = new Blob([data]);
                                $window.navigator.msSaveOrOpenBlob(blob, 'CustomTargetDateFund.csv');
                            }
                            else {
                                anchor = angular.element('<a/>');
                                anchor.attr({
                                    href: 'data:attachment/csv;charset=utf-8,' + encodeURIComponent(data),
                                    download: 'CustomTargetDateFund.csv'
                                })[0].dispatchEvent(clickEvent);
                                anchor.remove();
                            }
                            scope.isExportDataLoadFail = false;
                        }).error(function(error) {
                            scope.isExportDataLoadFail = true;
                        });

                    };
                    scope.goToSubAssetSelection = function() {
                        $location.path('/subasset');
                    };
                    scope.closeDataLoadError = function() {
                        scope.isExportDataLoadFail = false;
                    };
                }
            };
        }]);
}(angular));