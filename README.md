![Small Logo](static/img/polaris-logo.png)

# polaris-typeorm

[![Build Status](https://travis-ci.com/Enigmatis/polaris-typeorm.svg?branch=master)](https://travis-ci.com/Enigmatis/polaris-typeorm)
[![NPM version](https://img.shields.io/npm/v/@enigmatis/polaris-typeorm.svg?style=flat-square)](https://www.npmjs.com/package/@enigmatis/polaris-typeorm)

#### Install

```
npm install polaris-typeorm
```

### Overview
This library provides support and wrappers for typeorm functionality.

#### CreateConnection
Through this class we can create the polaris connection to our DB on top of typeorm.

#### CommonModel
This class represents the base entity of our repository, which means that all of our db entities
that we are going to create should extend and inherit inherit all of the `CommonModel` properties.
It provides default fields for your entity :

-   createdBy - this field indicates who created the entity.
-   creationTime - this field indicates when does the entity created.
-   lastUpdateBy - this field indicates who last updated the entity.
-   lastUpdateTime - this field indicates when does the entity last updated.
-   dataVersion - every repository entity is a versioned entity and contains a version related to their data - a dataVersion.
-   realityId - this field indicates what is the reality of the entity.
-   deleted - this field indicates whether the entity is "soft deleted".

Let's take a look at a simple example :

```
@Entity()
export class SimpleEntity extends CommonModel {
...
}
```

So now `SimpleEntity` also includes all of the above properties.

#### PolarisEntityManager
This class extends the typeorm original `EntityManager` logic - adds a relevant filters such as reality filters,
data version filters and also provides a support in the soft delete mechanism.
You can access this CRUD methods in 2 ways :

1. through the `PolarisEntityManager` class.
2. through the original typeorm repository.
