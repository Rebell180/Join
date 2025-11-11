import { Component, ElementRef, input, InputSignal, output, OutputEmitterRef, OnInit, OnDestroy } from '@angular/core';
import { Category } from '../../enums/category.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-drop',
  imports: [CommonModule],
  templateUrl: './category-drop.component.html',
  styleUrl: './category-drop.component.scss'
})
export class CategoryDropComponent implements OnInit, OnDestroy {

  // #region attributes

  Category = Category;
  
  currentCategory: InputSignal<Category> = input.required<Category>();
  newCategory: OutputEmitterRef<Category> = output<Category>();

  categoryValues = Object.values(Category) as Category[];
  isOpen: boolean = false;

  // #endregion attributes

  constructor(private elementRef: ElementRef) {}

  private _docClickListener: ((evt: Event) => void) | null = null;

  ngOnInit(): void {
    this._docClickListener = (event: Event) => {
      const target = event.target as Node | null;
      if (target && !this.elementRef.nativeElement.contains(target)) {
        this.isOpen = false;
      }
    };
    document.addEventListener('click', this._docClickListener, true);
  }

  ngOnDestroy(): void {
    if (this._docClickListener) {
      document.removeEventListener('click', this._docClickListener, true);
      this._docClickListener = null;
    }
  }

  // #region methods

  /**
   * Toggles the dropdown of category dropdown.
   */
  toggleOptions() {
    this.isOpen = !this.isOpen;
  }

  /** Handler beim Auswählen */
  updateCategory(category: Category) {
    this.newCategory.emit(category);
    this.isOpen = false;
  }

  // #endregion methods
}
