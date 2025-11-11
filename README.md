# Daily Finance Automation Project (Playwright)

This project demonstrates web automation on the **Daily Finance** website ([https://dailyfinance.roadtocareer.net/](https://dailyfinance.roadtocareer.net/)) using **Playwright**.

---

## Description
The automated workflow includes:
1. Visit the site: [https://dailyfinance.roadtocareer.net/](https://dailyfinance.roadtocareer.net/).  
2. **Register a new user**.  
3. Assert that a **congratulatory email** is received.  
4. Save the user information to a **JSON file**.  
5. **Login** with the newly created user and assert that `/user` persists in the URL.  
6. **Add 2 items**, store the table values in a **TXT file**, and **logout**.  
7. **Reset password**:  
   - Retrieve the new password from the email.  
   - Login again with the updated password.  
8. **Upload a profile image**:  
   - Ensure the image is ≤ 100 KB.  
   - Verify the upload by asserting that `img src` contains `"profileImage"`.  
9. **Configure CI/CD** pipeline and create a **cronjob** in `playwright.yml` to run every **Friday at 11:59 PM**.

## Playwright Report

<img width="1358" height="650" alt="screencapture-localhost-9323-2025-11-12-01_18_40" src="https://github.com/user-attachments/assets/a7af74d3-f68c-40ae-8c23-4d01a4f13fb9" />


---

##  Project Setup

### 1. Install Playwright

```bash
npm install playwright@latest
```
### 2. Run Playwright Tests
```bash
npx playwright test
```

### 3. Generate Playwright Reports
```bash
  npx playwright show-report
```

### 4. Installed Packages
# dotenv → load environment variables
``` bash 
npm i dotenv
```
# @faker-js/faker → generate fake data
``` bash
npm i @faker-js/faker
```
##  Login Assertion
After login, assert that the `/user` page persists in the URL:

```bash
await expect(page).toHaveURL(/.*\/user/);
```
## Email Assertion

To verify the congratulatory email, a **Google OAuth token** is used from [Google OAuth Playground](https://developers.google.com/oauthplayground/).
The token is stored as an **environment variable** so that Playwright can access it during tests:
```bash
Authorization: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN}`
```
and to automate the tests in GitHub Actions, we stored the GOOGLE_ACCESS_TOKEN in the actions variable.

## Setup in GitHub Actions (CI/CD)
1. Go to **Settings → Secrets and variables → Actions** in your repository.  
2. Add a new secret: `GOOGLE_ACCESS_TOKEN` with your token value.  
3. GitHub Actions will automatically inject it as an environment variable for the workflow.

## CI/CD & Cronjob
The workflow is configured in `.github/workflows/playwright.yml`. The cronjob runs **every Friday at 11:59 PM**.  
⚠️ **Note:** GitHub Actions cron uses UTC, so adjust if necessary:
```bash
schedule:
  - cron: "59 23 * * 5"  # Friday 11:59 PM
```
## References
- [Playwright Documentation](https://playwright.dev/docs/intro)  
- [Google OAuth Playground](https://developers.google.com/oauthplayground/)

