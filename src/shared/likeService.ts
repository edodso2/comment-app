import Comment from './comment';
import ServiceResponse from './serviceResponse';
import Like from './like';

/**
 * Like Service
 *
 * Allows user to like and unlike comments
 */
export default class LikeService {
  private likesCollectionName: string;
  private topicComments: firebase.firestore.CollectionReference;
  private firebase: firebase.app.App;

  /**
   * Constructor
   * @param firebase the firebase app
   * @param topicId The id of the topic document to add/delete
   * comments on
   */
  constructor(
    firebase: firebase.app.App,
    blogsCollectionName: string,
    topicId: string,
    commentsCollectionName: string,
    likesCollectionName: string
  ) {
    this.firebase = firebase;
    this.likesCollectionName = likesCollectionName;
    this.topicComments = this.firebase
      .firestore()
      .collection(blogsCollectionName)
      .doc(topicId)
      .collection(commentsCollectionName);
  }

  /**
   * Get the likes for a comment
   * @param commentId The id of the comment to retrieve likes for
   */
  async getLikes(commentId: string): Promise<ServiceResponse<Like[]>> {
    let likes: Like[];
    let error: Error;

    try {
      // query the likes
      const query = await this.topicComments
        .doc(commentId)
        .collection(this.likesCollectionName)
        .get();
      likes = query.docs.map(rawLike => Like.fromFirebaseDoc(rawLike));
    } catch (e) {
      error = new Error(`Failed to get likes for comment with id ${commentId}`);
    }

    return {
      data: likes,
      error: error
    };
  }

  /**
   * Like a comment
   * @param comment The comment to like
   * @param user The user liking the comment
   */
  async likeComment(
    comment: Comment,
    userId: string
  ): Promise<ServiceResponse<Comment>> {
    // validate user does not already like the comment
    if (comment.likes.some(l => l.uid === userId)) {
      return {
        error: new Error('The user already likes this comment'),
        data: comment
      };
    }

    // create the new like
    let newLike = new Like(userId, new Date());

    try {
      // post the like
      await this.topicComments
        .doc(comment.id)
        .collection(this.likesCollectionName)
        .doc(userId)
        .set(newLike.toFirebaseData());
    } catch (error) {
      return {
        data: comment,
        error: new Error('Failed to like comment')
      };
    }

    // if successful, add the user to the comment's likes
    comment.likes.push(newLike);

    return {
      data: comment,
      error: null
    };
  }

  /**
   * Unlike a comment
   * @param comment The comment to unlike
   * @param user The user unliking the comment
   */
  async unlikeComment(
    comment: Comment,
    userId: string
  ): Promise<ServiceResponse<Comment>> {
    // check if user does not like the comment
    if (comment.likes.every(u => u.uid !== userId)) {
      return {
        error: new Error('The user does not like this comment'),
        data: comment
      };
    }

    // delete the like
    try {
      await this.topicComments
        .doc(comment.id)
        .collection(this.likesCollectionName)
        .doc(userId)
        .delete();

      // if successful, remove the old like from the comment's likes
      const oldLikeIndex = comment.likes.findIndex(l => l.uid === userId);
      comment.likes.splice(oldLikeIndex, 1);
    } catch (error) {
      return {
        error: new Error('Failed to unlike comment'),
        data: comment
      };
    }

    return {
      data: comment,
      error: null
    };
  }
}
