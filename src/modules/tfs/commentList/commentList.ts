import { LightningElement, api } from 'lwc';

import Comment from '../../../shared/comment';
import User from '../../../shared/user';

/**
 * Comment List
 *
 * Iterates over the list of comments.
 */
export default class CommentList extends LightningElement {
  @api comments: Comment[];
  @api user: User;

  _id = 0;

  get showComments(): boolean {
    return this.comments.length > 0;
  }

  /**
   * Generate a unique key for the next comment
   * A unique key must be generated so that the comment can be updated
   */
  get nextId() {
    return this._id++;
  }
}
