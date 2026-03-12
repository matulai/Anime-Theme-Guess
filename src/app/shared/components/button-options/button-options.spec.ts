import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonOptions } from './button-options';

describe('ButtonOptions', () => {
  let component: ButtonOptions;
  let fixture: ComponentFixture<ButtonOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonOptions],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonOptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
