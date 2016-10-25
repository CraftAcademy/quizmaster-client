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

    $scope.goToQuiz = function () {
      $ionicModal.fromTemplateUrl('templates/quiz-page.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.openModal();
      });
    };

    var consumer = new ActionCableChannel('QuizChannel');
    var callback = function(data) {
      console.log(data);
      if(data.welcome == 'true'){
        angular.element(document.querySelector('#message')).html(data.message);
      } else {
        angular.element(document.querySelector('#message')).html(data);
      }
    };

    $scope.openModal = function () {
      $scope.modal.show();
      consumer.subscribe(callback)
        .then(function() {
          this.submitAnswer = function() {
            var dataset, quiz, answer, question, team, answer_hash ;
            dataset = angular.element(document.querySelector('#info'))[0];
            quiz = dataset.getAttribute('data-quiz-id');
            // team = dataset.getAttribute('data-team-id');
            team = 1;
            question = dataset.getAttribute('data-question-id');
            answer = angular.element(document.querySelector('#body'))[0].value;

            var sendAnswer = function() {
              consumer.send(answer_hash, 'submit_answer');
            };

            if (answer.trim().length >= 1) {
              // Team ID needs to come from cookies or something here. - hard-coded as 1 for the moment
              answer_hash = {answer: answer, team_id: team, quiz_id: quiz, question_id: question};
              sendAnswer(answer_hash);
              // $('.answer_form').hide();
              // $('.wait').show();
            } else {
              angular.element(document.querySelector('#message')).html('Enter an answer!');
            }
            return false;
          };
        });

    }

  });

