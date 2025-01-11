import { Component, Input, Output, EventEmitter, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDropdownComponent),
      multi: true,
    },
  ],
  imports: [CommonModule],
})
export class CustomDropdownComponent implements ControlValueAccessor {
  @Input() items: any[] = [];
  @Input() displayField: string = 'name';
  @Input() placeholder: string = 'Select';

  @Output() valueChange = new EventEmitter<any>();

  isOpen = false;
  selectedValue: any = '';

  // ControlValueAccessor methods
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: any) {
    this.selectedValue = item[this.displayField];
    this.onChange(item[this.displayField]);
    this.valueChange.emit(item);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const dropdown = (event.target as HTMLElement).closest('.custom-dropdown');
    if (!dropdown) {
      this.isOpen = false;
      this.markAsTouched();
    }
  }

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disabling the dropdown if needed
  }

  markAsTouched() {
    this.onTouched();
  }
}
