# Docs

## Conventions 
**Data** displayed is coming from those edge functions, whereas **UI** intensive functionality comes from React. Having this clearly separated reduces the need for unnecessary lifecycle events. Basically avoid useEffect at all costs; in fact - every instance of useEffect in this app should come with a lint error / forced explanation of why we couldn't have used an alternative. 

**Why are your file names and variable names so long?** Have you ever tried fuzzy finding `id` among a sea of `id` references? There's a convention to it all, with the intention of avoiding ambiguous naming conventions.

React
- Event handlers should being with the prefix `handle` and remain camel cased.
- Hooks always begin with the prefix `use` and remain camel cased.

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

## API Routes 

- `/api/location` - POST | GET
- `/api/location-auto-complete` - POST 


### API Routes Dev Notes

Checkout `src/app/api/example/` for a basic example of the Next.js Edge function syntax. 

It's also cool to know the primary abstractions we're utilizing here. This forces consistency across API responses.

- `okResponse(data: any, msg?: string): NextResponse` - Use for happy cases
- `bypassOkResponse(data: any, msg?: string): PostResponseTypes` - Use for working with successful requests but not sending to client
- `failResponse(msg: string): NextResponse` - Use for sending failures to the client
- `skirtFailedResponse(msg: string): PostResponseTypes` - Use for working with failures but not sending to client.

---

### General TODO 

- [x] Feed screen layout
- [x] POST new location to Supabase
- [x] Implement validation for address with Google
- [x] Migrate client state to Zustand
- [x] Visuals for new location selection. ie disabled button, selected location
- [x] Store every address searched to ultimately mitigate away from paying for addresses
- [x] Reduce geo location data sent over in address lookup
- [x] Use joi on edge routes
- [x] No duplicate entires in Supabase for locations
- [x] No duplicate entires in Supabase for users assigned locations
- [x] When a new location is added to a users feed we need to re-trigger the fetch to db in the globalStore. 
- [x] Throttle address search form 
- [ ] get weather per feed item
- [x] limit results to like 5 at a time
- [ ] implement state-wide alerts: `https://api.weather.gov/alerts/active?area=CA`
	- DOCS: https://www.weather.gov/documentation/services-web-api
- [ ] toasts should be added as responses to all actions, uh where is that specifically, research and identify
- [ ] user should be able to delete a location item
- [ ] UI is busted in desktop when added a new location
- [x] Do not send http requests to `location-auto-complete` on empty inputs
- [x] Do not send http requests to `location-auto-complete` on when an input is selected
- [ ] Create a CRON job that executes `nwsWeatherAlertsByState` across all 50 states every hour or something. Log those to our database, we'll pull from them in an effort to not stress the Governments networks
- [ ] We need to pull `locations` and `weather` in two separate requests to paint the page. It's extremely slow in development, should be easy to lift.
- [ ] Jest for ensuring there aren't any unintentional breaking changes backs
- [ ] add load more / pagination features
- [ ] Clear search results when the modal is closed

### backlog TODO
- [ ] i didn't know gps coordinates change over time. We'll need a background job to run X times a year to ensure coordinates remain aligned
- [ ] create a biome.js lint rule that forces an explanation for the use of useEffect

#### QA NOTES
- When working with Lisa, point out the button selection "jump" caused by a border toggle issue as a type of bug to look for

### Bug TODO

- [x] Search zip code `923` and watch multiple results for SB country come in. We should limit duplicate entries to the first result found.
	- NOTES: It's actually different zips, not a bug.
- [ ] Enter a city or zip, allow the search to populate. Manually clear the input fields. Actual: Screen is stuck in a loading state. Expected: Screen goes back to default messaging.



---

Dev Log

- 04.09.24 - Deciding to pivot away from the Zip code search functionality. The UI will look cleaner without it; it is not working atm and requires maintenance. The fact that Zip codes don't always equate to cities conflicts with the whole concept of the app - A city-based experience; not a zone-based experience. This has been an idea that has been in consideration since its inception. I really need to pull the plug on it. Removing Zipcodes from the search bar will result in the ability to collect city names, in addition to the coordinates and formatted name (i.e. San Bernardino, CA, United States of America). Whereas when usin Zipcodes, we werent always recieving city names in the external api responses. We need those city names to accurately search for them in our system as GPS Coordinates are too imprecise for any sort of reliable unique identification. 