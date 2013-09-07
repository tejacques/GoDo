var todoApp = angular.module('todo', ['ui.sortable']);

todoApp.factory('todoAppStorage', function () {
    var STORAGE_ID = 'godo-angularjs';

    return {
        get: function () {
            return JSON.parse(localStorage.getItem(STORAGE_ID)) || [
                {
                    description: "Walk the dog",
                    complete: true,
                    itemID: 0
                },
                {
                    description: "Buy groceries",
                    complete: false,
                    itemID: 1
                },
                {
                    description: "Call mom",
                    complete: false,
                    itemID: 2
                },
                {
                    description: "Go jogging",
                    complete: true,
                    itemID: 3
                }
            ];
        },

        put: function (items) {
            localStorage.setItem(STORAGE_ID, JSON.stringify(items));
        }
    };
});

function ItemsController($scope, todoAppStorage) {
    var items = $scope.items = todoAppStorage.get();
    $scope.search = {};
    $scope.editingItem = null;

    $scope.$watch('items', function (newValue, oldValue) {
        $scope.activeCount = $scope.itemCount(false);
        $scope.completedCount = items.length - $scope.activeCount;

        if (newValue !== oldValue) {
            todoAppStorage.put(items);
        }
    }, true);

    $scope.itemCount = function (complete) {
        console.log(complete);
        if (typeof (complete) === 'undefined' || complete === null) {
            return $scope.items.length;
        }
        else {
            var count = 0;
            angular.forEach($scope.items, function (item) {
                if (item.complete == complete) {
                    console.log(item.complete + " equals " + complete);
                    count++;
                }
            });

            return count;
        }
    }

    $scope.addItem = function (item) {
        var id = $scope.itemID++;
        $scope.trimItem(item);
        $scope.items.push({
            description: item.description,
            complete: false
        });

        item.description = "";
    }

    $scope.deleteItem = function (item) {
        $scope.items.splice($scope.items.indexOf(item), 1);
    }

    $scope.complete = function (item, complete) {
        if (typeof (complete) === 'undefined' || complete === null) {
            delete item.complete;
        }
        else {
            item.complete = complete;
        }
    }

    $scope.edit = function (item) {
        item.editing = true;
        $scope.editingItem = item;
    }

    $scope.doneEditing = function (item) {
        item.editing = false;
        if (item.description.length == 0) {
            $scope.deleteItem(item);
        }
        else {
            $scope.trimItem(item);
        }
        $scope.editingItem = null;
    }

    $scope.trimItem = function (item) {
        var maxLength = 29;
        if (item.description.length > maxLength) {
            item.description = item.description.substring(0, maxLength - 1);
        }
    }
};

todoApp.directive('onBlur', function () {
    return function (scope, elem, attrs) {
        elem.bind('blur', function () {
            scope.$apply(attrs.onBlur);
        });
    };
});

todoApp.directive('giveFocus', function todoFocus($timeout) {
	return function (scope, elem, attrs) {
		scope.$watch(attrs.giveFocus, function (newVal) {
			if (newVal) {
				$timeout(function () {
					elem[0].focus();
				}, 0, false);
			}
		});
	};
});