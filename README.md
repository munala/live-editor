# LiveEditor

This is a website that allows a user to type notes on the fly with automatic saving. The website is hosted [here](https://live-editor-23675.web.app/). This was build using [Angular 10](https://angular.io/) and [MediumEditor](https://github.com/yabwe/medium-editor).

## Running the website

- Clone the repo by running `git clone https://github.com/munala/live-editor.git`.
- Navigate into the folder `cd live-editor`.
- Install dependencies `npm install`.
- Create a folder inside `src` folder called `environments`, create two files `environment.ts` and `environment.prod.ts` for production, and inside them add the following content:

  ```
  export const environment = {
    production: false, // `true` in `environment.prod.ts`
    firebaseConfig: {
      apiKey: <api_key>,
      authDomain: <auth_domain>,
      databaseURL: <databse_url>,
      projectId: <project_id>,
      storageBucket: <storage_bucket>,
      messagingSenderId: <messaging_sendr_id>,
      appId: <app_id>
    }
  };
  ```

  The values have not been posted for security reasons.

- Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
- Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Usage

- After navigating to the website you will be greeted with the authentication page. You can only sing in using a Google account.
- Press the `Connect With Google` button and select or create a Google account on the prompt that follows.
- You will be redirected back to the website and taken to the editor page.
- You will see a blank editor if this is your first time using the website. If you have used it before the editor will be pre-filled with your previously saved content. The editor supports the following text formats, with more coming in the future:
  - Bold
  - Italic
  - Underline
  - Link
  - Header
- You can write math equations using LaTeX syntax. Type an equation between two `$` symbols and it will be rendered as an equation.
