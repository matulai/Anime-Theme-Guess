import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenTimer } from './screen-timer';

describe('ScreenTimer', () => {
  let component: ScreenTimer;
  let fixture: ComponentFixture<ScreenTimer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenTimer],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenTimer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
