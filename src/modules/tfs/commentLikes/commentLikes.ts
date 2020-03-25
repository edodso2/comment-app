import { LightningElement, api, track } from 'lwc';
import User from '../../../shared/user';
import CommentObj from '../../../shared/comment';
import { UnauthorizedEvent } from '../../../shared/unauthorizedEvent';

export default class CommentLikes extends LightningElement {
  @track isLiked = false;
  @track likeCount = 0;

  @api comment: CommentObj;
  @api currentUser: User;

  connectedCallback() {
    // these are not calculated getters so that we can manually and immediately
    // set them when the user clicks the like/unlike button
    this.isLiked =
      this.currentUser &&
      this.comment.likes.some(u => u.uid === this.currentUser.uid);
    this.likeCount = this.comment.likes.length;
  }

  likeComment() {
    if (this._canLike()) {
      // mark commment as liked
      this.isLiked = true;
      this.likeCount++;

      // raise liked event
      const likedEvent = new CustomEvent('likecomment', {
        detail: { comment: this.comment, userId: this.currentUser.uid },
        bubbles: true,
        cancelable: true,
        composed: true
      });

      this.dispatchEvent(likedEvent);
    } else {
      this.dispatchEvent(new UnauthorizedEvent());
    }
  }

  unlikeComment() {
    if (this._canLike()) {
      // remove comment as liked
      this.isLiked = false;
      this.likeCount--;

      // raise unliked event
      const unlikedEvent = new CustomEvent('unlikecomment', {
        detail: { comment: this.comment, userId: this.currentUser.uid },
        bubbles: true,
        cancelable: true,
        composed: true
      });

      this.dispatchEvent(unlikedEvent);
    } else {
      this.dispatchEvent(new UnauthorizedEvent());
    }
  }

  _canLike() {
    return this.currentUser;
  }
}
