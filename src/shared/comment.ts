declare const firebase: firebase.app.App;

import User from './user';

/**
 * Comment
 *
 * Represents a comment object in the
 * list of comments. Also provides methods
 * for converting to & from a firebase
 * object in order to facilitate the
 * conversion of Timestamps to Date
 * objects.
 */
export default class Comment {
  id: string;
  uid: string;
  userName: string;
  userPhoto: string;
  date: Date;
  comment: string;
  likes: User[];

  constructor(
    id?: string,
    uid?: string,
    userName?: string,
    userPhoto?: string,
    date?: Date,
    comment?: string,
    likes?: User[]
  ) {
    this.id = id;
    this.uid = uid;
    this.userName = userName;
    this.userPhoto = userPhoto;
    this.date = date;
    this.comment = comment;
    this.likes = likes || [];
  }

  toFirebaseData() {
    return {
      id: this.id,
      uid: this.uid,
      userName: this.userName,
      userPhoto: this.userPhoto,
      date: (firebase.firestore as any).Timestamp.fromDate(this.date),
      comment: this.comment,
      likes: this.likes
        ? this.likes.map(u => {
            return {
              uid: u.uid,
              userName: u.userName,
              userPhoto: u.userPhoto
            };
          })
        : []
    };
  }

  static fromFirebaseDoc(doc: firebase.firestore.QueryDocumentSnapshot) {
    const data = doc.data();

    return new Comment(
      data.id,
      data.uid,
      data.userName,
      data.userPhoto,
      data.date.toDate(),
      data.comment,
      data.likes
    );
  }
}
