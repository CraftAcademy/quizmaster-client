angular.module('quizmaster.controllers', ['ngActionCable'])

  .controller('DashCtrl', function ($scope) {
  })

  .controller('QuizController', function ($scope, $ionicModal, ActionCableChannel, $ionicLoading) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    var consumer, callback, quiz, team_name;

    $scope.findQuiz = function () {
      $ionicLoading.show({
          template: 'Loading quiz...'
        }
      );
      code = angular.element(document.querySelector('#codeEntry'))[0].value;
      consumer = new ActionCableChannel('QuizChannel');
      callback = function (obj) {
        if (obj != null) {
          $scope.quiz = obj;
          consumer.unsubscribe()
            .then(function () {
              subscribeToQuiz();
              angular.element(document.querySelector('#badCode'))[0].style.display = "none";
              $ionicModal.fromTemplateUrl('templates/quiz-page.html', {
                scope: $scope,
                animation: 'slide-in-up'
              }).then(function (modal) {
                $scope.modal = modal;
                $ionicLoading.hide();
                $scope.openModal();
              });
            });
        } else {
          $ionicLoading.hide();
          angular.element(document.querySelector('#badCode'))[0].style.display = "inline";
        }

      };
      consumer.subscribe(callback)
        .then(function () {
          consumer.send(code, 'get_quiz');
        });


    };

    var subscribeToQuiz = function () {
      callback = function (data) {
        if (data.welcome == 'true') {
          angular.element(document.querySelector('#message')).html(data.message);
        } else {
          angular.element(document.querySelector('#message')).html(data);
        }
      };
      consumer = new ActionCableChannel('QuizChannel', {quiz_id: $scope.quiz.id});
      consumer.subscribe(callback)
        .then(function () {
          $scope.registerTeam = function () {
            team_name = angular.element(document.querySelector('#teamName'))[0].value;
            if (team_name.trim().length >= 1) {
              $scope.team_name = team_name;
              message = {team_name: team_name, quiz_id: $scope.quiz.id};
              consumer.send(message, 'create_team');
              $scope.registeredTeam = true;
              angular.element(document.querySelector('#message')).html('Questions will appear here. Hang tight.');

            } else {
              angular.element(document.querySelector('#message')).html('Enter a team name!');
            }

          };
          this.submitAnswer = function () {
            var dataset, quiz, answer, question, team, answer_hash;
            dataset = angular.element(document.querySelector('#info'))[0];
            quiz = dataset.getAttribute('data-quiz-id');
            team = team_name;
            question = dataset.getAttribute('data-question-id');
            answer = angular.element(document.querySelector('#body'))[0].value;

            var sendAnswer = function () {
              consumer.send(answer_hash, 'submit_answer');
            };

            if (answer.trim().length >= 1) {
              answer_hash = {answer: answer, team_name: team, quiz_id: quiz, question_id: question};
              sendAnswer(answer_hash);
              angular.element(document.querySelector('.answer_submitted'))[0].style.display = "inline";
              angular.element(document.querySelector('.answer_form'))[0].style.display = "none";

            } else {
              angular.element(document.querySelector('#message')).html('Enter an answer!');
            }
            return false;
          };
          this.showAnswers = function () {
          };
        });
    };

    $scope.openModal = function () {
      $scope.modal.show();
    }

  })
;

