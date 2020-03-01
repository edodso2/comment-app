import { LightningElement, api, track } from 'lwc';
import User from '../../../shared/user';
import CommentService from '../../../shared/commentService';
import Comment from '../../../shared/comment';
import LikeService from '../../../shared/likeService';

const BLOGS_COLLECTION = 'blogs';
const COMMENTS_COLLECTION = 'comments';
const LIKES_COLLECTION = 'likes';

/**
 * Comment App
 * This is the root component of the project. It handles
 * all the state of the applicaiton such as:
 * - the logged in user
 * - the current list of comments
 * - if the user is authenticated
 * - if the firebase app is inititalized
 * - if the form should be shown (user has not already commented)
 */
export default class CommentApp extends LightningElement {
  _firebase: firebase.app.App;
  _topicId: string;
  _commentService: CommentService;
  _likeService: LikeService;

  /**
   * The firebase app (passed as reference)
   */
  @api
  get firebase() {
    return this._firebase;
  }
  set firebase(firebase) {
    this._firebase = firebase;
    this._init();
  }

  /**
   * The topic in the datebase comments will
   * be added to
   */
  @api
  get topicId() {
    return this._topicId;
  }
  set topicId(topicId) {
    this._topicId = topicId;
  }

  /**
   * Tracks if the firebase app has been inititalized
   */
  @track isInitialized = false;

  /**
   * Tracks if the user is authenticated
   */
  @track isAuthenticated = false;

  /**
   * Tracks the list of comments shown on the screen
   */
  @track commentList: Comment[] = [];

  /**
   * The current authenticated user.
   */
  @track user: User;

  /**
   * Only show the form if the user has not already
   * commented
   */
  get hideCommentForm() {
    if (this.isAuthenticated && this.isInitialized) {
      return (
        this.commentList.find(
          (comment: Comment) => comment.uid === this.user.uid
        ) !== undefined
      );
    }

    return true;
  }

  /**
   * Triggers the google sign in flow via redirection
   */
  signIn() {
    const provider = new (this.firebase.auth as any).GoogleAuthProvider();
    this.firebase.auth().signInWithRedirect(provider);
  }

  /**
   * Handle a comment being liked by a user
   * @param event The event with the comment to like
   */
  async handleLikeComment(event: CustomEvent) {
    // get the comment to like and liking user from the event
    const likedComment: Comment = event.detail.comment;
    const likingUserId: string = event.detail.userId;

    // like the comment as the current user
    const likeResponse = await this._likeService.likeComment(
      likedComment,
      likingUserId
    );

    //replace the old comment with the liked comment
    const oldCommentIndex = this.commentList.findIndex(
      c => c.id === likedComment.id
    );

    this.commentList.splice(oldCommentIndex, 1, likeResponse.data);
  }

  /**
   * Handle a comment being unliked by a user
   * @param event The event with the comment to unlike
   */
  async handleUnlikeComment(event: CustomEvent) {
    // get the comment to unlike and unliking user from the event
    const unlikedComment: Comment = event.detail.comment;
    const unlikingUserId: string = event.detail.userId;

    // unlike the comment as the current user
    const unlikeResponse = await this._likeService.unlikeComment(
      unlikedComment,
      unlikingUserId
    );

    if (!unlikeResponse.error) {
      // if successful, replace the old comment with the unliked comment
      const oldCommentIndex = this.commentList.findIndex(
        c => c.id === unlikedComment.id
      );
      this.commentList.splice(oldCommentIndex, 1, unlikeResponse.data);
    }
  }

  /**
   * Handles the comment form submission by adding
   * the comment to firebase
   * @param event
   */
  async handleFormSubmission(event: CustomEvent) {
    const res = await this._commentService.addComment(
      event.detail.value,
      this.user
    );
    const comment = res.data;
    this.commentList.unshift(comment);
  }

  /**
   * Inititalize the comment app
   * the topicId and firebase instance
   * must be available for initialization.
   */
  async _init() {
    if (!this.topicId || !this._firebase) {
      return;
    }

    // listen for when the user completes login and setup
    // the user data
    this.firebase.auth().onAuthStateChanged((user: firebase.User) => {
      if (user && user.uid) {
        this.isAuthenticated = true;
        this._setUser(user);
      } else {
        this.isAuthenticated = false;
      }
    });

    // instantiate like service
    this._likeService = new LikeService(
      this.firebase,
      BLOGS_COLLECTION,
      this.topicId,
      COMMENTS_COLLECTION,
      LIKES_COLLECTION
    );

    // instantiate comment service
    this._commentService = new CommentService(
      this.firebase,
      this._likeService,
      BLOGS_COLLECTION,
      this.topicId,
      COMMENTS_COLLECTION
    );

    // get the comments
    const res = await this._commentService.getComments();
    this.commentList = res.data;

    // flag for completion to show UI
    this.isInitialized = true;
  }

  /**
   * Set the user information in a user object
   * @param user the firebase user object
   */
  _setUser(user: firebase.User) {
    let userName: string;
    let userPhoto: string;

    if (user.isAnonymous) {
      userName = 'Anonymous';
      userPhoto = null;
    } else {
      userName = user.providerData[0].displayName;
      userPhoto = user.providerData[0].photoURL;
    }

    this.user = {
      uid: user.uid,
      userName,
      userPhoto
    };
  }
}
