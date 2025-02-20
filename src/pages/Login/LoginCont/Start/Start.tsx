// ---Dependencies
import React from 'react';
// ---Styles
import style from './Start.module.scss';
import { Button, Card } from 'antd';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
const { Meta } = Card;
interface Props {
  onClick: () => void;
}

/**
 * Start Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function Start({ onClick }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER

  return (
    <div className={style['Landing']}>
      <main className={style['main-content']}>
        {/* Main banner section */}
        <section className={style['hero-section']}>
          <div className={style['hero-container']}>
            <h1 className={style['hero-title']}>Self GPT</h1>
            <p className={style['hero-description']}>
              Your personal AI assistant, open source and <span>FREE</span> to use.
            </p>
            <div className={style['hero-buttons']}>
              <Button type='primary' onClick={onClick}>
                Get Started
              </Button>
              <Button>
                <Link
                  to='https://github.com/StevenBarquet/self-gpt'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Icon icon='mdi:github' /> View on GitHub
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section id='features' className={style['features-section']}>
          <h2 className={style['section-title']}>Features</h2>
          <div className={style['features-grid']}>
            <div className={style['feature-card']}>
              <Icon icon='mdi:brain' className={style['feature-icon']} />
              <h3>Advanced AI Models</h3>
              <p>Access to the latest OpenAI models for intelligent conversations.</p>
            </div>
            <div className={style['feature-card']}>
              <Icon icon='mdi:currency-usd' className={style['feature-icon']} />
              <h3>Pay-per-use</h3>
              <p>Only pay for the OpenAI credits you use, no subscriptions.</p>
            </div>
            <div className={style['feature-card']}>
              <Icon icon='mdi:open-source' className={style['feature-icon']} />
              <h3>Open Source</h3>
              <p>Fully transparent and customizable to fit your needs.</p>
            </div>
          </div>
        </section>

        {/* About section */}
        <section id='about' className={style['about-section']}>
          <h2 className={style['section-title']}>About Self GPT</h2>
          <p className={style['about-description']}>
            Self GPT is an open-source AI chatbot that leverages OpenAI's powerful language models.
            <br />
            <br />
            It's designed to be your personal AI assistant, helping you with various tasks while
            giving you <span>full control</span> over <span>your data</span> and interactions.
            <br />
            <br />
            As an open-source project, it's free to use and can be customized to fit your specific
            needs.
          </p>
          <div className={style['about-links']}>
            <Button>
              <Link
                to='https://github.com/StevenBarquet/self-gpt'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Icon icon='mdi:github' /> Contribute on GitHub
              </Link>
            </Button>
          </div>
        </section>

        {/* Pricing section */}
        <section id='pricing' className={style.pricing}>
          <div className='container'>
            <h2 className={style.title}>Pricing</h2>
            <div className={style.grid}>
              <Card className={style.card} bordered={false}>
                <Meta title='Basic Plan' className={style.planTitle} />
                <div className={style.price}>
                  <span className={style.amount}>FREE</span>
                </div>
                <ul className={style.features}>
                  <li>
                    <Icon icon='ph:check-circle-fill' className={style.icon} /> Access to GPT-3.5
                  </li>
                  <li>
                    <Icon icon='ph:check-circle-fill' className={style.icon} /> Chat history
                  </li>
                  <li>
                    <Icon icon='ph:check-circle-fill' className={style.icon} /> Cool Stuff
                  </li>
                </ul>
              </Card>
              <Card className={style.card} bordered={false}>
                <Meta title='Plan Pro' className={style.planTitle} />
                <div className={style.price}>
                  <span className={style.amount}>FREE</span> as well
                </div>
                <ul className={style.features}>
                  <li>
                    <Icon icon='ph:check-circle-fill' className={style.icon} /> Access to GPT-4o and
                    GPT-3o
                  </li>
                  <li>
                    <Icon icon='ph:check-circle-fill' className={style.icon} /> Chat history
                  </li>
                  <li>
                    <Icon icon='ph:check-circle-fill' className={style.icon} /> Context creation for
                    initial messages
                  </li>
                </ul>
              </Card>
            </div>
          </div>
          <p className='kidding'>
            Just kidding, all is free, you can use it as you want.
            <br />
            <br />
            Just pay for the OpenAI credits you need, no subscriptions.
          </p>
        </section>
        <div className={'secondStart'}>
          <section>
            <Button
              type='primary'
              icon={<Icon icon='simple-icons:privateinternetaccess' />}
              onClick={onClick}
            >
              Start with<span className='mark'>Self GPT</span>
            </Button>
            <Button icon={<Icon icon='mdi:github' />}>
              <Link
                to='https://github.com/StevenBarquet/self-gpt/issues/new'
                target='_blank'
                rel='noopener noreferrer'
              >
                Suggest a<span className='mark'>feature</span> or<span className='mark'>fix</span>
              </Link>
            </Button>
          </section>
        </div>
        {/* FAQ section */}
        <section id='faq' className={style['faq-section']}>
          <h2 className={style['section-title']}>Frequently Asked Questions</h2>
          <div className={style['faq-grid']}>
            <div className={style['faq-item']}>
              <h3>How much does it cost to use Self GPT?</h3>
              <p>
                Self GPT is free and open-source. The only cost is for the OpenAI API credits you
                use, which are billed directly by OpenAI.
              </p>
            </div>
            <div className={style['faq-item']}>
              <h3>Can I customize Self GPT?</h3>
              <p>
                Yes, as an open-source project, you can fork the repository and customize Self GPT
                to fit your specific needs.
              </p>
            </div>
            <div className={style['faq-item']}>
              <h3>Is my data private?</h3>
              <p>
                Yes, your conversations are processed locally and are not stored on any external
                servers. Your privacy is ensured as long as you keep your OpenAI API key secure.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className={style['footer']}>
        <p>© 2023 Self GPT. All rights reserved.</p>
        <nav>
          <Link to='#'>Terms of Service</Link>
          <Link to='#'>Privacy Policy</Link>
        </nav>
      </footer>
    </div>
  );
}
