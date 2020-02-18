import alasql from "alasql";

class SOAssambler {
  static database = new alasql.Database();
  constructor(Base) {
    if (base.statements.initialize) {
      // Create table
      // console.log(SOAssambler.database)
      // console.log(base.statements.initialize)
      SOAssambler.database.exec(base.statements.initialize);
    }

    // The fields have to be in the correct order!
    this.create = (fields) => {
      try {
        let tablename = new Base({}).constructor.name.toLowerCase();
        SOAssambler.database.exec(
          base.statements.create,
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
          base.statements.get,
          Object.values(fields)
        );
        console.log({ ...response });

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
        response = SOAssambler.database.exec(base.statements.all, fields);
        console.log(response);
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
          filterStatement = base.statements.all;
        }
        let response = SOAssambler.database.exec(filterStatement);
        for (let entry in response) {
          if ({}.hasOwnProperty.call(response, entry)) {
            for (let f in filter) {
              if ({}.hasOwnProperty.call(filter, f)){
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
          return el != null;
        });

        let objects = filtered.map((entry) => {
          let o;
          if (cls) {
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

  reload() {
    SOAssambler.database = new alasql.Database();
  }
};

export { SOAssambler };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
