import { Dependency } from "./dependency";

export class Consumer {
  dependency: Dependency;
  constructor(dependency: Dependency) {
    this.dependency = dependency
  }

  doThing() {
    return this.dependency.someFunction()
  }
}