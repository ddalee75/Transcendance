# Transcendence

## Doc
- single-page application
https://en.wikipedia.org/wiki/Single-page_application
## Techno

### Database
- PostgreSQL

### BackEnd
- NestJS

### FrontEnd
- TypeScript

### Build dev
```
docker-compose up --build
```

### Build prod
```
docker-compose -f docker-compose-prod.yml up --build
```

Use Docker in rootless mode

Runtimes files must be located in /goinfre or /sgoinfre

Can’t use so called “bind-mount volumes” between the host and the container if non-root UIDs are used in the
container.

Several fallbacks exist: Docker in a VM, rebuild container after changes, craft own docker image with root as unique UID

## Overview
- library / framework with last stable version.

- Compatible with the latest up to date version of Chrome, FireFox

- Single-page application.

## Security

- Any password stored must be hashed

Use a strong password hashing algorithm

- The website must be protected against SQL injection

- Implement some kind of server-side validation for forms and any user input

- Any credentials, API keys, env variables etc... must be saved locally in a .env file and ignored by git

## User Account

- Using the OAuth system of 42 intranet

- User should be able to upload an avatar

- User should be able to enable two-factor authentication

Google Authenticator or sending a text message to their phone

- User should be able to add other users as friends and see their current status

online, offline, in a game, and so forth

- Stats have to be displayed on the user profile

Such as: wins and losses, ladder level, achievements, and so forth

- User should have a Match History including 1v1 games, ladder, and anything else useful

Anyone who is logged in should be able to consult it.

## Chat

- create channels (chat rooms)

public, or private, or protected by a password

- Channel owner
> -  User who has created a new channel is automatically set as the channel owner
> -  can set a password required to access the channel, change it, and also remove it
> - Is a channel administrator. They can set other users as administrators
> - Administrators of a channel can ban or mute users for a limited time

- Send direct messages to other users

- Block other users

See no more messages from the account they blocked

- Invite other users to play a Pong game through the chat interface

- Should be able to access other players profiles through the chat interface

## Game

- Play a live Pong game versus another player directly on the website

- Matchmaking system

User can join a queue until they get automatically matched with someone else

- Canvas game or game rendered in 3D

It must be faithful to the original Pong (1972)

- Customization options

For example, power-ups or different maps

- Select a default version of the game without any extra features if they want to
 
- The game must be responsive

- watch a live play between other users without interfering with it
