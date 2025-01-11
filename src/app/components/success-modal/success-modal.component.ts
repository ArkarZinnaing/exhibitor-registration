
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-success-modal',
  imports: [CommonModule],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss'
})
export class SuccessModalComponent implements OnInit, OnDestroy { 
  @ViewChild('modalContent') modalContent!: ElementRef;
  isVisible = false;
  private subscription: Subscription;
  uniqueCode : string = ''

  constructor(private modalService: ModalService) {

    this.subscription = this.modalService.modalVisibility$.subscribe(
      (visibility) => {
        this.isVisible = visibility;
      }
    );
  }


  ngAfterContentChecked(){
    this.uniqueCode = this.modalService.uniqueCode
  }

  ngOnInit() {
   
  }

  async saveImage() {
    try {
      // Hide buttons before capturing
      const buttonGroup = this.modalContent.nativeElement.querySelector('.button-group');
      const originalDisplay = buttonGroup.style.display;
      buttonGroup.style.display = 'none';

      // Capture the modal content
      const canvas = await html2canvas(this.modalContent.nativeElement, {
        backgroundColor: null,
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true
      });

      // Show buttons again
      buttonGroup.style.display = originalDisplay;

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'registration-code.png';
          
          // Trigger download
          document.body.appendChild(link);
          link.click();
          
          // Cleanup
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error saving image:', error);
      // Here you might want to show an error message to the user
    }
  }

  closeModal() {
    this.modalService.hideModal();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
