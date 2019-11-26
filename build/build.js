const concat = require('concat');

(async function build() {
  const files = ['./dist/0.app.js', './dist/app.js'];

  await concat(files, 'dist/tfsCommentApp.js');
})();
