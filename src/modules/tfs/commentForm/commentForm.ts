import { LightningElement, track } from 'lwc';
import CommentFormHelperText from '../commentFormHelperText/commentFormHelperText';

enum TextareaError {
  TooShort,
  TooLong,
  Required,
  Generic
}

/**
 * Comment Form
 *
 * The form for adding a comment. Features a single
 * textarea for the comment. To submit the form
 * the user must use the ctrl + enter or command + enter (mac)
 * keys. Helper text is shown to inform the user of this.
 * Imparied users or mobile users will be able to submit
 * the form via an <input type="submit"> tag in the DOM.
 */
export default class CommentForm extends LightningElement {
  /**
   * Classes are stored here as static variables
   * so they can be maintained easier
   */
  static TEXTAREA_DEFAULT_CLASS = 'comment-text';
  static TEXTAREA_VALID_CLASS = 'comment-text valid';
  static TEXTAREA_INVALID_CLASS = 'comment-text invalid';

  /**
   * Textarea validation configuration
   */
  static COMMENT_MIN_LENGTH = 12;
  static COMMENT_MAX_LENGTH = 400;
  static TEXTAREA_ERRORS = new Map([
    [
      TextareaError.TooShort,
      `Comment must be more than ${CommentForm.COMMENT_MIN_LENGTH} characters.`
    ],
    [
      TextareaError.TooLong,
      `Comment must be less than ${CommentForm.COMMENT_MAX_LENGTH} characters.`
    ],
    [TextareaError.Required, `Comment required.`],
    [TextareaError.Generic, `Comment invalid.`]
  ]);

  // references for DOM elements so we only have to set them once
  _textarea: HTMLTextAreaElement;
  _helperText: CommentFormHelperText;

  // form submitted flag so we won't show errors before submission
  _formSubmitted: boolean;

  // Tracked variables for textarea
  @track comment = '';
  @track commentMinLength = CommentForm.COMMENT_MIN_LENGTH;
  @track commentMaxLength = CommentForm.COMMENT_MAX_LENGTH;
  @track textareaValid: boolean;
  @track textareaError = '';

  /**
   * Returns the class list for the text area based on
   * the state of the form
   */
  get textareaClassList() {
    if (this._formSubmitted && this.textareaValid) {
      return CommentForm.TEXTAREA_VALID_CLASS;
    } else if (this._formSubmitted && !this.textareaValid) {
      return CommentForm.TEXTAREA_INVALID_CLASS;
    }
    return CommentForm.TEXTAREA_DEFAULT_CLASS;
  }

  /**
   * Get any DOM element references here
   */
  renderedCallback() {
    this._textarea = (this.template as any).querySelector('textarea');
    this._helperText = (this.template as any).querySelector(
      'tfs-comment-form-helper-text'
    );
  }

  /**
   * Triggered when textarea is focused
   */
  handleFocus() {
    this._helperText.showHelperText(500);
  }

  /**
   * Triggered when textarea losses focus
   */
  handleBlur() {
    this._helperText.hideHelperText();
  }

  /**
   * Triggered when user types in the textarea.
   * Used to update the textarea value variable.
   * @param e
   */
  handleInput(e: Event) {
    this.comment = (e.target as HTMLTextAreaElement).value;
  }

  /**
   * Triggered when a key is pressed down in the text area.
   * Used to submit the form and control the helper text.
   * @param e
   */
  handleKeyDown(e: KeyboardEvent) {
    if (!this._formSubmitted) {
      // hide the submit helper text if user is typing
      this._helperText.hideHelperText();

      // show the submit helper text if user stops typing for half a second
      this._helperText.showHelperText(500);
    } else {
      // if use already submitted check validity while they type
      this._checkFormValidity();
    }

    // detect submit keys (ctrl + enter) or (command + enter)
    if ((e.keyCode === 10 || e.keyCode === 13) && (e.ctrlKey || e.metaKey)) {
      this.submitForm();
    }
  }

  /**
   * Submit the form (if valid)
   */
  submitForm() {
    this._formSubmitted = true;
    this._helperText.hideHelperText();

    if (this._checkFormValidity()) {
      const customEvent = new CustomEvent('formsubmit', {
        detail: { value: this.comment },
        bubbles: true,
        cancelable: true,
        composed: true
      });
      this.dispatchEvent(customEvent);

      this.comment = '';
    }
  }

  /**
   * Checks the forms validity and shows error messages if invalid
   */
  _checkFormValidity(): boolean {
    this.textareaValid = this._textarea.validity.valid;

    if (this.textareaValid) {
      this.textareaError = '';
    } else {
      if (this._textarea.validity.tooShort) {
        this.textareaError = CommentForm.TEXTAREA_ERRORS.get(
          TextareaError.TooShort
        );
      } else if (this._textarea.validity.tooLong) {
        this.textareaError = CommentForm.TEXTAREA_ERRORS.get(
          TextareaError.TooLong
        );
      } else if (this._textarea.validity.valueMissing) {
        this.textareaError = CommentForm.TEXTAREA_ERRORS.get(
          TextareaError.Required
        );
      } else {
        this.textareaError = CommentForm.TEXTAREA_ERRORS.get(
          TextareaError.Generic
        );
      }
    }

    return this.textareaValid;
  }
}
