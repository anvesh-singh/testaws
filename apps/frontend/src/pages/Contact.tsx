import { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import emailjs from 'emailjs-com';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  // EmailJS service information
  const SERVICE_ID = 'service_diy4tzo';  // replace with your service ID
  const TEMPLATE_ID = 'template_tc0c0rf'; // replace with your template ID
  const USER_ID = 'V7mzUKAADvWIRBJM6'; // replace with your user ID

  const handleSubmit = async (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    try {
      // Send the email using EmailJS
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
      setStatus('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="text-gray-800">
      {/* Hero Header */}
      <div className="relative w-full h-[280px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1581093588401-3a26f4efccd3?auto=format&fit=crop&w=1400&q=80)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold">Get in Touch</h1>
        </div>
      </div>

      {/* Contact Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              rows={5}
              placeholder="Your Message"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">
              Submit
            </button>
          </form>
          {status && <p className="mt-4 text-center text-lg">{status}</p>}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-6 text-lg">
          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-indigo-600 text-xl" />
            <span>123 Skill Bridge Lane, Tech City, India</span>
          </div>
          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-indigo-600 text-xl" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-indigo-600 text-xl" />
            <span>contact@skillbridge.com</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
