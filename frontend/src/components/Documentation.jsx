import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const Documentation = () => {
  const navigate = useNavigate();
  const sidebarMenu=useSelector(store=>store.page.sidebarMenu)
  const location=useLocation()

  // Function to navigate to the register page
  const handleGetStarted = () => {
    navigate('/login'); // Assuming your registration page route is /register
  };

  return (
    <>
     {location.pathname==='/'&&<div className='min-w-screen h-[70px] shadow-lg bg-neutral-100   text-right flex items-center justify-between '>
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
     </div>}
    <div className={`sm:m-10 p-10 ${sidebarMenu?"blur-sm":""}`}>
      
      {/* Title Section */}
      <h1 className="text-4xl font-bold text-center mb-8">LinkBridger: Personalized Social Profile Link Manager</h1>

      {/* Introduction Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="text-lg leading-7">
          Welcome to **LinkBridger**, a tool designed to make your social media links easier to remember and manage. 
          Whether you're sharing your Instagram, GitHub, or LinkedIn profile, LinkBridger allows you to generate personalized URLs 
          that are simple and customizable. It also tracks how often your links are clicked and allows centralized updating, 
          so any changes you make will reflect across all platforms instantly.
        </p>
      </section>

      <div className="mt-4 mb-10">
          <p className="text-lg">
            Have you Ever Wondered How AuthorLink Has Been Persionalized:  
          </p>
          <p className="text-lg">Linkdin: <a href="https://linkb-one.vercel.app/dpkrn/linkdin" className="text-blue-500 underline">https://linkb-one.vercel.app/dpkrn/linkdin</a></p>
          <p className="text-lg">Github: <a href="https://linkb-one.vercel.app/dpkrn/github" className="text-blue-500 underline">https://linkb-one.vercel.app/dpkrn/github</a></p>
          <p className="text-lg">LeetCode: <a href="https://linkb-one.vercel.app/dpkrn/leetcode" className="text-blue-500 underline">https://linkb-one.vercel.app/dpkrn/leetcode</a></p>
          <p className="text-lg">Portfolio: <a href="https://linkb-one.vercel.app/dpkrn/portfolio" className="text-blue-500 underline">https://linkb-one.vercel.app/dpkrn/portfolio</a></p>
          <p className="text-lg">Instagram: <a href="https://linkb-one.vercel.app/dpkrn/instagram" className="text-blue-500 underline">https://linkb-one.vercel.app/dpkrn/instagram</a></p>
          <p className="text-lg">Facebook: <a href="https://linkb-one.vercel.app/dpkrn/facebook" className="text-blue-500 underline">https://linkb-one.vercel.app/dpkrn/facebook</a></p>
          <p className="text-lg">LeetCode: <a href="https://linkb-one.vercel.app/dpkrn/codeforces" className="text-blue-500 underline">https://linkb-one.vercel.app/dpkrn/codeforces</a></p>
          <p className="text-lg mt-4">
            Only Plateform name has been changed..all remains same  
          </p>
        </div>

      {/* Get Started Button */}
      <section className="mb-12 text-center">
        <button
          onClick={handleGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md text-lg transition-colors"
        >
          Get Started
        </button>
        <p className="mt-4 text-gray-500 text-sm">Create an account and start managing your personalized links today!</p>
      </section>

      {/* Key Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>**Personalized Smart Links**: Generate easy-to-remember links for your social profiles using your username and platform names.</li>
          <li>**Centralized Link Management**: Update your social profile links in one place, and the change reflects everywhere.</li>
          <li>**Click Tracking**: Keep track of how many times your social profile links are clicked.</li>
          <li>**Easy to Setup**: No complicated setup; just choose your username, add the platform, and you're ready to go!</li>
        </ul>
      </section>

   

      {/* How It Works Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <p className="text-lg leading-7">
          The core idea behind **LinkBridger** is to simplify the management of social media links. Instead of sharing long, hard-to-remember URLs, 
          you create a single, personalized URL that automatically redirects users to the correct platform. Here’s a step-by-step guide:
        </p>
        <ol className="list-decimal list-inside space-y-2 mt-4">
          <li>**Create an Account**: Sign up using your email and create an account on LinkBridger.</li>
          <li>**Choose a Username**: Pick a username that’s easy to remember (e.g., dpkrn). Your link will follow this format: `https://linkb-one.vercel.app/your-username/instagram`.</li>
          <li>**Verify Your Account**: Complete email verification to activate your account.</li>
          <li>**Create a New Link**:
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Enter the platform name (e.g., Instagram, LinkedIn) in lowercase.</li>
              <li>Paste your profile URL in the "Destination URL" field.</li>
              <li>Click "Create Link" to generate your personalized link.</li>
            </ul>
          </li>
          <li>**Share the Link**: Copy and share your smart link across various platforms.</li>
        </ol>
        <div className="mt-4">
          <p className="text-lg">
            Example:  
          </p>
          <p className="text-lg">Instagram: <a href="https://linkb-one.vercel.app/dpkrn/instagram" className="text-blue-500 underline">https://linkb-one.vercel.app/dpkrn/instagram</a></p>
          <p className="text-lg">LeetCode: <a href="https://linkb-one.vercel.app/dpkrn/leetcode" className="text-blue-500 underline">https://linkb-one.vercel.app/dpkrn/leetcode</a></p>
        </div>
      </section>

      {/* Click Tracking Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Click Tracking</h2>
        <p className="text-lg leading-7">
          With **LinkBridger**, you can track how many times each of your links has been clicked. This allows you to monitor the engagement on your social media profiles across different platforms. 
          Access the analytics section from your dashboard to see detailed statistics about each link’s performance.
        </p>
      </section>

      {/* Future Enhancements Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Future Enhancements</h2>
        <p className="text-lg leading-7">Here are some potential features and enhancements we are planning to add to **LinkBridger**:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>**Advanced Analytics**: See detailed reports on clicks, traffic sources, and engagement levels for each link.</li>
          <li>**Custom Link Themes**: Add custom themes or styles to your personalized links to match your branding or style preferences.</li>
          <li>**Link Expiration**: Set expiration dates for temporary links, ensuring they are only accessible for a certain period.</li>
          <li>**Link Password Protection**: Add a layer of security by allowing password protection on sensitive links.</li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions (FAQ)</h2>
        <p className="text-lg leading-7 mb-4">
          Here are some common questions users have about **LinkBridger**:
        </p>
        <div className="space-y-4">
          <p className="font-semibold">Q: Can I change my username after creating an account?</p>
          <p>A: Unfortunately, usernames cannot be changed once they are set. Choose your username carefully!</p>

          <p className="font-semibold">Q: How do I track my link clicks?</p>
          <p>A: Click tracking is available through your dashboard. You can view the number of clicks for each link, and advanced analytics will be added soon.</p>

          <p className="font-semibold">Q: Can I use custom platforms other than the popular ones (Instagram, LinkedIn, etc.)?</p>
          <p>A: Yes! You can add any platform as long as you provide the correct profile URL.</p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="text-center py-6 border-t mt-12">
        <p className="text-lg">&copy; 2024 LinkBridger. All Rights Reserved.</p>
      </footer>
    </div>
    </>
  );
};

export default Documentation;
