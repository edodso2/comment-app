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

  @track isLiked = false;
  @track likeCount = 0;

  connectedCallback() {
    // these are not calculated getters so that we can manually and immediately
    // set them when the user clicks the like/unlike button
    this.isLiked =
      this.currentUser &&
      this.comment.likes.some(u => u.uid === this.currentUser.uid);
    this.likeCount = this.comment.likes.length;
  }

  get commentDate() {
    return this.comment.date.toLocaleDateString();
  }

  handleImgError() {
    this.showPlaceholderImg = true;
  }

  likeComment() {
    if (this._canLike()) {
      // mark commment as liked
      this.isLiked = true;
      this.likeCount++;

      // raise liked event
      const likedEvent = new CustomEvent('likecomment', {
        detail: { comment: this.comment, user: this.currentUser },
        bubbles: true,
        cancelable: true,
        composed: true
      });

      this.dispatchEvent(likedEvent);
    }
  }

  unlikeComment() {
    if (this._canLike()) {
      // remove comment as liked
      this.isLiked = false;
      this.likeCount--;

      // raise unliked event
      const unlikedEvent = new CustomEvent('unlikecomment', {
        detail: { comment: this.comment, user: this.currentUser },
        bubbles: true,
        cancelable: true,
        composed: true
      });

      this.dispatchEvent(unlikedEvent);
    }
  }

  _canLike() {
    return this.currentUser;
  }
}
