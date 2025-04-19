import React from 'react'
import { FaBookOpen, FaGraduationCap, FaTools, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa'
import { MdVerified } from 'react-icons/md'

const About = () => {
  return (
    <div className="text-gray-800">

      {/* Hero Banner */}
      <div className="relative w-full h-[300px] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1584697964189-4d2f2f6d1c4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold">About Skill Bridge</h1>
        </div>
      </div>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-semibold mb-4">Empowering Learners Everywhere</h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Skill Bridge is an innovative learning platform designed to help individuals gain real-world skills,
          explore quality education, and earn certifications that boost careers. Our mission is to bridge the
          gap between knowledge and opportunity.
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Skill Bridge?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition">
              <FaTools className="text-4xl mx-auto text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Skill Development</h3>
              <p className="text-gray-600">Learn in-demand skills through interactive, project-based courses tailored to your career goals.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition">
              <FaBookOpen className="text-4xl mx-auto text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Education</h3>
              <p className="text-gray-600">Courses curated and created by industry experts to ensure the highest standard of content.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition">
              <MdVerified className="text-4xl mx-auto text-indigo-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Certifications</h3>
              <p className="text-gray-600">Earn verified certificates that showcase your knowledge and boost your professional profile.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="py-16 px-4 text-center bg-white">
        <blockquote className="text-xl italic max-w-3xl mx-auto text-gray-700">
          “We believe that learning should be accessible, practical, and inspiring. Skill Bridge is built to give everyone a chance to thrive.”
        </blockquote>
        <p className="mt-4 text-indigo-600 font-semibold">— Iqra Abbasi, Founder of Skill Bridge</p>
      </section>

{/* Team Section */}
<section className="bg-gray-50 py-16">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-3xl font-bold mb-8">Meet Our Team</h2>
    <div className="grid gap-8 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team Member" className="w-24 h-24 mx-auto rounded-full mb-4" />
        <h3 className="font-semibold text-lg">Iqra Abbasi</h3>
        <p className="text-sm text-gray-500">AI Developer</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team Member" className="w-24 h-24 mx-auto rounded-full mb-4" />
        <h3 className="font-semibold text-lg">Shantanu Gaur</h3>
        <p className="text-sm text-gray-500">WebSocket Engineer</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Team Member" className="w-24 h-24 mx-auto rounded-full mb-4" />
        <h3 className="font-semibold text-lg">Anvesh Singh</h3>
        <p className="text-sm text-gray-500">Backend Developer</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Team Member" className="w-24 h-24 mx-auto rounded-full mb-4" />
        <h3 className="font-semibold text-lg">Bishal Kedia</h3>
        <p className="text-sm text-gray-500">Frontend Developer</p>
      </div>

    </div>
  </div>
</section>


      {/* Testimonials */}
      <section className="bg-white py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">What Learners Say</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <p className="text-gray-700 italic">"Skill Bridge helped me land my dream job in web development. The certification was a huge boost!"</p>
            <p className="mt-4 text-right font-semibold">— Bishal Kedia</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <p className="text-gray-700 italic">"The platform is intuitive, and the course content is high quality. Definitely recommended!"</p>
            <p className="mt-4 text-right font-semibold">— Ankit Das</p>
          </div>
        </div>
      </section>

      {/* Video Embed (Optional) */}
      {/* <section className="py-16 bg-gray-100 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Watch How Skill Bridge Works</h2>
        <div className="max-w-4xl mx-auto mt-6 aspect-video">
          <iframe
            className="w-full h-full rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/Z1Yd7upQsXY"
            title="Skill Bridge Intro Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section> */}

      {/* Call to Action */}
      <section className="text-center py-14 px-6 bg-white">
        <h2 className="text-3xl font-bold mb-4">Join the Skill Bridge Community</h2>
        <p className="text-gray-600 mb-6">Start learning, upskilling, and achieving your goals today.</p>
        <a href="/courses" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          Explore Courses
        </a>
      </section>
    </div>
  )
}

export default About
