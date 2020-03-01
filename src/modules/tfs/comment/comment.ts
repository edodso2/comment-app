import { LightningElement, api, track } from 'lwc';

import CommentObj from '../../../shared/comment';
import User from '../../../shared/user';

/**
 * Comment
 *
 * Displays a single comment
 */
export default class Comment extends LightningElement {
  @track showPlaceholderImg = false;

  @api comment: CommentObj;
  @api currentUser: User;

  get commentDate() {
    return this.comment.date.toLocaleDateString();
  }

  handleImgError() {
    this.showPlaceholderImg = true;
  }
}
