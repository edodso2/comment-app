/**
 * An unauthorized event for child components
 * to inform the parent that an action needs
 * authorization.
 */
export class UnauthorizedEvent extends CustomEvent<null> {
  constructor() {
    super('unauthorized', {
      bubbles: true,
      composed: true
    });
  }
}
