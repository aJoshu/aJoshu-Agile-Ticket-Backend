
# Pointing Poker Remake

Some Pointing Poker alike react application that uses an express backend with sockets.  

Some minor bugs I haven't got around to fixing is the problem with sockets talking when deployed and sometimes when a new user joins a session it doesnt fetch on their end.

Overall a cool learning experience messing with sockets.



## Requirements

You will need both cloned down to run locally.
```bash
git clone https://github.com/aJoshu/Agile-Ticket-Voter
git clone https://github.com/aJoshu/aJoshu-Agile-Ticket-Backend
```


## Run Locally

Run Frontend

```bash
npm i && npm run dev
```

Run Backend
```bash
npm i && nodemon app.tsx
```
