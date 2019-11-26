import { LightningElement, api, track } from 'lwc';
import User from '../../../shared/user';
import CommentService from '../../../shared/commentService';
import Comment from '../../../shared/comment';

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
  _user: User;

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
   * Only show the form if the user has not already
   * commented
   */
  get hideCommentForm() {
    if (this.isAuthenticated && this.isInitialized) {
      return (
        this.commentList.find(
          (comment: Comment) => comment.uid === this._user.uid
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
   * Handles the comment form submission by adding
   * the comment to firebase
   * @param event
   */
  async handleFormSubmission(event: CustomEvent) {
    const res = await this._commentService.addComment(
      event.detail.value,
      this._user
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

    // instantiate comment service
    this._commentService = new CommentService(this.firebase, this.topicId);

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

    this._user = {
      uid: user.uid,
      userName,
      userPhoto
    };
  }
}
