import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactIconListComponent } from './contact-icon-list.component';

describe('ContactIconListComponent', () => {
  let component: ContactIconListComponent;
  let fixture: ComponentFixture<ContactIconListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactIconListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactIconListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
