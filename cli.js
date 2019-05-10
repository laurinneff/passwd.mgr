#!/usr/bin/env node
const commandLineArgs = require('command-line-args')
const { PasswordDB, Site } = require('passwddb')
const fs = require("fs")

const commandLineUsage = require('command-line-usage')

const sections = [
    {
        header: 'passwd.mgr',
        content: 'Store all your 128-character passwords safely'
    },
    {
        header: 'Usage',
        content: `passwd.mgr {bold --database} {underline file} {bold --password} {underline password} {bold --encryption} {underline algorithm} {bold command} {underline [command arguments]}`
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'database',
                alias: 'd',
                typeLabel: '{underline file}',
                description: 'The database file used for the passwords.'
            },
            {
                name: 'password',
                alias: 'p',
                typeLabel: '{underline password}',
                description: 'The encryption password.'
            },
            {
                name: 'encryption',
                alias: 'e',
                typeLabel: '{underline algorithm}',
                description: 'The used encryption algorithm.'
            },
            {
                name: 'help',
                description: 'Print this usage guide.'
            }
        ]
    },
    {
        header: 'Commands',
        content: [
            { name: 'create', summary: 'Create a new password database at the specified path {bold WARNING: This will overwrite the file if it already exists}' },
            { name: 'list', summary: 'Print a list of sites in the database.' },
            { name: 'add', summary: 'Add a new site (More info below)' },
            { name: 'get', summary: 'Get data of a site (More info below)' },
            { name: 'algorithms', summary: 'Print a list of supported encryption algorithms' }
        ]
    },
    {
        header: 'Add',
        optionList: [
            {
                name: 'site',
                alias: 's',
                typeLabel: '{underline site}',
                description: 'The name of the site'
            },
            {
                name: 'username',
                alias: 'u',
                typeLabel: '{underline username}',
                description: 'Your Username on this site (optional)'
            },
            {
                name: 'email',
                alias: 'e',
                typeLabel: '{underline email}',
                description: 'The E-Mail Address you use on this site (optional)'
            },
            {
                name: 'password',
                alias: 'p',
                typeLabel: '{underline password}',
                description: 'Your password (optional)'
            }
        ]
    },
    {
        header: "Get",
        optionList: [
            {
                name: 'site',
                alias: 's',
                typeLabel: '{underline site}',
                description: 'The name of the site'
            }
        ]
    },
    {
        header: 'Examples',
        content: [
            { name: 'passwd.mgr -d db.passwddb -p superSecurePassword -e aes256 create', summary: 'Create a new password database in db.passwddb' },
            { name: 'passwd.mgr -d db.passwddb -p superSecurePassword -e aes256 add -s example.com -u Me -e me@example.com -p myPassword', summary: 'Add an entry for example.com' },
            { name: 'passwd.mgr -d db.passwddb -p superSecurePassword -e aes256 list', summary: 'Print a list of all entries in the database' },
            { name: 'passwd.mgr -d db.passwddb -p superSecurePassword -e aes256 get -s example.com', summary: 'Print your username, password and E-Mail for example.com' },
        ]
    }
]
const usage = commandLineUsage(sections)

const mainDefinitions = [
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'database', alias: 'd', type: String },
    { name: 'password', alias: 'p', type: String },
    { name: 'encryption', alias: 'e', type: String, defaultValue: 'aes256' },
    { name: 'command', defaultOption: true }
]
const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true })
const argv = mainOptions._unknown || []

if (mainOptions.help) {
    console.log(usage)
    process.exit(0)
}

try {
    switch (mainOptions.command) {
        case 'create':
            var db = new PasswordDB()
            var encrypted = db.encrypt(mainOptions.password, { algoritm: mainOptions.encryption })
            fs.writeFileSync(mainOptions.database, JSON.stringify(encrypted))
            console.log(`Created a ${mainOptions.encryption}-encrypted password database at ${mainOptions.database}`)
            break
        case 'list':
            var encrypted = JSON.parse(fs.readFileSync(mainOptions.database))
            var db = new PasswordDB(encrypted, mainOptions.password, { algoritm: mainOptions.encryption })
            var sites = db.listSites()
            if (sites.length)
                console.log(sites.join(',\n'))
            else
                console.log('No sites found in the database')
            break
        case 'add':
            const addDefinitions = [
                { name: 'site', alias: 's', type: String },
                { name: 'username', alias: 'u', type: String, defaultValue: '' },
                { name: 'email', alias: 'e', type: String, defaultValue: '' },
                { name: 'password', alias: 'p', type: String, defaultValue: '' }
            ]
            const addOptions = commandLineArgs(addDefinitions, { argv })

            var encrypted = JSON.parse(fs.readFileSync(mainOptions.database))
            var db = new PasswordDB(encrypted, mainOptions.password, { algoritm: mainOptions.encryption })
            var site = new Site(addOptions.username, addOptions.email, addOptions.password)
            db.addSite(addOptions.site, site)

            var encrypted = db.encrypt(mainOptions.password, { algoritm: mainOptions.encryption })
            fs.writeFileSync(mainOptions.database, JSON.stringify(encrypted))
            console.log(`Added the site '${addOptions.site}'`)
            break
        case 'get':
            const getDefinitions = [
                { name: 'site', alias: 's', type: String }
            ]
            const getOptions = commandLineArgs(getDefinitions, { argv })

            var encrypted = JSON.parse(fs.readFileSync(mainOptions.database))
            var db = new PasswordDB(encrypted, mainOptions.password, { algoritm: mainOptions.encryption })
            var site = db.getSite(getOptions.site)

            console.log(`Username: ${site.getUsername()}\nE-Mail: ${site.getEmail()}\nPassword: ${site.getPassword()}`)
            break
        case 'algorithms':
            console.log(require('crypto').getCiphers().join(',\n'))
            break
        default:
            console.log(usage)
            process.exit(0)
            break
    }
} catch (e) {
    console.error("ERROR: Wrong Password")
    process.exit(1)
}
