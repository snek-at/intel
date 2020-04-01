var alasql = require('alasql');

class SOAssambler {
  static database = new alasql.Database();
  constructor(private Base: any) {
    if (Base.statements.initialize) {
      // Create table
      // console.log(SOAssambler.database)
      // console.log(base.statements.initialize)
      SOAssambler.database.exec(Base.statements.initialize);
    }

    // The fields have to be in the correct order!

  }

  create(fields: any, optCls?: any) {
    try {
      let tablename = new this.Base({}).constructor.name.toLowerCase();
      SOAssambler.database.exec(
        this.Base.statements.create,
        Object.values(fields)
      );
      fields.id = SOAssambler.database.autoval(tablename, "id");

      let obj = new this.Base(fields);
      return obj;
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  };

  get(fields: any) {
    try {
      let response = SOAssambler.database.exec(
        this.Base.statements.get,
        Object.values(fields)
      );
      console.log({ ...response });

      if (response.length === 1) {
        response = response[0];
      }
      let obj = new this.Base(response);
      return obj;
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  };
  all(...fields: any[]) {
    try {
      let response;
      response = SOAssambler.database.exec(this.Base.statements.all, fields);
      console.log(response);
      response = response.map((entry: any) => {
        return new this.Base(entry);
      });

      return response;
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  };
  filter(filter: any, Cls?: any, filterStatement?: any) {
    try {
      if (!filterStatement) {
        filterStatement = this.Base.statements.all;
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

      var filtered = response.filter((el: any) => {
        return el != null;
      });

      let objects = filtered.map((entry: any) => {
        let o;
        if (Cls) {
          o = new Cls(entry);
        } else {
          o = new this.Base(entry);
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
  custom(query: any) {
    try {
      let response = SOAssambler.database.exec(query);

      response = response.map((entry: any) => {
        return new this.Base(entry);
      });
      return response;
    } catch (err) {
      return {
        success: false,
        message: err.message
      };
    }
  };

  reload() {
    SOAssambler.database = new alasql.Database();
  }
};

export { SOAssambler };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
