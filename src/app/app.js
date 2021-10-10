import angular from 'angular';

import 'bootstrap/dist/css/bootstrap.css';
import '../style/app.css';

const app = () => ({
    // eslint-disable-next-line global-require
    // eslint-disable-next-line no-undef
    template: require('./app.html'),
    controller: 'RenderCtrl',
});

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [])
    .directive('app', app)
    .controller('RenderCtrl', ($scope) => {
        $scope.audioCtx = null;
        $scope.pathMap = {};
        $scope.init = false;

        $scope.getLetterAudioPath = function (letter) {
            return `data/audio/letters/${letter}.mp3`;
        };

        $scope.getNounAudioPath = function (letter) {
            return `data/audio/nouns/${letter}.mp3`;
        };

        $scope.initPathMap = function() {
            $scope.letters.forEach(element => {
                $scope.pathMap[element] = $scope.getLetterAudioPath(element);
                $scope.pathMap[`${element}-noun`] = $scope.getNounAudioPath(element);
            });
        };

        $scope.initContext = function() {
            if (!$scope.audioCtx) {
                console.log('Init AC.');
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                $scope.audioCtx = new AudioContext();
            }
            $scope.audioCtx.resume();
        };

        $scope.playBufferImpl = function (buffer, keyNext) {
            const source = $scope.audioCtx.createBufferSource();
            source.buffer = buffer;
            if (keyNext) {
                source.onended = function() {
                    $scope.playBuffer(keyNext);
                };
            }

            source.connect($scope.audioCtx.destination);
            source.start();
        };

        $scope.kick = function() {
            console.log('Kick!');
            const kick = new Audio('data/audio/blank-t2.mp3');
            kick.onended = function() {
                $scope.init = true;
                $scope.$apply();
                kick.onended = null;
                kick.play();
            };
            kick.play();


        };
        $scope.playBuffer = function(key1, key2) {
            console.log('Play buffer');
            $scope.initContext();
            window.fetch($scope.pathMap[key1])
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => $scope.audioCtx.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    $scope.playBufferImpl(audioBuffer, key2);
                });
        };

        $scope.enabled = true;
        $scope.letters = [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z'
        ];

        $scope.initPathMap();

        $scope.index = 0;

        $scope.getCurrentLetter = function () {
            const letter =  $scope.letters[$scope.index];
            console.log(`Current index: ${letter}`);
            return letter;
        };

        $scope.forward = function () {
            console.log('Forward');
            if ($scope.index === $scope.letters.length - 1) {
                $scope.index = 0;
            }
            else {
                $scope.index++;
            }
            $scope.playPair($scope.getCurrentLetter());

        };

        $scope.reverse = function () {
            console.log('Reverse');
            if ($scope.index === 0) {
                $scope.index = $scope.letters.length - 1;
            }
            else {
                $scope.index--;
            }

            $scope.playPair($scope.getCurrentLetter());
        };

        $scope.playCurrent = function () {
            $scope.playPair($scope.getCurrentLetter(), `${$scope.getCurrentLetter()}-noun`);

        };

        $scope.playCurrentLetter = function () {
            $scope.playBuffer($scope.getCurrentLetter());
        };

        $scope.playCurrentNoun = function () {
            $scope.playBuffer(`${$scope.getCurrentLetter()}-noun`);

        };

        $scope.playPair = function (letter) {
            $scope.playBuffer(letter, `${letter}-noun`);
        };

    });

export default MODULE_NAME;
