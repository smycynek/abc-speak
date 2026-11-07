import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
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
    const app = fixture.componentInstance as unknown as { currentLetter: () => string; forward: () => void };
    expect(app.currentLetter()).toBe('A');
    app.forward();
    expect(app.currentLetter()).toBe('B');
  });
});
