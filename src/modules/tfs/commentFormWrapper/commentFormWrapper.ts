import { LightningElement, api, track } from 'lwc';
import { UnauthorizedEvent } from '../../../shared/unauthorizedEvent';

/**
 * Comment Form Wrapper
 *
 * A wrapper for the comment form so that the form
 * is only shown when the user wants to wrtie a comment.
 */
export default class CommentFormWrapper extends LightningElement {
  @api isAuthenticated: boolean;

  @track showCommentForm = false;

  handleCommentClick() {
    if (this.isAuthenticated) {
      this.showCommentForm = true;
    } else {
      this.dispatchEvent(new UnauthorizedEvent());
    }
  }
}
