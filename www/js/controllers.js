angular.module('quizmaster.controllers', ['ngActionCable'])

  .controller('DashCtrl', function ($scope) {
  })

  .controller('QuizController', function ($scope, $ionicModal, ActionCableChannel) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    var consumer, callback, quiz;

    $scope.findQuiz = function () {
      code = angular.element(document.querySelector('#codeEntry'))[0].value;
      consumer = new ActionCableChannel('QuizChannel');
      callback = function (obj) {
        console.log(obj);
        quiz = obj;
        $scope.quiz = quiz;
        consumer.unsubscribe()
          .then(function () {
            subscribeToQuiz();
          });
      };
      consumer.subscribe(callback)
        .then(function () {
          consumer.send(code, 'get_quiz');
        });

      $ionicModal.fromTemplateUrl('templates/quiz-page.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.openModal();
      });
    };

    var subscribeToQuiz = function () {
      callback = function (data) {
        console.log(data);
        if (data.welcome == 'true') {
          angular.element(document.querySelector('#message')).html(data.message);
        } else {
          angular.element(document.querySelector('#message')).html(data);
        }
      };
      consumer = new ActionCableChannel('QuizChannel', {quiz_id: quiz.id});
      consumer.subscribe(callback)
        .then(function () {
          $scope.registerTeam = function () {
            var team_name = angular.element(document.querySelector('#teamName'))[0].value;
            if (team_name.trim().length >= 1) {
              $scope.team_name = team_name;
              message = {team_name: team_name, quiz_id: quiz.id};
              consumer.send(message, 'create_team');
              $scope.registeredTeam = true;
              angular.element(document.querySelector('#message')).html('Questions will appear here. Hang tight.');
            } else {
              angular.element(document.querySelector('#message')).html('Enter a team name!');
            }

            // angular.element(document.querySelector('#register_team'))[0].hide();

          };
          $scope.submitAnswer = function () {
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
            } else {
              angular.element(document.querySelector('#message')).html('Enter an answer!');
            }
            return false;
          };
        });
    };

    $scope.openModal = function () {
      $scope.modal.show();
    }

  })
;

