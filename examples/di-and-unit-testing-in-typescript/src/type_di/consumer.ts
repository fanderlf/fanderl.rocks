type HasSomeFunction = {
  someFunction: () => string
}

export class Consumer {
  dependency: HasSomeFunction;
  constructor(dependency: HasSomeFunction) {
    this.dependency = dependency
  }

  doThing() {
    return this.dependency.someFunction()
  }
}