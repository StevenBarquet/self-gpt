// ---Dependencies
import React from 'react';
// ---Styles
import style from './Setup.module.scss';
import { Button } from 'antd';

import { Icon } from '@iconify/react';

/**
 * Setup Component: Descripción del comportamiento...
 */
export function Setup({ children, goBack }: { children: React.ReactNode; goBack: () => void }) {
  return (
    <div className={style['Setup']}>
      <div className='setup-button-container'>
        <Button icon={<Icon icon='lets-icons:back' />} onClick={goBack} type='primary'>
          Back to Home
        </Button>
      </div>
      <div className='setup-container'>
        <h1 className='setup-title'>Setup Self GPT</h1>
        <section className='setup-introduction'>
          <h2>Introduction</h2>
          <p>
            Welcome to Self-GPT, your cost-effective and private chatbot solution. Follow these
            step-by-step instructions to set up your instance using OpenAI's API and Supabase for
            data storage.
          </p>
        </section>
        <section className='setup-prerequisites'>
          <h2>Prerequisites</h2>
          <ul>
            <li>A device with internet access.</li>
            <li>
              Basic familiarity with web applications and database management (helpful but not
              required).
            </li>
          </ul>
        </section>
        <ol className='setup-steps'>
          <li>
            <h3>Step 1: Set Up Accounts</h3>
            <ol>
              <li>
                <strong>Create a Supabase Account</strong>
                <ul>
                  <li>
                    Visit{' '}
                    <a href='https://supabase.com' target='_blank' rel='noopener noreferrer'>
                      Supabase
                    </a>{' '}
                    and sign up if you haven't already.
                  </li>
                  <li>Verify your email and log into the Supabase dashboard.</li>
                </ul>
              </li>
              <li>
                <strong>Create an OpenAI Account</strong>
                <ul>
                  <li>
                    Go to{' '}
                    <a href='https://platform.openai.com' target='_blank' rel='noopener noreferrer'>
                      OpenAI
                    </a>{' '}
                    and create an account.
                  </li>
                  <li>Confirm your email and complete any verification steps as needed.</li>
                </ul>
              </li>
            </ol>
          </li>
          <li>
            <h3>Step 2: Obtain OpenAI API Key</h3>
            <ol>
              <li>Navigate to the OpenAI dashboard.</li>
              <li>Go to the API keys section and click "Create API Key" to generate a new key.</li>
              <li>
                <strong>Important:</strong> Copy the <code>OPEN_AI_API_KEY</code> key immediately
                and store it securely (e.g., in a password manager or secure private file).
              </li>
            </ol>
          </li>
          <li>
            <h3>Step 3: Add OpenAI Credits</h3>
            <p>In your OpenAI account, go to the billing section.</p>
            <p>
              Add credits to your account to cover anticipated usage. Typically, $10 is sufficient
              for 3-6 months of use, depending on your interactions.
            </p>
          </li>
          <li>
            <h3>Step 4: Set Up Supabase Project</h3>
            <ol>
              <li>
                <strong>Create a New Supabase Project</strong>
                <ul>
                  <li>In the Supabase dashboard, select "New Project".</li>
                  <li>
                    Enter a project name and choose your region, then wait for the database to be
                    provisioned.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Save Connection Credentials</strong>
                <ul>
                  <li>Once your project is set up, navigate to the "Settings" tab.</li>
                  <li>In the "API" section, locate "Project URL" and "API Keys."</li>
                  <li>
                    Under the "Configuration" section, find the <code>SUPABASE_URL</code> and{' '}
                    <code>SUPABASE_ANON_KEY</code> in the "Framework/React" connection settings.
                  </li>
                  <li>
                    Copy both the <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code>.
                    Store these credentials securely, as they are required for connecting your
                    application to the Supabase database.
                  </li>
                </ul>
              </li>
            </ol>
          </li>
          <li>
            <h3>Step 5: Initialize the Supabase Database</h3>
            <ol>
              <li>
                <strong>Access the SQL Editor</strong>
                <ul>
                  <li>
                    Within your Supabase project dashboard, click on "SQL Editor" in the sidebar.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Execute Initialization Script</strong>
                <ul>
                  <li>
                    Copy the entire contents of the initialization script from{' '}
                    <a
                      href='https://github.com/StevenBarquet/self-gpt/blob/main/SQL-INIT.sql'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      SQL-INIT.sql
                    </a>
                    .
                  </li>
                  <li>
                    Paste it into the SQL Editor and execute the script to set up your database
                    schema.
                  </li>
                  <li>Confirm that the script executes without errors.</li>
                </ul>
              </li>
            </ol>
          </li>
          <li>
            <h3>Step 6: Connect the Application (Final Step)</h3>
            <ol>
              <li></li>
              <li>
                <strong>Load your credentials</strong>
                <ul>
                  <li>
                    In the current page, scroll down to the section{' '}
                    <span>
                      <i>Enter Credentials</i>
                    </span>{' '}
                    and enter the <code>SUPABASE_URL</code>, <code>SUPABASE_ANON_KEY</code> and{' '}
                    <code>OPEN_AI_API_KEY</code> you stored securely in the previous steps.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Finalize Setup</strong>
                <ul>
                  <li>Click on "Continue" to complete the setup process.</li>
                </ul>
              </li>
            </ol>
          </li>
        </ol>
        <p className='setup-congratulations'>
          Congratulations! You should now be able to use Self-GPT.
        </p>

        {children}
      </div>
    </div>
  );
}
