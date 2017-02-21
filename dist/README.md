## FoF Website

This is the main repo for the website redesign, so that we can keep all development/design in one central place.

### Setup

Clone the repo:
```
git clone https://github.com/FederationOfFathers/website.git
```

Install dependencies:
```
npm install
```

Run the default task:
```
gulp
```

### Usage

The gulpfile has the following tasks:
- `default`
- `build:dev`
- `build:prod`
- `clean`
- `clean:prod`
- `zip`

Use `gulp` to run the default task and navigate to [http://localhost:3000](http://localhost:3000) to view the project. As you modify files, the browser will automatically refrest to reflect the changes.

To build the project and see what it would look like pre-production, run `gulp build:dev`. This will create a directory named `dist` where you can test the project.

If all the files are present in the `dist` folder and the project is ready for production, you can run `gulp build:prod`. This will use all the files in the `dist` folder, delete any hidden/unwanted files, and create a zip file ready for distribution.

**NOTE: If you've already run the `build:dev` task, when running `gulp` it will delete the entire `dist` directory. You'll have to run the `build:dev` task again to generate the files.**

To push the `dist` directory to another branch, for example `gh-pages`, run the following command:

`git subtree push --prefix dist origin gh-pages`
