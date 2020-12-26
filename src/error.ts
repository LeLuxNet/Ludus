export class RatelimitingError extends Error {
  constructor() {
    super("You have been rate limited");
  }
}
