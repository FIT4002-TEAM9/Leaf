import { assert } from '../src/language/assertions/Assert';
import { AssertionError } from '../src/language/errors/AssertionError';

describe('assert', () => {
    it('should not throw an error when condition is true', () => {
        // When the condition is true, assert should not throw an error
        expect(() => assert(true, 'This is a test')).not.toThrow();
    });

    it('should throw an AssertionError when condition is false', () => {
        // When the condition is false, assert should throw an AssertionError
        expect(() => assert(false, 'This is a test')).toThrowError(AssertionError);
    });
});
