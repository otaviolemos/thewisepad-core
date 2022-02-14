## theWisePad | This is an API of a backend for a simple notepad application. It was written in Node.js and TypeScript following the Clean Architecture principles.

The API was developed using concepts from *Clean Architecture*, *Domain-Driven Design*, *Test-Driven Development*, *Continuos Refactoring*, and *Atomic Commits*.

To run this project you will need to create a `.env` file at the root of your project with values for the following environment variables:

* `MONGO_URL`
* `JWT_SECRET`
* `BCRYPT_ROUNDS`
* `PORT`

`MONGO_URL` is where your MongoDB is located (*you can also create other implementations for the repositories for other specific databases if you like; the use cases were developed independently from specific database implementations*); `JWT_SECRET` is a secret used for the JWT signing; `BCRYPT_ROUNDS` is used to configure the use of the bcrypt algorithm; and `PORT` is the port where your API will run.

We believe this project can be used as a *reference implementation* of the **Clean Architecture** with Node.js and TypeScript.

Copyright © 2022 theWiseDev
