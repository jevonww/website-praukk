export abstract class BaseModel<T> {
  protected data: T;

  constructor(data: T) {
    this.data = data;
  }

  toJSON(): T {
    return this.data;
  }

  get record(): T {
    return this.data;
  }
}
