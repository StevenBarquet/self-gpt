// ---Dependencies

import { Icon } from "@iconify/react";
import { Button, Card } from "antd";
import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import { features } from "./features";
// ---Styles
import style from "./Start.module.scss";

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
		<div className={style["Landing"]}>
			<main className={style["main-content"]}>
				{/* Main banner section */}
				<section className={style["hero-section"]}>
					<div className={style["hero-container"]}>
						<h1 className={style["hero-title"]}>Self GPT</h1>
						<p className={style["hero-description"]}>
							Your personal AI assistant, open source and{" "}
							<span>FREE (Kinda)</span> to use.
						</p>
						<div className={style["hero-buttons"]}>
							<Button type="primary" onClick={onClick}>
								Get Started
							</Button>
							<Button>
								<Link
									to="https://github.com/StevenBarquet/self-gpt"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Icon icon="mdi:github" /> View on GitHub
								</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Features section */}
				<section id="features" className={style["features-section"]}>
					<h2 className={style["section-title"]}>Powerful Features</h2>
					<div className={style["features-grid"]}>
						{features.map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
							>
								<Card
									className={style["feature-card"]}
									hoverable
									cover={
										<div className={style["feature-icon"]}>{feature.icon}</div>
									}
								>
									<Meta
										title={
											<h3 className={style["feature-title"]}>
												{feature.title}
											</h3>
										}
										description={
											<p className={style["feature-description"]}>
												{feature.description}
											</p>
										}
									/>
								</Card>
							</motion.div>
						))}
					</div>
				</section>

				{/* About section */}
				<section id="about" className={style["about-section"]}>
					<h2 className={style["section-title"]}>Who need this?</h2>
					<p className={style["about-description"]}>
						<b>Only</b> users that currently pay for{" "}
						<span>Chatgpt premium</span> or similar <span>paid</span> ai
						chatbot.
						<br />
						<br />
						<b>Why?</b> Because maybe you want to save around <span>90%</span>{" "}
						of your money by switching to a <span>pay as you go</span> simple AI
						chatbot.
						<br />
						<br />
						Self GPT is an <span>open-source</span> AI chatbot that uses OpenAI
						services directly, without intermediaries, crypto mining,{" "}
						<span>stealing your data</span>, or other hidden costs that other
						chatbots may do.
						<br />
						<br />
						Since is a community tool, it depends on contributions to keep it
						modern and updated, so it is not as good as a paid services yet.
					</p>
					<div className={style["about-links"]}>
						<Button>
							<Link
								to="https://github.com/StevenBarquet/self-gpt"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon icon="mdi:github" /> Contribute on GitHub
							</Link>
						</Button>
					</div>
				</section>

				{/* Pricing section */}
				<section id="pricing" className={style.pricing}>
					<div className="container">
						<h2 className={style.title}>Pricing</h2>
						<div className={style.grid}>
							<Card className={style.card} bordered={false}>
								<Meta title="Basic Plan" className={style.planTitle} />
								<div className={style.price}>
									<span className={style.amount}>A lot $$$</span>
								</div>
								<ul className={style.features}>
									<li>
										<Icon icon="ph:check-circle-fill" className={style.icon} />{" "}
										Access to GPT-3.5
									</li>
									<li>
										<Icon icon="ph:check-circle-fill" className={style.icon} />{" "}
										Chat history
									</li>
									<li>
										<Icon icon="ph:check-circle-fill" className={style.icon} />{" "}
										Cool Stuff
									</li>
								</ul>
							</Card>
							<Card className={style.card} bordered={false}>
								<Meta title="Plan Pro" className={style.planTitle} />
								<div className={style.price}>
									<span className={style.amount}>A lot $$$</span> as well
								</div>
								<ul className={style.features}>
									<li>
										<Icon icon="ph:check-circle-fill" className={style.icon} />{" "}
										Access to GPT-4o and GPT-3o
									</li>
									<li>
										<Icon icon="ph:check-circle-fill" className={style.icon} />{" "}
										Chat history
									</li>
									<li>
										<Icon icon="ph:check-circle-fill" className={style.icon} />{" "}
										Context creation for initial messages
									</li>
								</ul>
							</Card>
						</div>
					</div>
					<p className="kidding">
						Just kidding, all is <span>FREE</span>, you can use it as much as
						you want.
						<br />
						<br />
						Just pay for the OpenAI credits you need (usually $10 USD are enough
						for 3 to 6 months), no subscriptions.
					</p>
				</section>
				<div className={"secondStart"}>
					<section>
						<Button
							type="primary"
							icon={<Icon icon="simple-icons:privateinternetaccess" />}
							onClick={onClick}
						>
							Start with<span className="mark">Self GPT</span>
						</Button>
						<Button icon={<Icon icon="mdi:github" />}>
							<Link
								to="https://github.com/StevenBarquet/self-gpt/issues/new"
								target="_blank"
								rel="noopener noreferrer"
							>
								Suggest a<span className="mark">feature</span> or
								<span className="mark">fix</span>
							</Link>
						</Button>
					</section>
				</div>
				{/* FAQ section */}
				<section id="faq" className={style["faq-section"]}>
					<h2 className={style["section-title"]}>Frequently Asked Questions</h2>
					<div className={style["faq-grid"]}>
						<div className={style["faq-item"]}>
							<h3>How much does it cost to use Self GPT?</h3>
							<p>
								Self GPT is free and open-source. The only cost is for the
								OpenAI API credits you use, which are billed directly by OpenAI.
							</p>
						</div>
						<div className={style["faq-item"]}>
							<h3>Can I customize Self GPT?</h3>
							<p>
								Yes, as an open-source project, you can fork the repository and
								customize Self GPT to fit your specific needs.
							</p>
						</div>
						<div className={style["faq-item"]}>
							<h3>Is my data private?</h3>
							<p>
								Yes, your conversations are stored in your own database (see the
								setup). <br /> <br />
								Your API keys are stored locally, not sended to any external
								server.Your privacy is ensured.
							</p>
						</div>
					</div>
				</section>
			</main>

			<footer className={style["footer"]}>
				<p>© 2023 Self GPT. All rights reserved.</p>
				<nav>
					<Link to="#">Terms of Service</Link>
					<Link to="#">Privacy Policy</Link>
				</nav>
			</footer>
		</div>
	);
}
