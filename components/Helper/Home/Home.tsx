import React from "react";
import Hero from "./Hero/Hero";
import About from "./About/About";
import Skills from "./Skills/Skills";
import Experience from "./Experience/Experience";
import Contact from "./Contact/Contact";
import FeedbackForm from "./Feedback/Feedback";

const Home = () =>{
    return(
        <div id="1" className="overflow-hidden">
            <Hero />
            <About />
            <Experience />
            <Skills />
            <Contact />
            <FeedbackForm />
        </div>

    )
}
export default Home;