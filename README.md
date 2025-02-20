**Setup Instructions for Self-GPT**

**Introduction**
Welcome to Self-GPT, your cost-effective and private chatbot solution. Follow these step-by-step instructions to set up your instance using OpenAI's API and Supabase for data storage.

**Prerequisites**

- A device with internet access.
- Basic familiarity with web applications and database management (helpful but not required).

**Step 1: Set Up Accounts**

1. **Create a Supabase Account**

   - Visit [Supabase](https://supabase.com) and sign up if you haven't already.
   - Verify your email and log into the Supabase dashboard.

2. **Create an OpenAI Account**
   - Go to [OpenAI](https://platform.openai.com) and create an account.
   - Confirm your email and complete any verification steps as needed.

**Step 2: Obtain OpenAI API Key**

1. Navigate to the OpenAI dashboard.
2. Go to the API keys section and click "Create API Key" to generate a new key.
3. **Important**: Copy the `OPEN_AI_API_KEY` key immediately and store it securely (e.g., in a password manager or secure private file).

**Step 3: Add OpenAI Credits**

- In your OpenAI account, go to the billing section.
- Add credits to your account to cover anticipated usage. Typically, $10 is sufficient for 3-6 months of use, depending on your interactions.

**Step 4: Set Up Supabase Project**

1. **Create a New Supabase Project**

   - In the Supabase dashboard, select "New Project".
   - Enter a project name and choose your region, then wait for the database to be provisioned.

2. **Save Connection Credentials**
   - Once your project is set up, navigate to the "Settings" tab.
   - In the "API" section, locate "Project URL" and "API Keys."
   - Under the "Configuration" section, find the `SUPABASE_URL` and `SUPABASE_ANON_KEY` in the "Framework/React" connection settings.
   - Copy both the `SUPABASE_URL` and `SUPABASE_ANON_KEY`. Store these credentials securely, as they are required for connecting your application to the Supabase database.

**Step 5: Initialize the Supabase Database**

1. **Access the SQL Editor**

   - Within your Supabase project dashboard, click on "SQL Editor" in the sidebar.

2. **Execute Initialization Script**
   - Copy the entire contents of the initialization script from [SQL-INIT.sql](https://github.com/StevenBarquet/self-gpt/blob/main/SQL-INIT.sql).
   - Paste it into the SQL Editor and execute the script to set up your database schema.
   - Confirm that the script executes without errors.

**Step 6: Connect the Application (Final Step)**

1. **Access the Web App**

   - Visit [Self-GPT](https://self-gpt.pages.dev) and click on "Get Started".

2. **Enter Credentials**

   - Scroll down and enter the `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `OPEN_AI_API_KEY` you stored securely in the previous steps.

3. **Finalize Setup**
   - Click on "Continue" to complete the setup process.

Congratulations! You should now be able to use Self-GPT.

---

**Additional Tips**

- Regularly update your API keys and credentials for security purposes.
- Monitor your OpenAI usage to manage costs effectively.
- For updates and community support, visit the Self-GPT GitHub repository.

  ## TODO and ideas

  - Search in messages
  - Search in chats and GPTs
  - Edit conversation names
  - Edit GPTs and contexts
  - Pin conversations and GPTs maybe
  - ~~Fix memory leaks~~
  - Use url params to select GPTs and Chats
  - Add stop button in ask section
  - Fix selected chats bug after batch delete
  - Support for image generation and image upload

  # Contribute:

  Feel free to contribute to this project, you can create an issue, open a PR or send me an email: mlmjm123@gmail.com.
