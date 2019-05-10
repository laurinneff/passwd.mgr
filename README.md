# passwd.mgr

Store all your 128-character passwords safely 

## Usage

passwd.mgr --database file --password password --encryption algorithm command [command arguments]

## Options

| Option             | value            | Description                              |
| ------------------ | ---------------- | ---------------------------------------- |
| `-d, --database`   | <u>file</u>      | The database file used for the passwords |
| `-p, --password`   | <u>password</u>  | The encryption password                  |
| `-e, --encryption` | <u>algorithm</u> | The encryption algorithm                 |
| `--help`           |                  | Print this usage guide                   |

## Commands

| Command      | Description                                     | Warnings                                 |
| ------------ | ----------------------------------------------- | ---------------------------------------- |
| `create`     | Create a database file                          | This will overwrite files without asking |
| `list`       | Print a list of sites in the database           |                                          |
| `add`        | Add a new site (Options [below](#Add))          |                                          |
| `get`        | Get data of a site (Options [below](#Get))      |                                          |
| `algorithms` | Print a list of supported encryption algorithms |                                          |

## Add

| Option           | value           | Description                                         |
| ---------------- | --------------- | --------------------------------------------------- |
| `-s, --site`     | <u>site</u>     | The name of the site                                |
| `-u, --username` | <u>username</u> | Your Username on this site (optional)               |
| `-e, --email`    | <u>email</u>    | The E-Mail Address you use on this site (optional)  |
| `-p, --password` | <u>password</u> | Your password (optional)                            |                          

## Get

| Option       | value       | Description          |
| ------------ | ----------- | -------------------- |
| `-s, --site` | <u>site</u> | The name of the site |

## Examples

| Command                                                                                                               | Description                                                  |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `passwd.mgr -d db.passwddb -p superSecurePassword -e aes256 create`                                                   | Create a new password database in db.passwddb                |
| `passwd.mgr -d db.passwddb -p superSecurePassword -e aes256 add -s example.com -u Me -e me@example.com -p myPassword` | Add an entry for example&#46;com                             |
| `passwd.mgr -d db.passwddb -p superSecurePassword -e aes256 list`                                                     | Print a list of all entries in the database                  |
| `passwd.mgr -d db.passwddb -p superSecurePassword -e aes256 get -s example.com`                                       | Print your username, password and E-Mail for example&#46;com |