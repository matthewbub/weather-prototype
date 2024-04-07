
https://www.weather.gov/documentation/services-web-api
## TODO 

- [x] Feed screen layout
- [x] POST new location to Supabase
- [x] Implement validation for address with Google
- [x] Migrate client state to zustand
- [x] Visuals for new location selection. ie disabled button, selected location
- [x] Store every address searched to ultimately mitigate away from paying for addresses
- [ ] Click outside hook for Modals
- [x] Reduce geolocation data sent over in address lookup
- [x] Use joi on edge routes
- [x] No duplicate entires in Supabase for locations
- [x] No duplicate entires in Supabase for users assigned locations


## QA NOTES
- When working with Lisa, point out the button selection "jump" caused by a border toggle issue as a type of bug to look for

Bug Logs

- [ ] Search zip code `923` and watch multiple results for SB country come in. We should limit duplicate entries to the first result found.
- [ ] Enter a city or zip, allow the search to populate. Manually clear the input fields. Actual: Screen is stuck in a loading state. Expected: Screen goes back to default messaging.

## Add locations

The data goes through 2 tables, in the first table we attempt to insert the location into our globalized table if it does not exist. Then, we use the second table to insert the id of the user who preformed that action. We use this secondary table as a source of truth per user; whereas the first table is the generalized source of truth for all.


## Working with the User data

We're only tracking the unique identifier and auth provider on our end. Everything else is referencing foreign keys from there. 

```ts
// Server only
import {useAppUserOnServer} from '@/utils/useAppUserOnServer';

async function main() {
	const user = await useAppUserOnServer();
	// ...
}
```

There are a few challenges that led to the solution we're seeing here. First, I don't like the idea of marrying any one particular technology especially one that costs a service fee. I didn't want all my user data to be tied to any particular unique identifier in Clerk. This led to the creation of a unified table in the database, where we can assign the user id to a field that we control. The unified table is only tracking the unique identifier and auth provider. As a result of this unification, a method would need to be created to ensure the user always exists on our end, for every action they preform. The logic we use to account for this is server driven and declared in the `validateOrCreateUser.ts` file. I wanted this method to be the go-to for all things related to the user id; that's everything related to the user on our end. To abstract this further, the server driven `useAppUser.ts` method was created; which is a basic wrapper that strips away the need to declare the required arguments for the `validateOrCreateUser` method.