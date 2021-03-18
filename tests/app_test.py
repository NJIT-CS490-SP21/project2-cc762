"""
Testing for app.py
"""
import unittest
from unittest.mock import patch
import os
import sys

sys.path.append(os.path.abspath("../"))


from app import check_win, on_board_update, add_user, get_leader_board

KEY_INPUT = "input"
KEY_EXPECTED = "expected"
KEY_LENGTH = "length"


class AddUserTestCase(unittest.TestCase):
    """
    DOCSTRING
    """
    def setUp(self):
        """
        DOCSTRING
        """
        self.success_test_params = [{
            KEY_INPUT: "ckc",
            KEY_EXPECTED: {
                "name": "ckc",
                "xo": "X"
            }
        }]
        self.success_test_params.append({
            KEY_INPUT: "cc",
            KEY_EXPECTED: {
                "name": "cc",
                "xo": "O"
            }
        })

    def test_add_user(self):
        """
        DOCSTRING
        """
        for test in self.success_test_params:
            actual_result = add_user(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]
            self.assertEqual(actual_result, expected_result)


class WinTestCase(unittest.TestCase):
    """
    DOCSTRING
    """
    def setUp(self):
        """
        DOCSTRING
        """
        self.success_test_params = [{
            KEY_INPUT: ["X", "O", "-", "-", "X", "O", "-", "-", "X"],
            KEY_EXPECTED:
            "X"
        }]
        self.success_test_params.append({
            KEY_INPUT: ["X", "X", "-", "O", "O", "O", "X", "X", "-"],
            KEY_EXPECTED:
            "O"
        })

    def test_win(self):
        """
        DOCSTRING
        """
        for test in self.success_test_params:
            actual_result = check_win(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]
            self.assertEqual(actual_result, expected_result)


class DummyPlayer():
    """
    For use with mocking
    """
    def __init__(self):
        """
        Constructor
        """
        self.username = "cc"
        self.points = 101
        self.wins = 1
        self.losses = 0


class GetLeaderBoardTestCase(unittest.TestCase):
    """
    DOCSTRING
    """
    def setUp(self):
        self.success_test_params = [{
            KEY_INPUT: "",
            KEY_EXPECTED: [{'username': 'cc', 'points': 101, 'wins': 1, 'losses': 0}]
        }]

    def test_leader(self):
        """
        Tests if the leaderboard returns correctly
        """
        for test in self.success_test_params:
            with patch("app.query_for_leaderboard", fake_leader):
                actual_result = get_leader_board()
                expected_result = test[KEY_EXPECTED]
                self.assertEqual(actual_result, expected_result)

def fake_leader():
    """
    For use with patch
    """
    return [DummyPlayer()]


class OnBoardUpdateTestCase(unittest.TestCase):
    """
    DOCSTRING
    """
    def setUp(self):
        """
        DOCSTRING
        """
        self.success_test_params = [{
            KEY_INPUT: {
                "num": 4,
                "usr": {
                    "xo": "X"
                }
            },
            KEY_EXPECTED: ["-", "-", "-", "-", "X", "-", "-", "-", "-"]
        }]

    def test_board(self):
        """
        Tests the board update function
        """
        for test in self.success_test_params:
            actual_result = on_board_update(test[KEY_INPUT])
            expected_result = test[KEY_EXPECTED]

            self.assertEqual(actual_result, expected_result)


if __name__ == '__main__':
    unittest.main()
