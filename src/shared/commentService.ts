import Comment from './comment';
import User from './user';
import ServiceResponse from './serviceResponse';

const BLOGS_COLLECTION = 'blogs';
const COMMENTS_COLLECTION = 'comments';

/**
 * Comment Service
 *
 * Provides methods for basic CRUD operations
 * on the firebase database
 */
export default class CommentService {
  private topicComments: firebase.firestore.CollectionReference;
  private firebase: firebase.app.App;

  /**
   * Constructor
   * @param firebase the firebase app
   * @param topicId The id of the topic document to add/delete
   * comments on
   */
  constructor(firebase: firebase.app.App, topicId: string) {
    this.firebase = firebase;
    this.topicComments = this.firebase
      .firestore()
      .collection(BLOGS_COLLECTION)
      .doc(topicId)
      .collection(COMMENTS_COLLECTION);
  }

  async getComments(): Promise<ServiceResponse<Comment[]>> {
    let comments: Comment[];
    let error: Error;

    try {
      const query = await this.topicComments.get();
      comments = query.docs.map(doc => Comment.fromFirebaseDoc(doc));
    } catch (e) {
      error = Error('Failed to fetch comments');
    }

    return {
      data: comments,
      error: error
    };
  }

  async addComment(
    commentText: string,
    user: User
  ): Promise<ServiceResponse<Comment>> {
    let error: Error;
    let comment: Comment;

    try {
      // create a new firebase doc
      const doc = this.topicComments.doc();

      // create the comment
      comment = new Comment(
        doc.id,
        user.uid,
        user.userName,
        user.userPhoto,
        new Date(),
        commentText
      );

      // set the document data
      await doc.set(comment.toFirebaseData());
    } catch (e) {
      error = Error('Failed to add comment');
    }

    return {
      data: comment,
      error: error
    };
  }

  async updateComment(
    id: string,
    comment: Comment
  ): Promise<ServiceResponse<Comment>> {
    let error: Error;

    try {
      // get the current comment
      const currentComment = this.topicComments.doc(id);

      // update the current comment with the new data
      await currentComment.update(comment.toFirebaseData());
    } catch (e) {
      error = Error('Failed to update comment');
    }

    return {
      data: comment,
      error: error
    };
  }

  async deleteComment(id: string): Promise<ServiceResponse<boolean>> {
    let deleted = false;
    let error: Error;

    try {
      await this.topicComments.doc(id).delete();
      deleted = true;
    } catch (e) {
      error = Error('Failed to delete comments');
    }

    return {
      data: deleted,
      error: error
    };
  }
}
