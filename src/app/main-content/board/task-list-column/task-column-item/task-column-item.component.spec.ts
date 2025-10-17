import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskColumnItemComponent } from './task-column-item.component';

describe('TaskColumnItemComponent', () => {
  let component: TaskColumnItemComponent;
  let fixture: ComponentFixture<TaskColumnItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskColumnItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskColumnItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
