import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputVolume } from './input-volume';

describe('InputVolume', () => {
  let component: InputVolume;
  let fixture: ComponentFixture<InputVolume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputVolume],
    }).compileComponents();

    fixture = TestBed.createComponent(InputVolume);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
