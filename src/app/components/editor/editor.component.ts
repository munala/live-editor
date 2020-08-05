import {
  Component,
  OnInit,
  AfterContentInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import MediumEditor from 'medium-editor';
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
  editingLatex: boolean = false;
  ignoreChanges: boolean = false;
  latexEquation: string = '';
  latexEquationRaw: string = '';

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
      if (!this.ignoreChanges) this.handleLaTex(event);

      // resume handling input change events
      this.ignoreChanges = false;

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

  handleLaTex(event: any): void {
    if (event.inputType === 'deleteContentBackward') {
      return this.handleDeletion();
    }

    const text = event?.target?.textContent;
    if (text?.length) {
      const lastCharacter = text.charAt(text.length - 1);

      if (lastCharacter !== '$') {
        if (this.editingLatex) {
          this.latexEquation = `${this.latexEquation}${lastCharacter.replace(
            / /g,
            '\u00a0'
          )}`;
          this.latexEquationRaw = `${
            this.latexEquationRaw
          }${lastCharacter.replace(/ /g, '\u00a0')}`;
        }

        return;
      }

      // check if $ is escaped
      this.handleEscapeCharacter({ text, lastCharacter });
    }
  }

  handleEscapeCharacter(textVariables: {
    text: string;
    lastCharacter: string;
  }): void {
    const { text, lastCharacter } = textVariables;

    if (lastCharacter === '$') {
      const escaped = text.length > 2 && text.charAt(text.length - 2) === '\\';

      if (escaped) {
        // remove escape character and add new character
        this.latexEquation = `${this.latexEquation.substring(
          0,
          this.latexEquation.length - 1
        )}${lastCharacter.replace(/ /g, '\u00a0')}`;

        this.latexEquationRaw = `${
          this.latexEquationRaw
        }${lastCharacter.replace(/ /g, '\u00a0')}`;

        return;
      }

      this.renderLatex(event);
    }
  }

  handleDeletion(): void {
    if (this.editingLatex) {
      if (!this.latexEquation.length) {
        this.editingLatex = false;
        return;
      }

      this.latexEquation = `${this.latexEquation.substring(
        0,
        this.latexEquation.length - 1
      )}`;

      this.latexEquationRaw = `${this.latexEquationRaw.substring(
        0,
        this.latexEquationRaw.length - 1
      )}`;
    }
  }

  renderLatex(event: any): void {
    if (this.editingLatex) {
      // to ignore next input change event (rendering latext equation)
      this.ignoreChanges = true;

      // replace all html spaces with space unicode
      const innerHTML = String(event.target.innerHTML).replace(/ /g, '\u00a0');

      const content = innerHTML.replace(
        `$${this.latexEquationRaw}$`,
        `<i><b>${this.latexEquation}</b></i>&nbsp;`
      );

      this.editor.setContent(content);

      this.moveCursorToEnd();

      this.latexEquation = '';
      this.latexEquationRaw = '';
    }

    this.editingLatex = !this.editingLatex;
  }

  /*
    works by selecting the input content, storing somewhere,
    clearing the input then populating with the stored range.
    Refer to https://github.com/yabwe/medium-editor/issues/730 for in-depth discussion.
  */
  moveCursorToEnd(): void {
    const [inputField] = this.editor.elements;

    inputField.focus();

    // create holder for selection
    const range = document.createRange();

    // populate holder with selection
    range.selectNodeContents(inputField);

    // collapse range to end
    range.collapse(false);

    const selection = window.getSelection();

    // dump the input content
    selection.removeAllRanges();

    // repopulate with content from holder
    selection.addRange(range);
  }
}
