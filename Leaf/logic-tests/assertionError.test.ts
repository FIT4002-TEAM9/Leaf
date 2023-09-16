import { AssertionError } from '../src/language/errors/AssertionError';

describe('AssertionError', () => {
    it('should throw an AssertionError', () => {
        expect(() => {
            throw new AssertionError('This is an assertion error');
        }).toThrowError('[ASSERTION ERROR] This is an assertion error');
    });
});
