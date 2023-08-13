# Github Search Take Home Challenge

#### This project allows users to search for GitHub repositories and manage saved repositories.

<br>

### Core Functionality

**Search Repositories:** Users can search for GitHub repositories using the search bar. Search results are debounced by 500ms to reduce unnecessary API calls.

**Display Search Results:** The search results are displayed in a dropdown list below the search bar. Users can select a repository from the search results, and its details will be displayed.

**Save Repositories:** Users can save a selected repository. Saved repositories are retrieved and displayed in a list.

**Sort Saved Repositories:** Users can sort their saved repositories by name or star count.

**Delete Repositories:** Users can delete a saved repository.

<br>

### Design Decisions

**Custom Hooks:** The logic for interacting with the Github API and provided repository server is abstracted into a separate `repoHooks.ts` file, which along with some utilities, can be found in the `src/utils/` directory.

**Testing:** Jest unit tests cover the key functionality of the repoHooks. They can be found in the `__tests__` directory.

**Libraries:** react-hooks-testing-library was used to facilitate testing of the custom hooks. This library may be deprecated soon, but for the time being it meets a need unmet by react-testing-library. Please see the following for related discussion: [https://github.com/testing-library/react-hooks-testing-library/issues/849]()

**Styles:**
Styles for the component are defined at the bottom of the file in a style sheet. Colors are imported from a separate colors module: `src/styles/colors.ts`.

**Responsive Design:** The component uses the react-native-safe-area-context to adjust its layout based on the device's safe area insets.  
<br>
<br>
<br>

---

The full challenge instructions are below, including instructions for how to get the project running. Once running, please run `npx react-native-asset` to link the font assets.

---

<br>
<br>

# React Native Engineer Challenge (2-5 hrs)

Thanks for trying our development challenge! Let's get started.

### The Challenge

We ask that you write a React Native application capable of the following:

- Search your favorite repositories from Github and select them from a dropdown
  - List item should have name, description, language, and stars visible
- Save them to the server by using the `reposerver` API
- App should have a list view where you are able to sort your favorites by stars (`stargazers_count`)
  - Up to 10 repositories may be saved for a user
  - Repositories should be removable or added
- If the app is refreshed, the saved repositories should populate the list so long as the server is running.

GitHub API (https://developer.github.com/v3/)

UX Requirements:

- Search input for Github repositories should be an autocomplete dropdown

**NOTE** Please treat this as an opportunity to show off, and let us see how you would write and visually present something that you'd be proud of! There is no one "correct" answer.

### The Server

**IMPORTANT**: The server is written to store repositories in memory; as such, should you restart/kill the Docker container you will lose your "database"!

#### A few endpoints

- `GET health` health check
- `GET repo` list all repositories
- `DELETE repo/[repoID]` delete a repo
- `POST repo` create a repository

_Please make sure to add a trailing forward slash (`/`) at the end of every point except for /health (e.g. `curl http://localhost:8080/repo/`)_

#### The Repository object

- id: 1 (string, required) - The unique identifier for a product
- fullName: ethereum/go-ethereum (string, required) - Name of the repository
- stargazersCount: 12 (number, required) - Number of stargazers
- language: ethereum/go-ethereum (string, required) - Programing language
- url: https://api.github.com/repos/ethereum/go-ethereum (string, required) - URL of the repository
- createdAt: 2013-12-26T13:05:46Z (string, required) - CreatedAt of repository

#### JSON

```json
{
  "id": "15452919",
  "fullName": "ethereum/go-ethereum",
  "createdAt": "2013-12-26T13:05:46Z",
  "stargazersCount": 26012,
  "language": "Go",
  "url": "https://api.github.com/repos/ethereum/go-ethereum"
}
```

## Using this app

### Prereqs

- Docker
- Ruby (built-in mac default, 2.6, should be sufficient)

### Setup

```
npm i
npm run ios:setup
```

### Start the API server

In a separate terminal:

```
npm run dev:server
```

```bash
2020/02/05 11:09:44 listening on port 8080
```

### Development

```
npm run ios
```

## Your Solution

Your code should build and run on a Mac (or GNU/Linux machine) running a recent OS.

Please push it to a fresh repository and submit a link to that repository.

Third-party libraries are permitted; however, as our intent is to come to understand your design choices, we ask for a short description of the rationale of your choices.

### Before submitting your code

**IMPORTANT**: To help keep code reviews anonymous, please be sure to remove any sensitive information about yourself from your deliverable.

**We expect you to make sure that your solution works with `reposerver` and the Github v3 API before sending it to us**.

### Acceptance Criteria

We expect you to write **code you would consider production-ready**. This can mean a variety of things, but most importantly we look for code to be well-factored, follow good practices, and be tested.

What we will look for:

- Does your code fulfill the requirement and successfully run against both `reposerver` and the Github v3 API?
- How clean is your design? How easy is it to understand, maintain, or extend your code?
- How did you verify your software, if by automated tests or by other means? How much application code is covered?
- How did you handle empty data states?
- What kind of documentation did you ship with your code?

### Housekeeping notes

- If you run into any issues building the GCR image, **please contact us immediately**
- Please feel free to make assumptions, but ensure to note what they were and how you adapted to them.

Good luck!
