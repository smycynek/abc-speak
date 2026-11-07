import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { version } from './version';

const LETTERS = [
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
  'Z',
] as const;

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app.css',
})
export class App {
  protected readonly letters = LETTERS;
  protected readonly index = signal(0);
  protected readonly currentLetter = computed(() => this.letters[this.index()]);
  protected readonly version = version;

  private audioCtx: AudioContext | null = null;
  private readonly pathMap: Record<string, string> = {};

  constructor() {
    this.letters.forEach((letter) => {
      this.pathMap[letter] = this.getLetterAudioPath(letter);
      this.pathMap[`${letter}-noun`] = this.getNounAudioPath(letter);
    });
  }

  private getLetterAudioPath(letter: string): string {
    return `data/audio/letters/${letter}.mp3`;
  }

  private getNounAudioPath(letter: string): string {
    return `data/audio/nouns/${letter}.mp3`;
  }

  private initContext(): void {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    // iOS Safari routes Web Audio output through the ringer channel by default,
    // so it gets silenced by the hardware mute switch unless the session type
    // is explicitly set to "playback" (supported since iOS 17).
    const nav = navigator as Navigator & { audioSession?: { type: string } };
    if (nav.audioSession) {
      nav.audioSession.type = 'playback';
    }
    this.audioCtx.resume();
  }

  private playBufferImpl(buffer: AudioBuffer, keyNext?: string): void {
    const source = this.audioCtx!.createBufferSource();
    source.buffer = buffer;
    if (keyNext) {
      source.onended = () => this.playBuffer(keyNext);
    }
    source.connect(this.audioCtx!.destination);
    source.start();
  }

  protected playBuffer(key1: string, key2?: string): void {
    this.initContext();
    window
      .fetch(this.pathMap[key1])
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => this.audioCtx!.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => this.playBufferImpl(audioBuffer, key2));
  }

  protected forward(): void {
    this.index.set(this.index() === this.letters.length - 1 ? 0 : this.index() + 1);
    this.playPair(this.currentLetter());
  }

  protected reverse(): void {
    this.index.set(this.index() === 0 ? this.letters.length - 1 : this.index() - 1);
    this.playPair(this.currentLetter());
  }

  protected setCurrent(letter: string): void {
    this.index.set(this.letters.findIndex((item) => item === letter));
    this.playPair(this.currentLetter());
  }

  protected playCurrent(): void {
    this.playPair(this.currentLetter());
  }

  protected playCurrentLetter(): void {
    this.playBuffer(this.currentLetter());
  }

  protected playCurrentNoun(): void {
    this.playBuffer(`${this.currentLetter()}-noun`);
  }

  private playPair(letter: string): void {
    this.playBuffer(letter, `${letter}-noun`);
  }
}
