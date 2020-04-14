- For the API

Just deploy the Node/Express server the main/entry point is the server.js file
this server is reposnible for recording the work history to the MONGODB etc

- For the actual script that does the heavy lifting, it is the logDevWorkScript
it is the one built by PKG (pkg .) to create the executable file

To generate the executable files for diff platforms:
Run (pkg .) in the root folder on this project

- After the executables are created, copy them to the suace-police project
that contains the shell scripts and the git hooks(records message and runs the appropriate executable depending on the plartform we are in)
