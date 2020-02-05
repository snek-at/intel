import { Graphql } from "snek-client";

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
