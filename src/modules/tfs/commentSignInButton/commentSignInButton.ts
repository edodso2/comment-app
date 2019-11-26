import { LightningElement } from 'lwc';

/**
 * Google sign in button
 */
export default class CommentSignInButton extends LightningElement {
  handleClick() {
    const customEvent = new CustomEvent('signinclick', {
      bubbles: true,
      cancelable: true,
      composed: true
    });
    this.dispatchEvent(customEvent);
  }
}
