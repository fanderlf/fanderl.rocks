import { Consumer } from './consumer'

describe('when doing thing on consumer', () => {
  it('should it should return value from some function', () => {
    const dependency = {
      someFunction: () => 'stub value'
    }
    const consumer = new Consumer(dependency)
    expect(consumer.doThing()).toStrictEqual('stub value')
  })

  it('should have called some function', () => {
    let wasCalled = false
    const dependency = {
      someFunction: () => {
        wasCalled = true;
        return 'stub value'
      }
    }
    const consumer = new Consumer(dependency)
    consumer.doThing()
    expect(wasCalled).toBeTruthy()
  })
})