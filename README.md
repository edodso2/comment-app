# Comment App

Easily integrate comments on any web site with (almost) zero code.

## Features

1. View and add comments
2. Google sign in to prevent anonymous user spam
3. Firebase database for easy setup and integration
4. All functionality encapsulated in a single web component: `<tfs-comment-app>`.

## How to use

Using the comments app requires three steps:

1. setting up a database
2. configuring database security rules
3. adding the comments app web component to your site

### Setting up a database

The comments app uses firebase due to the simplicity and ease of use. Note that below
steps are very generic and may require some additional reading of the firebase docs.

1. setup a firebase app at: https://firebase.google.com/
2. once your app is setup add a firestore database
3. then under authentication enable google authentication
4. now add a web app to your firebase app and copy the config script
5. in your app add the firebase app, firebase firestore & firebase auth libraries along with the config script. The final script setup should look something like this:

```JavaScript
  <script src="https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/7.4.0/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/7.4.0/firebase-firestore.js"></script>
  <script>
    const firebaseConfig = {
      apiKey: 'your api key',
      authDomain: 'your auth domain',
      databaseURL: 'your database url',
      projectId: 'your project id',
      storageBucket: 'your bucket',
      messagingSenderId: 'your message sender id',
      appId: 'your app id'
    };
    firebase.initializeApp(firebaseConfig);
  </script>
```

### Configuring database security rules

The comments app suggests implementing a Firestore database with custom security rules. Failure to implement security rules will allow users
to perform unauthorized operations, such as editing comments they do not own or liking comments multiple times. The following
security rules will add default security in your Firestore comments app database. Modify these rules at your own risk.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

		// The path to your topic's comment collection
    match /blogs/{YOUR_TOPIC}/comments {

    	// Set rules for all comments
    	match /{comment}{

      	// Allow all comments to be publicly read
      	allow read: if true

        // Allow any authenticated user to create a comment
        // and prevent users from creating impersonated comments for other users
        allow create: if request.auth.uid != null
        							&& request.resource.data.uid == request.auth.uid

        // Set rules for likes
        match /likes/{like}{

          // Allow all likes to be publicly read
        	allow read: if true

          // Allow any authenticated user to like a comment
          // and prevent users from creating impersonated likes for other users
          allow create: if request.auth.uid != null
          							&& request.resource.data.uid == request.auth.uid

          // Allow any authenticated user to unlike a comment
          // and prevent users from deleting likes by other users
          allow delete: if request.auth.uid != null
          							&& resource.data.uid == request.auth.uid
				}
      }
    }
  }
}

```

### Adding the comment app web component

1. under releases download the distribution files for the most recent release
2. add the tfsCommentApp.js script to your project
3. add the `tfs-comment-app` web component to your HTML file(s) where you want comments
   to be displayed
4. you must pass a unique id for the comments topic. For example on a blog site this could
   be the title of the blog post as long as that title is unique.
5. you must also set the public firebase property on the web component. Below is what the final setup should be:

HTML:

```HTML
<tfs-comment-app topic-id="my awesome blog post"></tfs-comment-app>
```

JavaScript:

```JavaScript
// set firebase instance on comments app
window.onload = function () {
  const commentApp = document.querySelector('tfs-comment-app');
  commentApp.firebase = firebase;
}
```

If you need additional help you can check the `src/index.html` file where the complete setup is shown.

## Development

This project is build use the lightning web components framework. Learn more at https://lwc.dev/.

To run the project locally:

1. `git clone https://github.com/edodso2/comment-app.git`
2. `npm install`
3. `npm run watch`

## Contributing

Contributions welcome, creating an issue is recommended before creating a pull request.
