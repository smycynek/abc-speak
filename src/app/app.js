/* eslint-disable func-names */
/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */

import angular from 'angular';

import 'bootstrap/dist/css/bootstrap.css';
import '../style/app.css';
import { v4 as uuidv4 } from 'uuid';

import { Scope } from 'babel-traverse';

const app = () => ({
  // eslint-disable-next-line global-require
  template: require('./app.html'),
  controller: 'RenderCtrl',
});

const MODULE_NAME = 'app';



angular.module(MODULE_NAME, [])
  .directive('app', app)
  .controller('RenderCtrl', ($scope) => {
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

    $scope.getLetterAudio = function(letter) {
      return new Audio(`data/audio/letters/${letter}.mp3`);
    }
    $scope.getNounAudio = function(letter) {
      return new Audio(`data/audio/nouns/${letter}${letter}.mp3`);
    }

    $scope.letterMap = {
      'A' : {letter: $scope.getLetterAudio('A'), noun: $scope.getNounAudio('A')},
      'B' : {letter: $scope.getLetterAudio('B'), noun: $scope.getNounAudio('B')},
      'C': {letter: $scope.getLetterAudio('C'), noun: $scope.getNounAudio('C')},
      'D' : {letter: $scope.getLetterAudio('D'), noun: $scope.getNounAudio('D')},
      'E' : {letter: $scope.getLetterAudio('E'), noun: $scope.getNounAudio('E')},
      'F': {letter: $scope.getLetterAudio('F'), noun: $scope.getNounAudio('F')},
      'G': {letter: $scope.getLetterAudio('G'), noun: $scope.getNounAudio('G')},
      'H': {letter: $scope.getLetterAudio('H'), noun: $scope.getNounAudio('H')},
      'I': {letter: $scope.getLetterAudio('I'), noun: $scope.getNounAudio('I')},
      'J' : {letter: $scope.getLetterAudio('J'), noun: $scope.getNounAudio('J')},
      'K' : {letter: $scope.getLetterAudio('K'), noun: $scope.getNounAudio('K')},
      'L' : {letter: $scope.getLetterAudio('L'), noun: $scope.getNounAudio('L')},
      'M' : {letter: $scope.getLetterAudio('M'), noun: $scope.getNounAudio('M')},
      'N' : {letter: $scope.getLetterAudio('N'), noun: $scope.getNounAudio('N')},
      'O' : {letter: $scope.getLetterAudio('O'), noun: $scope.getNounAudio('O')},
      'P' : {letter: $scope.getLetterAudio('P'), noun: $scope.getNounAudio('P')},
      'Q' : {letter: $scope.getLetterAudio('Q'), noun: $scope.getNounAudio('Q')},
      'R' : {letter: $scope.getLetterAudio('R'), noun: $scope.getNounAudio('R')},
      'S' : {letter: $scope.getLetterAudio('S'), noun: $scope.getNounAudio('S')},
      'T' : {letter: $scope.getLetterAudio('T'), noun: $scope.getNounAudio('T')},
      'U' : {letter: $scope.getLetterAudio('U'), noun: $scope.getNounAudio('U')},
      'V' : {letter: $scope.getLetterAudio('V'), noun: $scope.getNounAudio('V')},
      'W' : {letter: $scope.getLetterAudio('W'), noun: $scope.getNounAudio('W')},
      'X' : {letter: $scope.getLetterAudio('X'), noun: $scope.getNounAudio('X')},
      'Y' : {letter: $scope.getLetterAudio('Y'), noun: $scope.getNounAudio('Y')},
      'Z': {letter: $scope.getLetterAudio('Z'), noun: $scope.getNounAudio('Z')},

    };

    $scope.enableTimer = function(length) {
      $scope.enabled = false;

      setTimeout(function() { $scope.enabled = true; $scope.$apply(); }, length ? length : 1100);
    };

    $scope.index = 0;
    $scope.forward = function() {
      if ($scope.index === $scope.letters.length -1) {
        $scope.index= 0;
      }
      else  {
        $scope.index++
      }
      $scope.playPair($scope.letters[$scope.index])
    }

    $scope.reverse = function() {
      if ($scope.index === 0) {
        $scope.index= $scope.letters.length-1;
      }
      else  {
        $scope.index--;
      }
      $scope.playPair($scope.letters[$scope.index])
    }

    $scope.current = function() {
      $scope.enableTimer();
      $scope.playPair($scope.letters[$scope.index]);
    };


    $scope.currentLetter = function() {
      $scope.enableTimer(1000);
      const currentLetter = $scope.letters[$scope.index];
      const audioLetter = $scope.letterMap[currentLetter].letter;
      audioLetter.onended = function() {
      audioLetter.onended = null;
      }
      audioLetter.play();
    };

    $scope.currentNoun = function() {
      $scope.enableTimer();
      const currentLetter = $scope.letters[$scope.index];
      const audioNoun = $scope.letterMap[currentLetter].noun;
      audioNoun.play();
    };

    $scope.playPair = function(letter) {
        $scope.enableTimer();
        const audioLetter1 = $scope.letterMap[letter].letter;
        const audioNoun1 = $scope.letterMap[letter].noun;

        audioLetter1.onended = function() {
         audioNoun1.play();
         audioLetter1.onended = null;
        };
          audioLetter1.play();
    };

  });

export default MODULE_NAME;
