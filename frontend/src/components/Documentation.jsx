import React, { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { TypewriterEffect } from "./ui/typewriter-effect";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "./ui/text-reveal-card";
import { FlipWords } from "./ui/flip-words";
import { BackgroundBeamsWithCollision } from "./ui/background-beams-with-collision";
import { ContainerScroll } from "./ui/container-scroll-animation";
import Footer from "./footer/Footer";

const Documentation = () => {
  const navigate = useNavigate();
  const sidebarMenu = useSelector((store) => store.page.sidebarMenu);
  const location = useLocation();

  // Function to navigate to the register page
  const handleGetStarted = () => {
    navigate("/login"); // Assuming your registration page route is /register
  };

  const words = [
    {
      text: "LinkBridger : ",
      className: "text-blue-500 dark:text-blue-500 text-4xl font-bold",
    },
    {
      text: "Personalized",
      className: "text-4xl font-bold text-black",
    },
    {
      text: "Social ",
      className: "text-4xl font-bold text-black",
    },
    {
      text: "Profile ",
      className: "text-4xl font-bold text-black",
    },
    {
      text: "Link ",
      className: "text-4xl font-bold text-black",
    },
    {
      text: "Manager.",
      className: "text-4xl font-bold text-black",
    },
  ];
  const plateforms = [
    "linkedin",
    "github",
    "leetcode",
    "portfolio",
    "instagram",
    "facebook",
    "codeforce",
  ];
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // FAQ collapse state
  const [openFAQ, setOpenFAQ] = useState([false, false, false]);
  // For Key Features expand/collapse
  const [openFeature, setOpenFeature] = useState(null);
  const toggleFAQ = (idx) => {
    setOpenFAQ((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="min-h-screen w-full bg-gradient-to-br from-pink-200 via-sky-200 to-blue-300">
      {location.pathname === "/" && (
        <div className="min-w-screen h-[70px] shadow-lg bg-neutral-100   text-right flex items-center justify-between ">
          <img
            className="h-8 w-auto ml-10 sm:ml-20"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-md sm:text-lg transition-colors mr-10 sm:mr-20 "
          >
            Get Started
          </button>
        </div>
      )}
  <motion.div variants={fadeInUp} className={`p-2 md:p-10 `}>
        <TypewriterEffect words={words} className="mb-8" />
        <TextRevealCard
          className="bg-gradient-to-r  from-pink-200 to-sky-200 mb-5 "
          text="Generate Links You'll Never Forget."
          revealText="Turn Usernames into Smart Links - Quick and Simple!"
        />
        {/* Introduction Section */}
  <motion.section variants={fadeInUp} className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Introduction</h2>
          <p className="text-base md:text-lg leading-7 text-neutral-dark">
            Welcome to <b>LinkBridger</b>, a tool designed to make your social
            media links easier to remember and manage. Whether you're sharing
            your Instagram, GitHub, or LinkedIn profile, LinkBridger allows you
            to generate personalized URLs that are simple and customizable. It
            also tracks how often your links are clicked and allows centralized
            updating, so any changes you make will reflect across all platforms
            instantly.
          </p>
  </motion.section>

  

  <motion.div variants={fadeInUp} className="mt-10 mb-0">
          <ContainerScroll
            titleComponent={
              <>
                <p className="text-4xl font-semibold text-pretty text-black">
                  Have you Ever Wondered How AuthorLink Has Been Persionalized:
                </p>
              </>
            }
          >
            <div className="mx-auto rounded-2xl h-full  flex  justify-center items-center bg-slate-600">
              <div className="md:mx-auto rounded-2xl h-full w-full space-y-1 flex flex-col justify-center md:items-center sm:ml-4 p-2 ">
                <p className="text-sm md:text-base">
                  Linkdin:
                  <a
                    href="https://linkb-one.vercel.app/dpkrn/linkedin"
                    className=" text-blue-400 underline"
                  >
                    https://linkb-one.vercel.app/dpkrn/linkedin
                  </a>
                </p>
                <p className="text-sm md:text-base">
                  Github:{" "}
                  <a
                    href="https://linkb-one.vercel.app/dpkrn/github"
                    className="text-blue-400  underline"
                  >
                    https://linkb-one.vercel.app/dpkrn/github
                  </a>
                </p>
                <p className="text-sm md:text-base">
                  LeetCode:{" "}
                  <a
                    href="https://linkb-one.vercel.app/dpkrn/leetcode"
                    className="text-blue-400  underline"
                  >
                    https://linkb-one.vercel.app/dpkrn/leetcode
                  </a>
                </p>
                <p className="text-sm md:text-base">
                  Portfolio:{" "}
                  <a
                    href="https://linkb-one.vercel.app/dpkrn/portfolio"
                    className="text-blue-400  underline"
                  >
                    https://linkb-one.vercel.app/dpkrn/portfolio
                  </a>
                </p>
                <p className="text-sm md:text-base">
                  Instagram:{" "}
                  <a
                    href="https://linkb-one.vercel.app/dpkrn/instagram"
                    className="text-blue-400  underline"
                  >
                    https://linkb-one.vercel.app/dpkrn/instagram
                  </a>
                </p>
                <p className="text-sm md:text-base">
                  Facebook:{" "}
                  <a
                    href="https://linkb-one.vercel.app/dpkrn/facebook"
                    className="text-blue-400 underline"
                  >
                    https://linkb-one.vercel.app/dpkrn/facebook
                  </a>
                </p>
                <p className="text-sm md:text-base">
                  Codeforce:{" "}
                  <a
                    href="https://linkb-one.vercel.app/dpkrn/codeforces"
                    className="text-blue-400 underline"
                  >
                    https://linkb-one.vercel.app/dpkrn/codeforces
                  </a>
                </p>
                <p className="text-sm md:text-base">
                  Only Plateform name has been changed..all remains same
                </p>
              </div>
            </div>
          </ContainerScroll>
  </motion.div>

  <motion.div variants={fadeInUp} className="mb-8 bg-white/40 shadow-lg rounded-md py-4 md:py-5 px-2 md:px-6 text-center">
          <BackgroundBeamsWithCollision>
            <div>
               
              <div className="relative mx-auto  w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-400 via-violet-200 to-pink-500 py-4">
                  <span className="uppercase text-[8px] md:text-lg">
                    It will provide special link for all your platform.
                  </span>
                </div>
              </div>
               <p className="text-sm md:text-2xl">
              <a
                href="https://linkb-one.vercel.app/dpkrn/"
                className="text-blue-500 underline font-mono"
              >
                https://linkb-one.vercel.app/dpkrn
               
              </a>
            </p>
              <div className="relative mx-auto  w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-400 via-violet-200 to-pink-500 py-4">
                  <span className="uppercase text-[8px] md:text-lg">
                    Change only platform name-redirect to all profiles
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm md:text-2xl">
              <a
                href="https://linkb-one.vercel.app/dpkrn/linkedin"
                className="text-blue-500 underline font-mono"
              >
                https://linkb-one.vercel.app/dpkrn/
                <FlipWords className="text-blue-500" words={plateforms} />{" "}
              </a>
            </p>
          </BackgroundBeamsWithCollision>
  </motion.div>

        {/* Get Started Button */}
  <motion.section variants={fadeInUp} className="mb-12 text-center">
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md text-lg transition-colors"
          >
            Get Started
          </button>
          <p className="mt-4 text-gray-500 text-sm">
            Create an account and start managing your personalized links today!
          </p>
  </motion.section>

        {/* Key Features Section */}
  <motion.section variants={fadeInUp} className="mb-8 bg-white/40 shadow-lg rounded-md py-4 md:py-5 px-2 md:px-4">
    <div>
  <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-primary">Key Features</h2>
      <div className="space-y-2 flex flex-col">
        {/* Interactive Feature Cards with alternate sides and scroll-in focus */}
        {[
          {
            img: "easy-to-remember.webp",
            title: "Personalized Smart Links",
            desc: "Generate easy-to-remember links for your social profiles using your username and platform names.",
          },
           {
            img: "logo.png",
            title: "All links at one place",
            desc: "Get a single special link for all your platforms, just like Linktree. Share one URL (e.g., https://linkb-one.vercel.app/username) and let your audience access all your profiles from one place.",
          },
          {
            img: "update.webp",
            title: "Centralized Link Management",
            desc: "Update your social profile links in one place, and the change reflects everywhere.",
          },
          {
            img: "click.webp",
            title: "Click Tracking",
            desc: "Keep track of how many times your social profile links are clicked.",
          },
          {
            img: "easysetup.webp",
            title: "Easy to Setup",
            desc: "No complicated setup; just choose your username, add the platform, and you're ready to go!",
          },
         
        ].map((feature, idx) => {
          const ref = useRef(null);
          const inView = useInView(ref, { once: true, margin: "-100px" });
          const isLeft = idx % 2 === 0;
          return (
            <motion.div
              key={feature.title}
              ref={ref}
              initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, type: "spring" }}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
              className={`group relative text-center flex-col md:text-left flex md:flex-row ${isLeft ? "" : "md:flex-row-reverse"} md:justify-around items-center gap-4 flex-wrap cursor-pointer`}
              onClick={() => setOpenFeature(idx)}
              // style={{ marginLeft: inView ? "" : "none", outlineOffset: inView ? "2px" : "0" }}
            >
              <motion.img
                src={feature.img}
                alt={feature.title}
                className="h-[220px] w-[250px] my-8 mx-8  rounded-md flex-[1] group-hover:opacity-100 group-hover:scale-105 transition-all"
                whileHover={{ scale: 1.08, opacity: 1 }}
              />
              <div className="flex-[1]">
                <p className="text-lg md:text-xl ml-4 font-medium text-neutral-dark">
                  <span className="font-semibold text-xl md:text-2xl text-primary">{feature.title}</span>: {feature.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </motion.section>

        {/* How It Works Section */}
  <motion.section variants={fadeInUp} className="mb-8 bg-white/40 shadow-lg rounded-md py-4 md:py-5 px-2 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">How It Works</h2>
          <p className="text-base md:text-lg leading-7 text-neutral-dark">
            The core idea behind <b>LinkBridger</b> is to simplify the
            management of social media links. Instead of sharing long,
            hard-to-remember URLs, you create a single, personalized URL that
            automatically redirects users to the correct platform. Here’s a
            step-by-step guide:
          </p>
          <ol className="list-decimal list-inside space-y-2 mt-4">
            <li>
              <b>Create an Account</b>: Sign up using your email and create an
              account on LinkBridger.
            </li>
            <li>
              <b>Choose a Username</b>: Pick a username that’s easy to remember
              (e.g., dpkrn). Your link will follow this format:
              `https://linkb-one.vercel.app/your-username/instagram`.
            </li>
            <li>
              <b>Verify Your Account</b>: Complete email verification to
              activate your account.
            </li>
            <li>
              <b>Create a New Link</b>:
              <ul className="list-disc list-inside ml-6 space-y-1">
                <li>
                  Enter the platform name (e.g., Instagram, LinkedIn) in
                  lowercase.
                </li>
                <li>Paste your profile URL in the "Destination URL" field.</li>
                <li>Click "Create Link" to generate your personalized link.</li>
              </ul>
            </li>
            <li>
              <b>Share the Link</b>: Copy and share your smart link across
              various platforms.
            </li>
          </ol>
          <div className="mt-4">
            <p className="text-lg">Example:</p>
            <p className="text-lg">
              Instagram:{" "}
              <a
                href="https://linkb-one.vercel.app/dpkrn/instagram"
                className="text-blue-500 underline"
              >
                https://linkb-one.vercel.app/dpkrn/instagram
              </a>
            </p>
            <p className="text-lg">
              LeetCode:{" "}
              <a
                href="https://linkb-one.vercel.app/dpkrn/leetcode"
                className="text-blue-500 underline"
              >
                https://linkb-one.vercel.app/dpkrn/leetcode
              </a>
            </p>
          </div>
  </motion.section>

        {/* Click Tracking Section */}
  <motion.section variants={fadeInUp} className="mb-12 bg-white/40 shadow-lg rounded-md py-4 md:py-5 px-2 md:px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Click Tracking</h2>
          <p className="text-base md:text-lg leading-7 text-neutral-dark">
            With <b>LinkBridger</b>, you can track how many times each of your
            links has been clicked. This allows you to monitor the engagement on
            your social media profiles across different platforms. Access the
            analytics section from your dashboard to see detailed statistics
            about each link’s performance.
          </p>
  </motion.section>

        {/* Future Enhancements Section */}
  <motion.section variants={fadeInUp} className="mb-12 bg-white/40 shadow-lg rounded-md py-4 md:py-5 px-2 md:px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Future Enhancements</h2>
          <p className="text-base md:text-lg leading-7 text-neutral-dark">
            Here are some potential features and enhancements we are planning to
            add to <b>LinkBridger</b>:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <b>Advanced Analytics</b>: See detailed reports on clicks, traffic
              sources, and engagement levels for each link.
            </li>
            <li>
              <b>Custom Link Themes</b>: Add custom themes or styles to your
              personalized links to match your branding or style preferences.
            </li>
            <li>
              <b>Link Expiration</b>: Set expiration dates for temporary links,
              ensuring they are only accessible for a certain period.
            </li>
            <li>
              <b>Link Password Protection</b>: Add a layer of security by
              allowing password protection on sensitive links.
            </li>
          </ul>
  </motion.section>

        {/* FAQ Section */}
        <motion.section variants={fadeInUp} className="mb-12 bg-white/40 shadow-lg rounded-md py-4 md:py-5 px-2 md:px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Frequently Asked Questions (FAQ)</h2>
          <p className="text-base md:text-lg leading-7 mb-4 text-neutral-dark">Here are some common questions users have about <b>LinkBridger</b>:</p>
          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="border rounded-md p-3 bg-white/60 cursor-pointer hover:shadow-lg transition-all" onClick={() => toggleFAQ(0)}>
              <p className="font-semibold flex justify-between items-center">
                Q: Can I change my username after creating an account?
                <span>{openFAQ[0] ? "-" : "+"}</span>
              </p>
              {openFAQ[0] && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                  A: Unfortunately, usernames cannot be changed once they are set. Choose your username carefully!
                </motion.p>
              )}
            </div>
            {/* FAQ 2 */}
            <div className="border rounded-md p-3 bg-white/60 cursor-pointer hover:shadow-lg transition-all" onClick={() => toggleFAQ(1)}>
              <p className="font-semibold flex justify-between items-center">
                Q: How do I track my link clicks?
                <span>{openFAQ[1] ? "-" : "+"}</span>
              </p>
              {openFAQ[1] && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                  A: Click tracking is available through your dashboard. You can view the number of clicks for each link, and advanced analytics will be added soon.
                </motion.p>
              )}
            </div>
            {/* FAQ 3 */}
            <div className="border rounded-md p-3 bg-white/60 cursor-pointer hover:shadow-lg transition-all" onClick={() => toggleFAQ(2)}>
              <p className="font-semibold flex justify-between items-center">
                Q: Can I use custom platforms other than the popular ones (Instagram, LinkedIn, etc.)?
                <span>{openFAQ[2] ? "-" : "+"}</span>
              </p>
              {openFAQ[2] && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                  A: Yes! You can add any platform as long as you provide the correct profile URL.
                </motion.p>
              )}
            </div>
          </div>
        </motion.section>

        {/* Testimonials Section - now at bottom */}
        <motion.section variants={fadeInUp} className="mb-12 bg-white/60 shadow-lg rounded-md py-8 px-4 md:px-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">What Our Users Say</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <div className="bg-white rounded-lg shadow p-6 max-w-sm mx-auto">
              <p className="text-lg italic text-neutral-dark">“LinkBridger made sharing my profiles so much easier. The personalized links look great and are super easy to remember!”</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <img src="profile.jpg" alt="User" className="h-10 w-10 rounded-full object-cover" />
                <span className="font-semibold text-primary">Amit S.</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 max-w-sm mx-auto">
              <p className="text-lg italic text-neutral-dark">“I love the analytics and the ability to update all my links in one place. Highly recommended!”</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <img src="profile.jpg" alt="User" className="h-10 w-10 rounded-full object-cover" />
                <span className="font-semibold text-primary">Priya K.</span>
              </div>
            </div>
          </div>
        </motion.section>
        {/* Footer Section */}
        <Footer />
        <footer className="text-center py-6 border-t mt-12">
          <motion.p variants={fadeInUp} className="text-lg">
            &copy; 2024 LinkBridger. All Rights Reserved.
          </motion.p>
        </footer>
      </motion.div>
    </motion.div>
  );
};

export default Documentation;
