angular.module('quizmaster.controllers', [ 'ngActionCable' ])

  .controller('DashCtrl', function ($scope) {
  })

  .controller('QuizController', function ($scope, $ionicModal, ActionCableChannel, $interpolate) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    var consumer, callback;

    $scope.findQuiz = function (code) {
      consumer = new ActionCableChannel('QuizChannel');

      $ionicModal.fromTemplateUrl('templates/quiz-page.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.openModal();
      });
    };

    consumer = new ActionCableChannel('QuizChannel');
    callback = function(data) {
      console.log(data);
      if(data.welcome == 'true'){
        angular.element(document.querySelector('#message')).html(data.message);
      } else {
        angular.element(document.querySelector('#message')).html(data);
        this.submitAnswer = function() {
          var dataset, quiz, answer, question, team ;
          dataset = angular.element(document.querySelector('#info'))[0];
          quiz = dataset.getAttribute('data-quiz-id');
          // team = dataset.getAttribute('data-team-id');
          question = dataset.getAttribute('data-question-id');
          answer = $this.find('#body');
          if ($.trim(answer.val()).length >= 1) {
            // Team ID needs to come from cookies or something here.
            // App.quiz.submitAnswer({answer: answer.val(), team_id: team, quiz_id: quiz, question_id: question});
            console.log('inside if of submitAnswer');
            $('.answer_form').hide();
            $('.wait').show();
          } else {
            $('#message').append('WTF Dude?!?')
          }
          return false;
        };
      }
    };



    $scope.openModal = function () {
      $scope.modal.show();
      consumer.subscribe(callback)
        .then(function(data) {
        });

    }

  });

