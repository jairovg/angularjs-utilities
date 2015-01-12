/**
 * Created by jairovg on 8/01/15.
 */
(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name utilities.form-extensions.directive:formExt
   * @module utilities.form-extensions
   * @description
   *
   * Use this directive to **extend** the AngularJS form directive.
   *
   <example module="formExtDemo">
     <file name="index.html">
       <div ng-controller="GeneralController as genCtrl">
         <div ng-if="genCtrl.isSubmitted">The form has been submitted</div>
         <div ng-if="genCtrl.isReset">The form has been reset</div>
         <form name="frm" form-ext submit-ext="genCtrl.save()" reset-ext="genCtrl.reset()" novalidate>
           <div ng-class="{'has-error': frmExt.isInputInvalid(frm.testInput1)}">
            <input type="email" name="testInput1" ng-model="genCtrl.form.testInput1" required>
           </div>
           <div ng-show="frm.testInput1.$error.required">Required</div>
           <div ng-show="frm.testInput1.$error.email">Email</div>
           <button type="submit">submit</button>
           <button type="reset">reset</button>
         </form>
       </div>
     </file>
     <file name="script.js">
       angular
         .module('formExtDemo', [])
         .controller('GeneralController', GeneralController);

       function GeneralController() {
         var self = this;
         self.testDate = '12/18/2014';
       }

       GeneralController.prototype.save = function () {
         var self = this;
         self.isSubmitted = true;
       });

        GeneralController.prototype.reset = function () {
          var self = this;
          self.isReset = true;
        });
     </file>
   </example>
   */
  angular
    .module('utilities.form-extensions')
    .directive('formExt', formExt);

  var _frmCtrl;

  formExt.$inject = ['$parse'];
  function formExt($parse) {
    return {
      restrict: 'A',
      require: ['formExt', 'form'],
      controller: FormExtCtrl,
      compile: function () {
        return {
          pre: submitExtPreLink,
          post: submitExtLink
        }
      }
    };

    function submitExtPreLink(scope, element, attrs, ctrls) {
      //Expose the directive controller
      scope[element[0].name + 'Ext'] = ctrls[0];
    }

    function submitExtLink(scope, element, attrs, ctrls) {
      _frmCtrl = ctrls[1];
      if (attrs.submitExt) {
        var submitFn = $parse(attrs.submitExt);

        element.bind('submit', function (event) {
          if (_frmCtrl.$invalid) return false;

          scope.$apply(function () {
            submitFn(scope, {$event: event});
          });
        });
      }

      if (attrs.resetExt !== undefined) {
        var resetFn = $parse(attrs.resetExt);

        element.bind('reset', function (event) {
          _frmCtrl.$setPristine();
          _frmCtrl.$setUntouched();

          scope.$apply(function () {
            resetFn(scope, {$event: event});
          });
        });
      }
    }
  }

  /**
   * @ngdoc controller
   * @name utilities.form-extensions.controller:FormExtCtrl
   * @module utilities.form-extensions
   * @description
   *
   * This controller exposes some form extensions that could be use at the view scope.
   */
  function FormExtCtrl() {
    //TODO: Expose regex validators
  }

  /**
   * @ngdoc method
   * @name utilities.form-extensions.controller:FormExtCtrl#isInputInvalid
   * @module utilities.form-extensions
   * @description
   * Use this function to know if an input is invalid or not ignoring only the "required" input validation when
   * the form has not been submitted.
   *
   * @param {DOMElement} input DOM element which is the root of angular application.
   * @returns {Boolean} Returns if an input is invalid or not.
   */
  FormExtCtrl.prototype.isInputInvalid = function (input) {
    if (input) {
      if (_frmCtrl.$submitted) {
        return input.$invalid;
      }
      var error = input.$error;
      return Object.keys(error).length === 1 && error.required ? false : input.$invalid;
    }
  };
})();