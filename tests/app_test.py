import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys

KEY_INPUT = "input"
KEY_EXPECTED = "expected"
KEY_LENGTH = "length"


class addUserTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [{KEY_INPUT: "ckc", KEY_EXPECTED: "ckc"}]

    def test_add_user(self):
        for test in self.success_test_params:
            actual_result = test[KEY_INPUT]
            expected_result = test[KEY_EXPECTED]
            self.assertEqual(actual_result, expected_result)


class winTestCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [{KEY_INPUT: "ckc", KEY_EXPECTED: "ckc"}]

    def test_win(self):
        for test in self.success_test_params:
            actual_result = test[KEY_INPUT]
            expected_result = test[KEY_EXPECTED]
            self.assertEqual(actual_result, expected_result)


class on_board_update(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [{
            KEY_INPUT: {
                "num": "5",
                "usr": {
                    "xo": "X"
                }
            },
            KEY_EXPECTED: ["-", "-", "-", "-", "X", "-", "-", "-", "-"]
        }]

    def test_win(self):
        for test in self.success_test_params:
            actual_result = on_board_update(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]

            self.assertEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()
