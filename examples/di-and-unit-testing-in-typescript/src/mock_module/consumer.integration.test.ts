import { Consumer } from './consumer'

describe('given a consumer', () => {
  const consumer = new Consumer()

  it('should properly do its thing', () => {
    expect(consumer.doThing()).toStrictEqual('someValue')
  })
})