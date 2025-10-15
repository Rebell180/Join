import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
