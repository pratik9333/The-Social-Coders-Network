<p align="center">
  <img width="380" height="530" src="https://res.cloudinary.com/dqdnwfv3r/image/upload/v1674562207/Social_Coding-3-2_vxzvjs.jpg">
</p>

Unleash the power of global coding community with Social Coding Network - where coders connect, learn and grow together! Collaborate, Innovate, and Succeed!

```js
const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Welcome to our social coding experience api!");
});

app.listen(3000);
```

## Content

- [Motivation](#Motivation)
- [Features](#Features)
- [Built With](#Built-With)
- [Prerequisites](#Prerequisites)
- [Getting Started](#Getting-Started)
- [API Documentation](#API-Documentation)

## Motivation

Social Coding Network is a platform built to connect coders from around the world, fostering a community where they can learn from and collaborate with one another. With the ever-evolving technology industry, staying current with the latest coding languages, techniques, and tools can be challenging. This platform aims to bridge that gap by providing a space for coders to share their knowledge and experiences, helping others to improve their coding skills and advance their careers. With Social Coding Network, coders can connect, learn, and grow together, and become part of a global community of like-minded individuals.

## Features

- Showcase your coding expertise with our website scraper that automatically fetches your profile data from top coding websites.
- Get recognized by the community with our peer review feature.
- Climb the ranks with our rating algorithm that takes into account your coding experience and community feedback.
- Connect and collaborate with coders from around the world by adding friends and refer each other by sharing profiles.
- See where you stand on the global leaderboard and compare yourself against top coders and your friends.

## Built With

- [NodeJS](https://nodejs.org/en/) - Node.js is an open-source, cross-platform, back-end JavaScript runtime environment.
- [MongoDB NoSQL](https://www.mongodb.com) - MongoDB is an open source NoSQL database management program.
- [Docker](https://www.docker.com) - Docker is a software platform that allows you to build, test, and deploy applications quickly.
- [Express.js](https://expressjs.com)- Fast, unopinionated, minimalist web framework for Node.js.
- [Mocha](https://mochajs.org) - Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser.
- [Chai](https://chaijs.com) - Chai is a BDD / TDD assertion library for node and the browser.

## Prerequisites

- [NodeJS](https://nodejs.org/en/) version 16+
- [Docker](https://www.docker.com)

## Getting Started

- To run and access node and mongodb server, just run the below commands

```bash
cd docker
docker-compose up -d --build
```

- Access Backend api's at

```http
http://localhost:80/
```

- Access Mongodb server at

```http
http://localhost:8081/
```

## API Documentation

To understand how to use the api, access to links down below. API collections has been published through postman so that you see and run by simply clicking `run in postman` button at topmost right of page.

1. Auth

- Navigate this link https://documenter.getpostman.com/view/16001457/2s8ZDbWgEZ

2. User

- Navigate this link https://documenter.getpostman.com/view/16001457/2s8ZDbX1G4

3. Friends

- Navigate this link https://documenter.getpostman.com/view/16001457/2s8ZDbWgPJ#intro

4. Rate

- Navigate this link https://documenter.getpostman.com/view/16001457/2s8ZDbX1G3

## Contributing

The Social Coding Network project welcomes all constructive contributions. We are currently creating screens with hardcoded data. We intend to keep the repository `always open`. Feel free to contribute in many forms from code for bug fixes and enhancements, to additions and fixes to documentation, additional tests, triaging incoming pull requests and issues, and more!

## Usefull Links

- - [Deployed api's link](https://social-coding-experience.vercel.app)

## Running Tests

To run the test suite, first install the dependencies, create .env file and copy contents from docker/test.env file then run `npm test`:

```console
$ npm install
$ npm test
```
