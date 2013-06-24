Introduction
============

A collection of Classes and Utilities for interfacing with MongoDB in Node.js using Backbone.js Models and Collections.

Install
=======

Install all npm modules:

  $ cd backbone-mongo
  $ npm install

Test
====

Run the unit tests one time:

  $ npm test

Node Client Bundle
====

Install browserify (from https://github.com/kmalakoff/node-browserify):
  $ npm install browserify

Create a client bundle:

  $ browserify -r util -r url -r backbone -r moment -r queue-async -r backbone-orm -r backbone-ajax > lib/node-client.js
