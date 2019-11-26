import { LightningElement, api } from 'lwc';

import Comment from '../../../shared/comment';

/**
 * Comment List
 *
 * Iterates over the list of comments.
 */
export default class CommentList extends LightningElement {
  @api comments: Comment[];

  get showComments(): boolean {
    return this.comments.length > 0;
  }
}
