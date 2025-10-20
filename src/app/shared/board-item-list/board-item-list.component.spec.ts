import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:src/app/shared/board-item-list/board-item-list.component.spec.ts
import { BoardItemListComponent } from './board-item-list.component';

describe('BoardItemListComponent', () => {
  let component: BoardItemListComponent;
  let fixture: ComponentFixture<BoardItemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardItemListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardItemListComponent);
========
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
>>>>>>>> dev:src/app/shared/components/contact-icon-list/contact-icon-list.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
