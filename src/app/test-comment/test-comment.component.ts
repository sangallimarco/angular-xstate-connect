import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ApiCommment } from '../test-fsm/test-fsm.service';

@Component({
  selector: 'app-test-comment',
  templateUrl: './test-comment.component.html',
  styleUrls: ['./test-comment.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestCommentComponent implements OnInit {
  @Input() comment: ApiCommment;
  @Output() onSelect = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  handleClick() {
    this.onSelect.next();
  }

}
