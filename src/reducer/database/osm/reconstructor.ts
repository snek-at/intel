//> Imports
// Contains a framework for creating a database in the browser.
var alasql = require("alasql");

/**@class Provides interaction to the database. */
class SOAssambler {
  static database = new alasql.Database();
  /**
   * The implementation of the getObjects is necessary for any model!
   *
   * @constructor
   * @author: schettn
   * @param Base The class of a model.
   * @description Creates a instance of SOAssambler.
   */
  constructor(private Base: any) {
    /**
     * Initialize the table if the if the necessary statement exists.
     */
    if (Base.statements.initialize) {
      SOAssambler.database.exec(Base.statements.initialize);
    } else {
      /**
       * @todo Error handling.
       */
    }
  }

  /**
   * Create object in database.
   *
   * @param fields The data of the object. It has to be in the correct order!
   * @returns A object of the initialized Base class.
   * @description Creates a entry in the database and returns a object type of Base.
   */
  create(fields: any) {
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
        message: err.message,
      };
    }
  }

  /**
   * Get a object out of the database.
   *
   * @param fields The data to get a object by.
   * @returns A object of the initialized Base class.
   * @description Get a object out of the database and convert in to type of Base.
   */
  get(fields: any) {
    try {
      let response = SOAssambler.database.exec(
        this.Base.statements.get,
        Object.values(fields)
      );

      if (response.length === 1) {
        response = response[0];
      }
      let obj = new this.Base(response);
      return obj;
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }

  /**
   * Get all objects of the table specifed by type of Base.
   *
   * @deprecated The fields parameter my be useless and should be removed!
   * @param fields The data to get a object by.
   * @retruns A list of objects of the initialized Base class.
   * @description Get all objects converted to type of Base in a list.
   */
  all(...fields: any[]) {
    try {
      let response;
      response = SOAssambler.database.exec(this.Base.statements.all, fields);
      response = response.map((entry: any) => {
        return new this.Base(entry);
      });

      return response;
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
  /**
   * Get filtered objects of the table specifed by type of Base.
   *
   * @param filter A filterset.
   * @param Cls A optional model. When not provided Base is chosen.
   * @param filterStatement A optional filter statement. When not provided .all() is chosen.
   * @retruns A list of filtered objects of the initialized Base class.
   * @description Get all objects converted to type Cls or Base in a list.
   */
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
        message: err.message,
      };
    }
  }

  /**
   * Send a custom query to the database.
   *
   * @param query A custom SQL statement.
   * @returns A object of the initialized Base class.
   * @description Get a object out of the database and convert in to type of Base.
   */
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
        message: err.message,
      };
    }
  }

  /**
   * Reset the database.
   *
   * @description Reinitialize the database. This will reset all datasets!
   */
  reload() {
    SOAssambler.database = new alasql.Database();
  }
}

export { SOAssambler };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © Simon Prast
 */
