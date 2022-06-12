import { mock, mockReset } from 'jest-mock-extended'
import { Consumer } from './consumer'
import { Dependency } from './dependency'

describe('when doing thing on consumer', () => {
  const dependency = mock<Dependency>()
  const consumer = new Consumer(dependency)

  beforeEach(() => {
    mockReset(dependency)
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