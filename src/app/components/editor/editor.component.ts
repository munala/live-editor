import {
  Component,
  OnInit,
  AfterContentInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MediumEditor } from 'medium-editor';
import { first } from 'rxjs/operators';

import { EditorService } from '../../core/services/editor/editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit, AfterContentInit {
  editor: any;
  loading: boolean = false;

  @ViewChild('editable', {
    static: true,
  })
  editable: ElementRef;

  constructor(public editorService: EditorService) {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    const editorOptions = {
      placeholder: {
        text: 'Type your text here. It will be saved automatically.',
        hideOnClick: false,
      },
    };

    this.editor = new MediumEditor(this.editable.nativeElement, editorOptions);

    const editorContext = this;

    this.editor.subscribe('editableInput', (event: any) => {
      editorContext.editorService.save(event.target.innerHTML);
    });

    this.loading = true;

    this.editorService
      .initEditor()
      .pipe(first())
      .subscribe((document) => {
        this.loading = false;

        if (document?.content) this.editor.setContent(document.content);
      });
  }
}
