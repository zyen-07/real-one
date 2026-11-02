# Real Ones

A friend-quiz site: you answer questions about yourself, friends try to match your answers, scores go on a leaderboard.
Plain HTML, CSS and JavaScript. No build step.

## Run it in VS Code (browser-only mode)

1. Install the "Live Server" extension in VS Code.
2. Right-click `index.html` and choose "Open with Live Server".
3. Make a quiz, tick your answers, save. You land on the copy-link page.
4. Test as a friend: open `index.html?as=friend#play-XXXXXXX` in a new tab (use the code from your link, keep `?as=friend`).

In this mode everything is stored in your own browser. Nothing is shared with other devices, so it cannot work as a real site yet.

## Make it a real, shared site (Firebase, free tier)

1. Go to console.firebase.google.com and create a project.
2. Build > Authentication > Sign-in method: enable **Anonymous**.
3. Build > Firestore Database: create a database, then paste `firestore.rules` into the Rules tab and publish.
4. Project settings > Your apps > Web app: copy the `firebaseConfig` object.
5. In `index.html`, uncomment the three Firebase script tags and replace `firebase: null` with `firebase: { ...your config... }`.
6. Open it again. Quizzes and scores are now shared.

## Put it online

Drag the whole folder onto netlify.com/drop, or deploy it to Vercel. Add the site's domain under Firebase > Authentication > Settings > Authorized domains.

## Known limits (read before launching)

- **Not tested against Firebase.** The Firebase mode is written to the same API the app already uses, but I could not run it against a real project. Expect to fix small things.
- **Answers are readable.** The correct answers are stored in the quiz document, so a technical friend can look them up. A fix needs a small server function that scores answers.
- **Scores are client-side.** Anyone who knows how can post a fake score. The rules only check that the score is sane.
- **Anonymous accounts.** Clearing browser data loses the ownership of a quiz.
- **Ads.** AdSense needs a privacy policy page, an about page and real traffic. Not included.
- Tamil and Hindi text are my own translations. Have a native speaker read them.
