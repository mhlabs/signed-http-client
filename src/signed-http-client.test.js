const OLD_ENV = process.env;
process.env = { ...OLD_ENV, ApiBaseUrl: 'https://test.test' };
const axios = require('axios');
const tested = require('./signed-http-client');

jest.mock('axios');
jest.mock('aws4');

jest.mock('aws4', () => ({
  sign: jest.fn().mockImplementation(req => req)
}));

afterAll(() => {
  process.env = OLD_ENV;
});

describe('setGlobalHeaders', () => {
  it('should single header', async () => {
    tested.setGlobalHeaders({
      'x-correlation-id': 'test-id'
    });

    await tested.get('/test');
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-correlation-id': 'test-id'
        })
      })
    );
  });

  it('should set many headers', async () => {
    tested.setGlobalHeaders({
      'x-correlation-id': 'test-id',
      'x-some-other-id': 'some-other-id'
    });

    await tested.get('/test');
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-correlation-id': 'test-id',
          'x-some-other-id': 'some-other-id'
        })
      })
    );
  });
});
