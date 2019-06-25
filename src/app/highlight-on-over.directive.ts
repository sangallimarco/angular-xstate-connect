import { Directive, ElementRef, Renderer, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlightOnOver]'
})
export class HighlightOnOverDirective {

  constructor(private el: ElementRef, private renderer: Renderer) {
  }

  @HostListener('mouseover') onMouseOver() {
    let part = this.el.nativeElement; // .querySelector('div') ;
    this.renderer.setElementClass(part, '--over', true);
  }

  @HostListener('mouseout') onMouseOut() {
    let part = this.el.nativeElement; // .querySelector('div');
    this.renderer.setElementClass(part, '--over', false);
  }

}
