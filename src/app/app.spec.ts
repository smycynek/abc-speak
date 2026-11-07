/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { App } from './app';

// jsdom (the Vitest test environment) has neither the Web Audio API nor a
// fetch that resolves relative URLs, so forward()/playBuffer()'s fire-and-forget
// audio-loading chain needs fakes to avoid unhandled rejections.
class FakeAudioContext {
  readonly destination = {};
  resume(): void {}
  decodeAudioData(): Promise<unknown> {
    return Promise.resolve({});
  }
  createBufferSource(): {
    buffer: unknown;
    onended: (() => void) | null;
    connect: () => void;
    start: () => void;
  } {
    return {
      buffer: undefined,
      onended: null,
      connect: () => {},
      start: () => {},
    };
  }
}

describe('App', () => {
  beforeEach(async () => {
    (globalThis as unknown as { AudioContext: typeof FakeAudioContext }).AudioContext =
      FakeAudioContext;
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    } as Response);
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('ABCs with Ashna!');
  });

  it('should start on letter A and step forward through the alphabet', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as unknown as {
      currentLetter: () => string;
      forward: () => void;
    };
    expect(app.currentLetter()).toBe('A');
    app.forward();
    expect(app.currentLetter()).toBe('B');
  });
});
