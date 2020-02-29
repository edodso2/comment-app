import CommentService from './commentService';
import Comment from './comment';
import User from './user';
import ServiceResponse from './serviceResponse';

/**
 * Like Service
 *
 * Allows user to like and unlike comments
 */
export default class LikeService {
  private commentService: CommentService;

  /**
   *
   * @param commentService The service to update the liked comments
   */
  constructor(commentService: CommentService) {
    this.commentService = commentService;
  }

  /**
   *
   * @param comment The comment to like
   * @param user The user liking the comment
   */
  async likeComment(
    comment: Comment,
    user: User
  ): Promise<ServiceResponse<Comment>> {
    // check if user already likes the comment
    if (comment.likes.some(u => u.uid === user.uid)) {
      return {
        error: new Error(`User '${user.userName}' already likes this comment.`),
        data: comment
      };
    }

    // add the user to the comment's likes
    comment.likes.push(user);

    // update the comment
    return this.commentService.updateComment(comment.id, comment);
  }

  /**
   *
   * @param comment The comment to unlike
   * @param user The user unliking the comment
   */
  async unlikeComment(
    comment: Comment,
    user: User
  ): Promise<ServiceResponse<Comment>> {
    // remove the user from the comment's likes
    comment.likes = comment.likes.filter(u => u.uid !== user.uid);

    // update the comment
    return this.commentService.updateComment(comment.id, comment);
  }
}
