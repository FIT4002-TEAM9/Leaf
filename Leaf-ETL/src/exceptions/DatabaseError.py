class DatabaseError(RuntimeError):
    """
    A custom exception class for handling database-related errors.

    Attributes:
        message (str): The error message.
        original_error (Exception, optional): The original exception that caused this error.
    """

    def __init__(self, message, original_error=None):
        """
        Initializes the DatabaseError with a message and an optional original error.

        Args:
            message (str): The error message.
            original_error (Exception, optional): The original exception that caused this error. Defaults to None.
        """
        super().__init__(message)
        self.message = message
        self.original_error = original_error

    def __str__(self):
        """
        Returns a string representation of the error, including the original error if present.

        Returns:
            str: The string representation of the error.
        """
        if self.original_error:
            return f"{self.message} (Original exception: {self.original_error})"
        return self.message
