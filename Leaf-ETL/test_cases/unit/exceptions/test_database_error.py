import unittest
from src.exceptions.DatabaseError import DatabaseError


class TestDatabaseError(unittest.TestCase):
    """
    Unit tests for the DatabaseError exception class.
    """

    def test_database_error_without_original_error(self):
        """
        Test DatabaseError initialization without an original error.

        Verifies that the error message is correctly set and no original error is present.
        """
        error_message = "Test error message"
        error = DatabaseError(error_message)

        # Check that the string representation of the error matches the error message
        self.assertEqual(str(error), error_message)

        # Check that the error message attribute is correctly set
        self.assertEqual(error.message, error_message)

        # Check that the original error attribute is None
        self.assertIsNone(error.original_error)

    def test_database_error_with_original_error(self):
        """
        Test DatabaseError initialization with an original error.

        Verifies that the error message and original error are correctly set.
        """
        error_message = "Test error message"
        original_exception = Exception("Original exception message")
        error = DatabaseError(error_message, original_exception)

        expected_message = f"{error_message} (Original exception: {original_exception})"

        # Check that the string representation of the error includes the original exception message
        self.assertEqual(str(error), expected_message)

        # Check that the error message attribute is correctly set
        self.assertEqual(error.message, error_message)

        # Check that the original error attribute is correctly set
        self.assertEqual(error.original_error, original_exception)
