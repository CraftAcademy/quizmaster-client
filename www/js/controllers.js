angular.module('quizmaster.controllers', [])

  .controller('DashCtrl', function ($scope) {
  })

  .controller('QuizController', function ($scope, $ionicModal) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.goToQuiz = function () {
      console.log('in the goToQuiz function');
      $ionicModal.fromTemplateUrl('templates/quiz-page.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        debugger;
        $scope.modal = modal;
        $scope.modal.show();
      })
      ;
    }

  });
