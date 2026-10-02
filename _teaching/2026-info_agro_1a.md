---
title: "Corrigés TDs Informatique 1A Agro"
type: "Course"
collection: teaching
author_profile: false
permalink: /teaching/1A_Info_Agro_2026
venue: "Informatique : programmation et bases de données (2026-2027)"
date: 2026-09-30
location: "Campus Agro Paris-Saclay"
---

Je mettrai ici, au fur et à mesure, les corrections des TD, comme alternative aux corrections d'E-campus et en suivant les consignes que je vous donne en cours.

Pensez à consulter régulièrement cette page !


## TD 1 à 4
### 9.1. Exercice Tranches d’âge

<details markdown="1">
<summary>Voir la correction</summary>

```python
# 1. Imports section
import random


# 2. Functions section
def age_evaluator_simplified(age):
    """
    This function prints a message depending on the age range
    """
    if 0 < age <= 10:
        return "Vous êtes un enfant"

    elif 17 >= age > 10:
        return "Vous êtes un adolescent"

    elif 64 >= age > 17:
        return "Vous êtes un adulte"

    elif 100 >= age > 64:
        return "Vous êtes un aı̂né"

    else:
        return "Vous avez un problème avec votre génerateur d'age"


# 3. Main routine section
if __name__ == "__main__":
    gerenated_age_1 = random.randint(1, 100)
    gerenated_age_2 = random.randint(1, 100)

    # This time, I save the age groups in variables because we'll use them multiple times.
    age_group_1 = age_evaluator_simplified(gerenated_age_1)
    age_group_2 = age_evaluator_simplified(gerenated_age_2)

    print(f"Vous avez {gerenated_age_1} ans, {age_group_1}")
    print(f"Vous avez {gerenated_age_2} ans, {age_group_2}")
    print(
        "c'est la meme tranche d'âge"
        if age_group_1 == age_group_2
        else "ce ne sont pas les mêmes tranches d'âge"
    )
```

</details>

### 9.2. Exercice Devine un nombre

<details markdown="1">
<summary>Voir la correction</summary>

```python
# 1. Imports section
import random

# 2. Functions section
# No functions in this excersise

# 3. Main routine section
if __name__ == "__main__":
    number = random.randint(1, 100)
    print("I have a number in mind. Would you be able to guess it !")
    continue_game = True
    counter = 0

    while continue_game and counter < 7:
        user_entry = input("Tap your guess \n")
        guess = int(user_entry)
        if guess == number:
            print(
                f"Congrats, you guessed the number, it was {number}\n you did it in {counter} tries"
            )
            continue_game = False
        else:
            if guess > number:
                print("Nice try, but that's not the number,")
                print(f"The number I'm thinking on is less than {guess}")
            else:
                print("Nice try, but that's not the number,")
                print(f"The number I'm thinking on is more than {guess}")
            counter += 1
            if counter == 7:
                print("Sorry, your tries are over :c")
```

</details>

### 9.3. Exercice Les stars

<details markdown="1">
<summary>Voir la correction</summary>

```python
# 1. Imports section
# It's empty as we don't need any external package on this script


# 2. Functions section
def make_triangle(n: int):
    """
    This function print a triangle of stars by simply printing
    a line of n stars and making n = n-1 for the next iteration.
    """
    for _ in range(n):
        line = n * "*"
        n -= 1
        print(line)


# 3. Main routine section
if __name__ == "__main__":
    base = int(input("Donnez la taille de la base de votre triangle d'étoiles : "))
    make_triangle(base)
```

</details>

### 9.4. Exercice Tri par insertion

<details markdown="1">
<summary>Voir la correction</summary>

