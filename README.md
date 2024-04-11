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
- [x] get weather per feed item
- [x] limit results to like 5 at a time
- [x] Clear search results when the modal is closed
- [x] Do not send http requests to `location-auto-complete` on empty inputs
- [x] Do not send http requests to `location-auto-complete` on when an input is selected
- [x] display current weather to end user
- [ ] display hourly weather to end user
- [ ] display daily weather to end user
- [ ] Upsert locations into geolocations in `location-auto-complete`
- [ ] implement state-wide alerts: `https://api.weather.gov/alerts/active?area=CA`
	- DOCS: https://www.weather.gov/documentation/services-web-api
- [ ] toasts should be added as responses to all actions, uh where is that specifically, research and identify
- [ ] user should be able to delete a location item
- [ ] UI is busted in desktop when added a new location
- [ ] Create a CRON job that executes `nwsWeatherAlertsByState` across all 50 states every hour or something. Log those to our database, we'll pull from them in an effort to not stress the Governments networks
- [ ] We need to pull `locations` and `weather` in two separate requests to paint the page. It's extremely slow in development, should be easy to lift.
- [ ] Jest for ensuring there aren't any unintentional breaking changes backs
- [ ] add load more / pagination features
- [ ] abstract state names more clearly in LocationLookup it's getting hard to read. To be clear; im not saying use less state, just rename them shits

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

- 04.10.24:7:00am Yesterday was a-lot of big brained architectural decisions, refactoring the initial code run to get it to a scalable point. With the way I had the data structures setup, I needed to make a few addition to accurately reference weather data within a given city. I was searching locations from one API, and storing the lon, lat and full formatted name, then I would use those lon and lat coordiates to fetch the weather from a second api service with no external relation to the first.  I feel like I already knew coordates are not an good way to idenitfy shit, but hey I guess I just wasnt thinking it fully through. I would be soon reminded of this when the second API returned coordinates that of different decimeals. This issue arose around the same time as my decision to drop support for Zipcode form field, so my mindset was: if users can only search by city names, I can use city names as a source of truth across api's. In addation, i also want to be able to customize the way city info is display and the full formatted name was restrive in that aspect. This led to me update the database to allow for the capture of the `city`, `state` and `name` fields from the inital API search results. 

One thing I thought was super annoying is the ammount of times i had to write the same [damn variable reference](d821879c60ed44ab92c3f41cb5f089aa7ce2659a). I was at first, totally blaming typescript but no i see its also Joi and just good ol refrencing but still, the amount of times I had to write `city`, `state` and `name` felt like I was going crazy. To add to it, I had to restart the nextjs server to see the changes take effect - a discovery made after much self reflection "did i seriously miss an `city`, `state` and `name` somewhere"

When I went to display the weather data, I found I actually had no method to accurately link the weather data with the location data I'm saving. 

I mentioned I prefer long descriptive and unique variable names over short shit like `const id = 'someid'` and after this little stint; i'm thinking my long, descriptive and unique variable names are not long, descriptive and unique enough. Okay, I wont say that phrase again. Don't get me wrong; I'm quite satisfied with the current level of abstraction. It's just enough to keep moving forward and I feel no desire for a massive architectural refactor which is uncommon for me and my side projects. I'm in a position where things are getting complex on the client, but maintainable and im not seeing any walls in sight. So yeah, yesterday wasn't too bad. Stuff was easy enough to navigate through, but I felt like I was still wasting time trying to identify which class names I needed. I think that also has something to do with the growing size of business logic that exists within some of these component files. 

Also worth motioning that the bug fixes I was working on were just non-trivial things that require critical thinking anyway. To summarize the bug fixes:
- Clear the form's state when a new location is added
- Clear the form's state when the modal is closed
- When a user selects a location, it now automatically populates the input filed 
- When the input field is auto populated, it should not resend the auto-complete request
- Fixed a bug where user input wasn't working on the location search because the debounce method was conflicting with the `input.value` field. 

Lets face it, stuff like this is always a mouthful:
```tsx
const searchResults = store((state) => state.searchResults);
const loading = store((state) => state.loading);
const setSearchResults = store((state) => state.setSearchResults);
const setLoading = store((state) => state.setLoading);
const setSelectedLocation = store((state) => state.setSelectedLocation);
const selectedLocation = store((state) => state.selectedLocation);
const setSelectedLocationToNull = store((state) => state.setSelectedLocationToNull);
const setLocations = globalStore((state) => state.setLocations);
const setModalIsOpen = store((state) => state.setModalIsOpen);
const locationInputValue = store((state) => state.locationInputValue);
const setLocationInputValue = store((state) => state.setLocationInputValue);
// ...
```

In pasting that codeblock above, I see i deff could abstract names more clearly. Adding to the TODOs.

What made it tedious was all the unique edge cases that come with the location

I also submitted a bug fix for React Haiku when bringing that code into this project, I always get super hyped when I have the opportunity to do something like that.

One thing I thought was super annoying is the ammount of times i had to write the same [damn variable reference](d821879c60ed44ab92c3f41cb5f089aa7ce2659a). I was at first, totally blaming typescript but no i see its also Joi and just good ol refrencing but still, the ammount of times I had to write `city`, `state` and `name` felt like I was going crazy. To add to it, I had to restart the nextjs server to see the changes take effect - a discovery made after much self reflection "did i seriously miss an `city`, `state` and `name` somewhere"

Basically we're still at the start, but things are progressing in a safe mannor when bugs are easily identifaible and fixable. My only pain points right now are really working with the edge functions, maybe im not slick at being a middle man but they just feel too close to the client code and it's annoying me. On the other hand, if I were to go to Docker and some other cloud provider that isnt Vercel, I'd be wasting my time on DevOps and not shipping shit. Thats fun too though. 

- 
I always want to feel like I'm smart right, but sometimes my brute force approaches can conflict with being smart. I had this recollection of having to find out how to convert kelvin to fahrenheit like 5 years ago now, so here I go bustin out a conversion method, get that working; then I figure hey let me slap out a celsiuc one as well. Then I end up on