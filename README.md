# Notes

- npm: --save-dev === -D
- separate relative imports from absolute import as a convention :)
- Object.assign(target, source) copies all enumerable own properties from one or more source objects to a target object.
- 'class-validator' package provides validator decorators for TypeORM
- 'class-transformer' package provides ways to hide and show properties on json response
- 'catchAsync', 'errorHandler' and 'AppError' are refactorings learned from natours nodejs project
- TypeORM does not support MongoDB 4 ([error when querying from database and stuff](https://stackoverflow.com/questions/68908467/typeorm-and-mongodb-and-repositories-cannot-read-property-prototype-of-undefi))
- auth middleware add the user to res.locals so it can be accessed from the routes that goes through this middleware
- few tsconfig for better coding
- now it comes to relations, obviously typeorm is not good for mongodb, that's why all of the documents implement embedding like a monkey
