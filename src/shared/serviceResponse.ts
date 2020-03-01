export default interface ServiceResponse<T> {
  data: T;
  error: Error;
}
