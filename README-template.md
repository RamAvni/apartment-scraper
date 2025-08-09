# Here you should

- Rename your package(.json) to whichever name you'll like

- Do: `$ corepack up` in order to use the template's pnpm version

- Do: `$ nvm use` in order to use the template's node version

Linters:

- Remember to review the base, and your own configuration, after installing frameworks/major libraries.
  (e.g. If you decide on using `.scss`, you will need to adapt `stylelint` accordingly)

- If you don't like my ls-lint configuration, you can edit it as you wish!
- Please review and add every special file-naming-convention: e.g. `.SOMETHING.ts`, to the `.ls-lint.yml`

Git Hooks:

- Husky is installed for you, and already configured to do pnpm pipeline on every commit.
  Yes, it may be too much for larger projects, and therefore you should modify the existing husky setup as you wish :)
