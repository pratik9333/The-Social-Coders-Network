# Social Coders Network

The social coders network helps to connect and share coding background and experience with programmers from all around the world. 

- Users can log in and add their add upto four coding profiles such as leetcode, codechef, codeforces and github. 
- The scrapper will scrap coding websites and will show the coding background and experience of the user. 
- It has peer review feed feature, where other can rate/vote the candidate profile based on their coding experience. 
- On the basis of upvote/downvote on the candidate's profile, a rating algorithm is created to score the candidate. 
- You can add new friends/refer to see your profile and can start conversation for collaboration, sharing experience etc.  
- A leaderboard where everyone can see the global users as well as their friends with their overall rating(based on peer review)


## Install

Some basic Git commands are:

```
$ git clone git@github.com:pratik9333/Social-Coding-Experience.git
$ cd Social-Coding-Experience
```


## Setup

- Setup Node.js and editor on your PC

   - [Download node.js](https://nodejs.org/en/download)
   - [Setup Editor](https://docs.flutter.dev/get-started/editor?tab=vscode)

```
Create .env file that include:

  * CLOUD_NAME, API_KEY, APP_KEY => cloudinary configuration. 
  * COOKIE_EXPIRES, JWT_SECRET, JWT_EXPIRES, PORT => basic configuration
  * API_SECRET => github action auth secret. 
  * DB_URL => mongodb atlas configuration
```

## Start development

```
$ npm run dev
```

## Simple build for production

```
$ npm run build
```

## Run build for production

```
$ npm start
```


## Languages & tools

- [Node](https://nodejs.org/en/)

- [Express](https://expressjs.com/)

- [Mongoose](https://mongoosejs.com/)

- [Atlas](https://www.mongodb.com/atlas/database)

- [Cloudinary](https://cloudinary.com)

- [React](https://reactjs.org/)

- [Webpack](https://webpack.js.org/)


### Code Formatter

- Add a `.vscode` directory
- Create a file `settings.json` inside `.vscode`
- Install Prettier - Code formatter in VSCode
- Add the following snippet:  

```json

    {
      "editor.formatOnSave": true,
      "prettier.singleQuote": true,
      "prettier.arrowParens": "avoid",
      "prettier.jsxSingleQuote": true,
      "prettier.trailingComma": "none",
      "javascript.preferences.quoteStyle": "single",
    }

```
