"""
your implementation should be in `tiny_grep.py`, then, install `pytest` and run:

```bash
pytest -q
```

You can also run just this test file:

```bash
pytest -q test_tiny_grep.py
```

One important detail:
Uncomment the Case-insensitive matching test if U're working on the bonus :D (lines 188-229)
"""
import pytest

from tiny_grep import matches, find_matches


# --------------------------------------------------
# Basic pattern matching
# --------------------------------------------------

def test_exact_match():
    assert matches("hello", "hello")


def test_question_mark_matches_one_character():
    assert matches("hello", "h?llo")


def test_question_mark_must_match_exactly_one():
    assert not matches("hello", "h?ll")


def test_question_mark_cannot_match_empty():
    assert not matches("", "?")


def test_question_mark_cannot_match_extra_character():
    assert not matches("hello", "hello?")


# --------------------------------------------------
# Star (*) matching
# --------------------------------------------------

def test_star_matches_zero_or_more_characters():
    assert matches("hello", "h*")


def test_star_matches_everything():
    assert matches("hello", "*")


def test_star_at_both_ends():
    assert matches("hello", "*ell*")


def test_star_in_middle():
    assert matches("hello world", "h*world")


def test_star_can_match_zero_characters():
    assert matches("abc", "a*c")


def test_multiple_stars():
    assert matches("abc", "a**c")


def test_only_stars():
    assert matches("abc", "***")


def test_star_matches_empty_string():
    assert matches("", "*")


def test_empty_pattern_matches_empty_string():
    assert matches("", "")


def test_empty_pattern_does_not_match_nonempty_string():
    assert not matches("abc", "")


# --------------------------------------------------
# Negative cases
# --------------------------------------------------

def test_wrong_literal_does_not_match():
    assert not matches("hello", "bye*")


def test_pattern_longer_than_text():
    assert not matches("abc", "abcdef")


def test_text_longer_than_pattern():
    assert not matches("abcdef", "abc")


def test_question_mark_and_star_combination():
    assert matches("hello", "h?l*")


def test_wrong_question_mark_position():
    assert not matches("hello", "?elloX")


# --------------------------------------------------
# find_matches()
# --------------------------------------------------

def test_find_matches(tmp_path):
    log_file = tmp_path / "log.txt"

    log_file.write_text(
        "INFO: Starting server\n"
        "INFO: Loading configuration\n"
        "ERROR: connection timeout\n"
        "INFO: Retrying...\n"
        "ERROR: request timeout!\n"
        "INFO: Server stopped\n"
    )

    result = find_matches(str(log_file), "ERROR:*timeout?")

    assert result == [
        (3, "ERROR: connection timeout"),
        (5, "ERROR: request timeout!"),
    ]


def test_find_matches_returns_correct_line_numbers(tmp_path):
    log_file = tmp_path / "test.txt"

    log_file.write_text(
        "foo\n"
        "bar\n"
        "foo\n"
        "baz\n"
        "foo\n"
    )

    assert find_matches(str(log_file), "foo") == [
        (1, "foo"),
        (3, "foo"),
        (5, "foo"),
    ]


def test_find_matches_with_star(tmp_path):
    log_file = tmp_path / "test.txt"

    log_file.write_text(
        "apple\n"
        "banana\n"
        "apricot\n"
        "orange\n"
    )

    assert find_matches(str(log_file), "ap*") == [
        (1, "apple"),
        (3, "apricot"),
    ]


def test_find_matches_no_matches(tmp_path):
    log_file = tmp_path / "test.txt"

    log_file.write_text(
        "hello\n"
        "world\n"
        "python\n"
    )

    assert find_matches(str(log_file), "xyz") == []


# --------------------------------------------------
# Case-insensitive matching
# --------------------------------------------------

# def test_ignore_case():
#     assert matches("ERROR: disk full", "error:*", ignore_case=True)


# def test_case_sensitive_by_default():
#     assert not matches("ERROR: disk full", "error:*")


# def test_find_matches_ignore_case(tmp_path):
#     log_file = tmp_path / "log.txt"

#     log_file.write_text(
#         "INFO: Starting\n"
#         "ERROR: connection timeout\n"
#         "Error: disk full\n"
#         "error: invalid request\n"
#         "INFO: Done\n"
#     )

#     assert find_matches(
#         str(log_file),
#         "error:*",
#         ignore_case=True,
#     ) == [
#         (2, "ERROR: connection timeout"),
#         (3, "Error: disk full"),
#         (4, "error: invalid request"),
#     ]


# def test_find_matches_case_sensitive_by_default(tmp_path):
#     log_file = tmp_path / "log.txt"

#     log_file.write_text(
#         "ERROR: connection timeout\n"
#         "Error: disk full\n"
#         "error: invalid request\n"
#     )

#     assert find_matches(str(log_file), "error:*") == [
#         (3, "error: invalid request"),
#     ]
