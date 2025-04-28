# Game Backend Developer Assignment

This repository contains the boilerplate code for a coding assignment.
You have received 4 assignment tasks in a separate PDF by email.

## Disclaimer

*This boilerplate code is intentionally sloppy and incomplete.
Follow best practices, identify the flaws and improve the code where you see fit.*

## Preparation

- Download and install the [Firebase CLI](https://firebase.google.com/docs/cli)
- Download this repository as a zip (don't fork or clone) and commit the initial state to a new public repository of your choice (e.g. on Github).
- Commit your changes in meaningful units and speaking commit messages


## We have provided the boilerplate for:
1. The Firebase scaffolding to run in the Firebase Emulator
2. A `functions/` folder for cloud function endpoints based on express
   - Currently just one endpoint to fetch games
3. An `admin/` folder for an Admin frontend based on React and ant.design
   - Currently just the Layout and the Table view of existing games
      with a hardwired table content directly imported from a JSON file
4. The `games.json` file to seed a Firestore database (the same JSON file
   that's currently imported directly in the frontend)

*Note: Check the package.json scripts in the `functions/` and `admin/` folders*


## We will evaluate your submission by:

1. Cloning your repository
2. Reviewing your code
3. Running the package json scripts mentioned in the assignment PDF