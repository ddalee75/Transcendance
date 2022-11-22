# Transcendence

<b>Creation of a website for an online game “PONG”, with private and public chat and user interface</b>

Project Ecole 42 <br>
Team project of 5 (in progress)<br>

Technology :<br>
Angular • Node JS - Nest JS • Prisma • PostgreSQL • HTML • CSS • Docker<br><br>


Overview<br>
• library / framework with last stable version.<br>
• Compatible with the latest up to date version of Chrome, FireFox.<br>
• Single-page application.<br><br>

Build dev<br>
docker-compose up --build<br>
• Use Docker in rootless mode<br>
• Runtimes files must be located in /goinfre or /sgoinfre<br>
• Can’t use so called “bind-mount volumes” between the host and the container if non-root UIDs are used in the container.<br>
• Several fallbacks exist: Docker in a VM, rebuild container after changes, craft own docker image with root as unique UID<br><br>

Security<br>
• Any password stored must be hashed<br>
• Use a strong password hashing algorithm<br>
• The website must be protected against SQL injection<br>
• Implement some kind of server-side validation for forms and any user input<br>
• Any credentials, API keys, env variables etc... must be saved locally in a .env file and ignored by git<br><br>

User Account<br>
• Using the OAuth system of 42 intranet<br>
• User should be able to upload an avatar<br>
• User should be able to enable two-factor authentication (Google Authenticator or sending a text message to their phone)<br>
• User should be able to add other users as friends and see their current status online, offline, in a game, and so forth<br>
• Stats have to be displayed on the user profile. Such as: wins and losses, ladder level, achievements, and so forth<br>
• User should have a Match History including 1v1 games, ladder, and anything else useful<br>
• Anyone who is logged in should be able to consult it.<br><br>

Chat<br>
• create channels (chat rooms) : public, or private, or protected by a password<br>
• Channel owner<br>
 - User who has created a new channel is automatically set as the channel owner<br>
 - can set a password required to access the channel, change it, and also remove it<br>
 - Is a channel administrator. They can set other users as administrators<br>
 - Administrators of a channel can ban or mute users for a limited time<br>
• Send direct messages to other users<br>
• Block other users<br>
• See no more messages from the account they blocked<br>
• Invite other users to play a Pong game through the chat interface<br>
• Should be able to access other players profiles through the chat interface<br><br>

Game<br>
• Play a live Pong game versus another player directly on the website<br>
• Matchmaking system<br>
- User can join a queue until they get automatically matched with someone else<br>
• Canvas game or game rendered in 3D<br>
- It must be faithful to the original Pong (1972)<br>
• Customization options<br>
- For example, power-ups or different maps<br>
• Select a default version of the game without any extra features if they want to<br>
• The game must be responsive<br>
• watch a live play between other users without interfering with it<br>
