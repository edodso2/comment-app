import { LightningElement, api, track } from 'lwc';

export default class CommentSignInModal extends LightningElement {
  @api
  show() {
    this.visible = true;
  }

  @api
  hide() {
    this.visible = false;
  }

  @track visible = false;

  handleBackdropClick() {
    this.visible = false;
  }
}
