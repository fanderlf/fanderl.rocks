import { Dependency } from "./dependency";

export class Consumer {
  dependency: Dependency;
  constructor() {
    this.dependency = new Dependency()
  }

  doThing() {
    return this.dependency.someFunction()
  }
}