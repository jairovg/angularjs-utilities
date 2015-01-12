/**
 * Created by jairovg on 9/01/15.
 */
describe('Directive: formExt', function () {
  'use strict';
  var elm, $scope;

  //Load the directive's module
  beforeEach(module('utilities.form-extensions'));

  beforeEach(inject(function($rootScope, $compile) {
    elm = angular.element(
      '<form name="frm" form-ext submit-ext="save()" reset-ext="reset()" novalidate>' +
        '<div ng-class="{\'has-error\': frmExt.isInputInvalid(frm.testInput1)}">' +
          '<input type="email" name="testInput1" ng-model="form.testInput1" required>' +
        '<button type="submit">submit</button>' +
        '<button type="reset">reset</button>' +
      '</form>'
    );

    $scope = $rootScope.$new();
    $scope.save = function () {};
    $scope.reset = function () {};
    $compile(elm)($scope);
    $scope.$digest();
    // update the scope model value
    $scope.form = $scope.form || {};
  }));

  describe('Initialization', function () {
    it('should be a new "FormExtCtrl" object named "{formName}Ext" which contains the API directive', function () {
      var formExt = $scope[elm[0].name + 'Ext'];
      expect(formExt).toBeDefined();
      expect(formExt.constructor.name).toBe('FormExtCtrl');
    });
  });

  describe('Submit event extended', function () {
    it('should call the configured function when the user submits a valid form', function () {
      spyOn($scope, 'save');

      $scope.form.testInput1 = "test@test.com";
      // force model change propagation
      $scope.$digest();

      elm.find('button[type="submit"]')[0].click();
      expect($scope.save).toHaveBeenCalled();
    });

    it('should not call the configured function when the user submits an invalid form', function () {
      spyOn($scope, 'save');

      $scope.form.testInput1 = "test";
      // force model change propagation
      $scope.$digest();

      elm.find('button[type="submit"]')[0].click();
      expect($scope.save).not.toHaveBeenCalled();
    });
  });

  describe('Reset event extended', function () {
    it('should call the configured function when the user resets a valid form', function () {
      spyOn($scope, 'reset');

      $scope.form.testInput1 = "test data";
      // force model change propagation
      $scope.$digest();

      elm.find('button[type="reset"]')[0].click();
      expect($scope.reset).toHaveBeenCalled();
    });

    it('should sets the form property $pristine as true whe the user resets a valid form', function () {
      $scope.form.testInput1 = "test data";
      // force model change propagation
      $scope.$digest();

      elm.find('button[type="reset"]')[0].click();
      expect($scope[elm[0].name].$pristine).toBeTruthy();
    });

    it('should sets the form property $dirty as false whe the user resets a valid form', function () {
      $scope.form.testInput1 = "test data";
      // force model change propagation
      $scope.$digest();

      elm.find('button[type="reset"]')[0].click();
      expect($scope[elm[0].name].$dirty).toBeFalsy();
    });
  });

  describe('Required input validation extended', function () {
    it('should have "div" related without "has-error" class when the form has not been submitted and the input is invalid', function () {
      var style = elm.find('div[class="has-error"]')[0];
      expect(style).toBeUndefined();
    });

    it('should have "div" related with "has-error" class when the form has been submitted and the input is invalid', function () {
      elm.find('button[type="submit"]')[0].click();
      var style = elm.find('div[class="has-error"]')[0];
      expect(style).toBeDefined();
    });
  });
});