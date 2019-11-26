import { LightningElement, api, track } from 'lwc';

/**
 * Comment Form Helper Text
 *
 * Helper text for the commetn form that will inform the user
 * what keys to press to submit the form.
 */
export default class CommentFormHelperText extends LightningElement {
  static HELPER_TEXT_CLASS_HIDDEN = 'helper-text hidden';
  static HELPER_TEXT_CLASS_VISIBLE = 'helper-text';

  _helperTextHideTimeout: any;

  @track helperTextVisible = false;

  @api
  showHelperText(delay: number) {
    this._helperTextHideTimeout = setTimeout(() => {
      this.helperTextVisible = true;
    }, delay);
  }

  @api
  hideHelperText() {
    this.helperTextVisible = false;
    clearTimeout(this._helperTextHideTimeout);
  }

  get helperTextClassList() {
    if (this.helperTextVisible) {
      return CommentFormHelperText.HELPER_TEXT_CLASS_VISIBLE;
    }
    return CommentFormHelperText.HELPER_TEXT_CLASS_HIDDEN;
  }
}
