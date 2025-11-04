import { Component, ElementRef, HostListener, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Category } from '../../enums/category.enum';

@Component({
  selector: 'app-category-drop',
  imports: [],
  templateUrl: './category-drop.component.html',
  styleUrl: './category-drop.component.scss'
})
export class CategoryDropComponent {

  // #region attributes

  Category = Category;
  
  currentCategory: InputSignal<Category> = input.required<Category>();
  newCategory: OutputEmitterRef<Category> = output<Category>();

  categoryValues = Object.values(Category) as Category[];
  isOpen: boolean = false;

  // #endregion attributes

  constructor(private elementRef: ElementRef) {}

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

  /**
   * Click event of onClick outside of content to close pop up.
   * 
   * @param event click event on outside of content.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  // #endregion methods
}