```python
# 1. Imports section
# It's empty for now, as we don't need any external package on this script


# 2. Functions section
def insere(liste, elem):
    """
    Fonction qui inset un élement à sa bonne place dans une liste.
    """
    # First of all, we search the position for insering the element.
    i = 0
    while i < len(liste) and liste[i] < elem :
        i +=1
    # We insert elem in i position if it is not the last of the list
    if i < len(liste) :
        liste.insert(i,elem)
    # We insert elem at the end if it is the bigger element into the list
    else:
        liste.append(elem)

    return liste


def tri_par_insertion(liste):
    """
    Fonction qui trie une liste par insertion
    """
    liste_triee = []
    for el in liste :
        liste_triee = insere(liste_triee, el)
    return liste_triee

# 3. Main routine section
if __name__ == "__main__":
    print(insere([1,2,4,5,6,9,10], 11))
    print(tri_par_insertion([10,9,8,7,3,12,13,5,4,1,11,14,2]))
```

</details>

## Pour les éleves avancés

Vous maîtrisez la programmation en Python. Vous avez réalisé au moins tous les exercices obligatoires des travaux dirigés 1 et 2. Je vous propose de programmer un petit « grep ».

<details markdown="1">
<summary>Voir l'excersise</summary>

# Build a Tiny `grep`

In this exercise, you will build a small text-search utility. 

The goal is not to reproduce the full Unix `grep` command ([https://man7.org/linux/man-pages/man1/grep.1.html](https://man7.org/linux/man-pages/man1/grep.1.html)), but to implement a few interesting features yourself.

Develop your tool in the same directory where you should place the [The test file available here](http://julagu.github.io/files/test_tiny_grep.py). 

---

The actual task consist on implementing the following function :

```python
find_matches(filename, pattern)
```

It should search a text file and return every line matching a pattern.

For each match, return:

```python
(line_number, line)
```

For example, given the file:

```text
INFO: Starting server
INFO: Loading configuration
ERROR: connection timeout
INFO: Retrying...
ERROR: request timeout!
INFO: Server stopped
```

this call:

```python
find_matches("log.txt", "ERROR:*timeout?")
```

should find:

```python
[
    (3, "ERROR: connection timeout"),
    (5, "ERROR: request timeout!")
]
```

Your solution should **not repeatedly scan the pattern or text from the beginning unnecessarily**.

**Think about the algorithm before writing lots of code.**

---

## Pattern Syntax

You **must not use regular expressions**.

Instead, take the following special characters into account during implementation:

| Pattern | Meaning                         |
| ------- | ------------------------------- |
| `*`     | Matches zero or more characters |
| `?`     | Matches exactly one character   |

All other characters match themselves.

### Examples

```python
matches("hello", "hello")
# True

matches("hello", "h?llo")
# True

matches("hello", "h*")
# True

matches("hello", "*ell*")
# True

matches("hello world", "h*world")
# True

matches("hello", "h?ll")
# False

matches("hello", "bye*")
# False
```

---

## Requirements

Your implementation must:

1. Process the file line by line. Do **not** load the entire file into memory.

2. Implement the pattern matching yourself (`re`, `fnmatch` and `glob` or any other external library that performs the matching are not allowed).

3. Line numbers start at **1**.

---

## Test Cases

Your implementation should handle at least these cases:

```python
assert matches("hello", "hello")
assert matches("hello", "h?llo")
assert matches("hello", "h*")
assert matches("hello", "*")
assert matches("hello", "*ell*")
assert matches("hello world", "h*world")

assert not matches("hello", "h?ll")
assert not matches("hello", "bye*")
assert not matches("hello", "hello?")
assert not matches("", "?")
```

Also test:

```python
matches("", "")
matches("", "*")
matches("abc", "***")
matches("abc", "a*c")
matches("abc", "a**c")
```

---

## ⭐ Bonus — Add Case-Insensitive Matching

Add an optional parameter:

```python
find_matches(filename, pattern, ignore_case=False)
```

For example:

```python
find_matches("log.txt", "error:*", ignore_case=True)
```

should match:

```text
ERROR: connection timeout
Error: disk full
error: invalid request
```

</details>
