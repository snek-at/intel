import alasql from "alasql";

//> Classes
/*
  A tool to hand over basic osm operations 
  (init, create, get, all, filter, custom) for
  all statement objects to the database.
  Alasql is used as database.
*/
class SOAssambler {
  static database = new alasql.Database();

  constructor(Base) {
    if (Base.statements.initialize) {
      // Create table
      SOAssambler.database.exec(Base.statements.initialize);
    }

    this.create = (fields) => {
      try {
        let tablename = new Base({}).constructor.name.toLowerCase();

        SOAssambler.database.exec(
          Base.statements.create,
          Object.values(fields)
        );

        fields.id = SOAssambler.database.autoval(tablename, "id");
        let obj = new Base(fields);

        return obj;
      } catch (err) {
        return {
          success: false,
          message: err.message
        };
      }
    };
    this.get = (fields) => {
      try {
        let response = SOAssambler.database.exec(
          Base.statements.get,
          Object.values(fields)
        );

        if (response.length === 1) {
          response = response[0];
        }

        let obj = new Base(response);

        return obj;
      } catch (err) {
        return {
          success: false,
          message: err.message
        };
      }
    };
    this.all = (...fields) => {
      try {
        let response;
        response = SOAssambler.database.exec(Base.statements.all, fields);
        response = response.map((entry) => {
          return new Base(entry);
        });

        return response;
      } catch (err) {
        return {
          success: false,
          message: err.message
        };
      }
    };
    this.filter = (filter, Cls, filterStatement) => {
      try {
        if (!filterStatement) {
          filterStatement = Base.statements.all;
        }

        let response = SOAssambler.database.exec(filterStatement);

        for (let entry in response) {
          if ({}.hasOwnProperty.call(response, entry)) {
            for (let f in filter) {
              if ({}.hasOwnProperty.call(filter, f)) {
                if (response[entry]) {
                  if (filter[f] !== response[entry][f]) {
                    delete response[entry];
                  }
                }
              }
            }
          }
        }

        var filtered = response.filter((el) => {
          return el !== null;
        });

        let objects = filtered.map((entry) => {
          let o;

          if (Cls) {
            o = new Cls(entry);
          } else {
            o = new Base(entry);
          }

          return o;
        });

        return objects;
      } catch (err) {
        return {
          success: false,
          response: null,
          message: err.message
        };
      }
    };
    this.custom = (query) => {
      try {
        let response = SOAssambler.database.exec(query);
        response = response.map((entry) => {
          return new Base(entry);
        });

        return response;
      } catch (err) {
        return {
          success: false,
          message: err.message
        };
      }
    };
  }

  //> Methods
  reload() {
    SOAssambler.database = new alasql.Database();
  }
}

export { SOAssambler };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
