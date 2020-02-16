import alasql from "alasql";

class SOAssambler {
  static database = new alasql.Database();
  constructor(base) {
    if (base.statements.initialize) {
      // Create table
      // console.log(SOAssambler.database)
      // console.log(base.statements.initialize)
      SOAssambler.database.exec(base.statements.initialize);
    }

    // The fields have to be in the correct order!
    this.create = fields => {
      try {
        let tablename = new base({}).constructor.name.toLowerCase();
        SOAssambler.database.exec(base.statements.create, Object.values(fields));
        fields.id = SOAssambler.database.autoval(tablename, "id");

        let obj = new base(fields);
        return obj;
      } catch (err) {
        return {
          success: false,
          message: err.message
        };
      }
    };
    this.get = fields => {
      try {
        let response = SOAssambler.database.exec(
          base.statements.get,
          Object.values(fields)
        );
        console.log({...response})

        if (response.length === 1) {
          response = response[0];
        }
        let obj = new base(response);
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
        console.log(response)
        response = response.map(entry => {
          return new base(entry)
        })

        return response;
      } catch (err) {
        return {
          success: false,
          message: err.message
        };
      }
    };
    this.filter = (filter, cls, filterStatement) => {
      try {
        if (!filterStatement) {
          filterStatement = base.statements.all;
        }
        let response = SOAssambler.database.exec(filterStatement);
        // console.log({...response})
        for (let entry in response) {
          for (let f in filter) {
            if (response[entry]) {
              if (filter[f] !== response[entry][f]) {
                delete response[entry];
              }
            }
          }
        }


        var filtered = response.filter(el => {
          return el != null;
        });
        // console.log(filtered)

        //filtered.map(entry => entry = new base({...entry}))
        // console.log(filtered);
        let objects = filtered.map(entry => {
          let o;
          if (cls) {
            o = new cls(entry);
          } else {
            o = new base(entry);
          }
          return o;
        });
        // console.log(objects);

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
        // console.log(query)
        let response = SOAssambler.database.exec(
          query
        );
        // console.log({...response})

        response = response.map(entry => {
          return new base(entry)
        })
        // console.log(response)
        return response;
      } catch (err) {
        return {
          success: false,
          message: err.message
        };
      }
    }
  }

  reload() {
    SOAssambler.database = new alasql.Database();
  }
}

export { SOAssambler };

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
