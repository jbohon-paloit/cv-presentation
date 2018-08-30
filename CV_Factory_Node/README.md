## Push to Google Drive Service

This service allows us to push files to Google Drive and make them available to the linked Google account (see below).

### Linking Google account to access files

The push to Google Drive is made with a service created (via a Google account). This service's purpose is to make communication with Google APIs easier by handling authentication with a JSON file.
Each file pushed to Google Drive is automatically created with associated permission to this service, thus not being accessible in the Drive user interface of the base email address (ex: my_email_address@gmail.com). To make that file visible in our account, it is mandatory to add a new permission to it with the Google account wanted.
To achieve that, we update permissions of every file after pushing them to Google Drive. Permissions are updated with the email address mentioned in the config/config.json.
PERMISSION_ADDRESS should be set to the email address that we want to give access to to the file.

Example of config.json file

```
{
  "PORT": 3000,
  "PERMISSION_ADDRESS": "my_email@gmail.com"
}
```

### Creating the service & associated auth.json file

[Tutorial](https://flaviocopes.com/google-api-authentication/) - Enabling Google Drive APIs & creating auth.json file

The auth.json file should be placed at the root of the project.

### Files

Files to be uploaded should be placed within a "files" folder at the root of the project.

### APIs

* POST /files/:fileName

*Uploads a file to Google Drive*

* GET /files

*Gets a list of the 20 most recent files uploaded*
