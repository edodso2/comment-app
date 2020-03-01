declare const firebase: firebase.app.App;

export default class Like {
  uid: string;
  date: Date;

  constructor(uid?: string, date?: Date) {
    this.uid = uid;
    this.date = date;
  }

  toFirebaseData() {
    return {
      uid: this.uid,
      date: (firebase.firestore as any).Timestamp.fromDate(this.date)
    };
  }

  static fromFirebaseDoc(doc: firebase.firestore.QueryDocumentSnapshot) {
    const data = doc.data();

    return new Like(data.uid, data.date ? data.date.toDate() : null);
  }
}
