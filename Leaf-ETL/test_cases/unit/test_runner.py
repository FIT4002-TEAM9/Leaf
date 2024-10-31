import unittest


# Define a function to create a test suite
def suite():
    # Create a TestLoader instance
    loader = unittest.TestLoader()

    # Create a TestSuite instance
    test_suite = unittest.TestSuite()

    # Add all test cases matching the pattern 'test_*.py' from the 'test_cases' directory to the test suite
    test_suite.addTest(loader.discover('test_cases', pattern='test_*.py'))

    # Return the test suite
    return test_suite


if __name__ == '__main__':
    # Create a Test Runner instance with verbosity level 2
    runner = unittest.TextTestRunner(verbosity=2)

    runner.run(suite())
