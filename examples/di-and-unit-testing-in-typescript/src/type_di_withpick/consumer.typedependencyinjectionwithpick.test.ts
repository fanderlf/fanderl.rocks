import { Consumer } from './consumer'

describe('when doing thing on consumer', () => {
  const dependency = {
    someFunction: jest.fn()
  }
  const consumer = new Consumer(dependency)

  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  it('should it should return value from some function', () => {
    dependency.someFunction.mockReturnValue('stub value')
    expect(consumer.doThing()).toStrictEqual('stub value')
  })

  it('should have called some function', () => {
    consumer.doThing()
    expect(dependency.someFunction).toHaveBeenCalledTimes(1)
  })
})