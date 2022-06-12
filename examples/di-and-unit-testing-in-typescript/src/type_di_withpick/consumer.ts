import { Dependency } from "./dependency";

export class Consumer {
  dependency: Pick<Dependency, "someFunction">;
  constructor(dependency: Pick<Dependency, "someFunction">) {
    this.dependency = dependency
  }

  doThing() {
    return this.dependency.someFunction()
  }
}