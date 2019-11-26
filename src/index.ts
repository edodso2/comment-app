import { buildCustomElementConstructor } from 'lwc';
import TfsCommentApp from 'tfs/commentApp';

customElements.define(
  'tfs-comment-app',
  buildCustomElementConstructor(TfsCommentApp)
);
