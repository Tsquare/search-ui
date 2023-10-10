import { CustomQuery } from "@searchkit/sdk";

export const EngineQuery = () =>
  new CustomQuery({
    // @ts-ignore
    queryFn: (query) => {
      return {
        bool: {
          must: [
            {
              query_string: {
                query: query
              }
            }
          ]
        }
      };
    }
  });
