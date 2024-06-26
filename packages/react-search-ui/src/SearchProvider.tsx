import React, { useState, useEffect } from "react";

import { SearchDriver } from "@elastic/search-ui";
import SearchContext from "./SearchContext";

import defaultA11yMessages from "./A11yNotifications";
import type { SearchDriverOptions } from "@elastic/search-ui";

export interface SearchProviderContextInterface {
  driver: SearchDriver;
}

type SearchProviderProps = {
  children: React.ReactNode;
  config: SearchDriverOptions;
  driver?: SearchDriver;
};

/**
 * The SearchProvider primarily holds a reference to the SearchDriver and
 * exposes it to the rest of the application in a Context.
 */
const SearchProvider = ({
  children,
  config,
  driver
}: SearchProviderProps): JSX.Element | null => {
  const [driverInstance, setDriverInstance] = useState<SearchDriver | null>(null);

  useEffect(() => {
    // This initialization is done inside of useEffect, because initializing the SearchDriver server side
    // will error out, since the driver depends on window. Placing the initialization inside of useEffect
    // assures that it won't attempt to initialize server side.
    const currentDriver =
      driver ||
      new SearchDriver({
        ...config,
        a11yNotificationMessages: {
          ...defaultA11yMessages,
          ...config.a11yNotificationMessages
        }
      });
    setDriverInstance(currentDriver);

    return () => {
      currentDriver.tearDown();
    };
  }, []);

  // This effect allows users to dynamically update their searchQuery without re-mounting a SearchProvider,
  // which would be destructive. An example of why this is useful is dynamically updating facets.
  useEffect(() => {
    if (driverInstance && config.searchQuery) {
      driverInstance.setSearchQuery(config.searchQuery);
    }
  }, [config.searchQuery]);

  useEffect(() => {
    if (driverInstance && config.autocompleteQuery) {
      driverInstance.setAutocompleteQuery(config.autocompleteQuery);
    }
  }, [config.autocompleteQuery]);

  // Added by Wentao Xu from SignalFire to enable custom behavior in the fork.
  // This allows us to dynamically configure URL tracking based on the search state
  // URL state during the same page session.
  //
  // See the filed issue for more details:
  // https://github.com/elastic/search-ui/issues/606
  useEffect(() => {
    if (driverInstance && config.trackUrlState) {
      driverInstance.setTrackUrlState(config.trackUrlState);
    }
  }, [config.trackUrlState]);

  // Since driver is initialized in useEffect above, we are waiting
  // to render until the driver is available.
  if (!driverInstance) return null;

  // Passing the entire "this.state" to the Context is significant. Because
  // Context determines when to re-render based on referential identity
  // something like this could cause unnecessary renders:
  //
  // <SearchContext.Provider value={{driver: this.state.driver}}>
  //
  // By passing the entire state, we ensure that re-renders only occur when
  // state is actually updated.

  const contextValue: SearchProviderContextInterface = {
    driver: driverInstance
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
