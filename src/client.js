//> snek-client
// A Graphql and REST client for fetching data
import { Graphql } from "snek-client";

//> Classes
/**
 * Implementation of the snek-client
 */
class Github{
    constructor(authorization){
        var url = "https://api.github.com/graphql";
        let client = new Graphql(url, {
            authorization
        });
        this.get = async (query, variables) => client.send(query, variables);
    }
}

export {
    Github
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
