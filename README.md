
https://www.weather.gov/documentation/services-web-api
## TODO 

- [x] Feed screen layout
- [ ] CRUD for posting a new location to Supabase
- [x] Implement validation for address with Google
- [x] Migrate client state to zustand
- [x] Visuals for new location selection. ie disabled button, selected location
- [x] Store every address searched to ultimately mitigate away from paying for addresses
- [ ] Click outside hook for Modals
- [x] Reduce geolocation data sent over in address lookup
- [ ] Document API and behavior for LocationLookup
- [x] Use joi on edge routes

Bug Logs

- [ ] Search zip code `923` and watch multiple results for SB country come in. We should limit duplicate entries to the first result found.
- [ ] Enter a city or zip, allow the search to populate. Manually clear the input fields. Actual: Screen is stuck in a loading state. Expected: Screen goes back to default messaging.

## Add locations

The data goes through 2 tables, in the first table we attempt to insert the location into our globalized table if it does not exist. Then, we use the second table to insert the id of the user who preformed that action. We use this secondary table as a source of truth per user; whereas the first table is the generalized source of truth for all.