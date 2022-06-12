import { Consumer } from './consumer'

const mockSomeFunction = jest.fn()

jest.mock('./dependency', () => {
  return {
    Dependency: jest.fn().mockImplementation(() => {
      return {
        someFunction: mockSomeFunction
      }
    })
  }
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('when doing thing on consumer', () => {
  const consumer = new Consumer()
  
  it('should it should return value from some function', () => {
    mockSomeFunction.mockReturnValue('stub value')
    expect(consumer.doThing()).toStrictEqual('stub value')
  })

  it('should have called some function', () => {
    consumer.doThing()
    expect(mockSomeFunction).toHaveBeenCalledTimes(1)
  })
})