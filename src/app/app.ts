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
  protected readonly ready = signal(false);
  protected readonly currentLetter = computed(() => this.letters[this.index()]);
  protected readonly version = version;

  private readonly audioCtx: AudioContext = new AudioContext();
  private readonly pathMap: Record<string, string> = {};
  private readonly bufferMap: Record<string, AudioBuffer> = {};

  constructor() {
    this.letters.forEach((letter) => {
      this.pathMap[letter] = this.getLetterAudioPath(letter);
      this.pathMap[`${letter}-noun`] = this.getNounAudioPath(letter);
    });

    Promise.all(Object.keys(this.pathMap).map((key) => this.preload(key))).then(() =>
      this.ready.set(true),
    );
  }

  private getLetterAudioPath(letter: string): string {
    return `data/audio/letters/${letter}.mp3`;
  }

  private getNounAudioPath(letter: string): string {
    return `data/audio/nouns/${letter}.mp3`;
  }

  // Decoding every clip up front, independent of any user gesture, lets
  // playback below be fully synchronous with the click that triggers it.
  // On iOS (Safari and Chrome, both on WebKit), starting a buffer source
  // only unlocks audio when it happens in the same synchronous call stack
  // as the gesture -- a fetch()/decodeAudioData() in between breaks that
  // link and audio silently never plays.
  private preload(key: string): Promise<void> {
    return window
      .fetch(this.pathMap[key])
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => this.audioCtx.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        this.bufferMap[key] = audioBuffer;
      });
  }

  private playBufferImpl(buffer: AudioBuffer, keyNext?: string): void {
    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    if (keyNext) {
      source.onended = () => this.playBuffer(keyNext);
    }
    source.connect(this.audioCtx.destination);
    source.start();
  }

  protected playBuffer(key1: string, key2?: string): void {
    this.audioCtx.resume();
    this.playBufferImpl(this.bufferMap[key1], key2);
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
