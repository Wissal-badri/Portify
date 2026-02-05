import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Menu,
  X,
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Download,
  Star,
  Code,
  Palette,
  Smartphone,
} from "lucide-react";
import "./App.css";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  github?: string;
  live?: string;
}

interface Skill {
  name: string;
  level: number;
  category: "frontend" | "backend" | "database" | "tools";
}

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const [codeLanguage, setCodeLanguage] = useState<'en' | 'fr'>('en');

  const skills: Skill[] = [
    // Backend
    { name: "Java", level: 80, category: "backend" },
    { name: "J2EE", level: 70, category: "backend" },
    { name: "Spring Boot", level: 70, category: "backend" },
    { name: "Node.js", level: 80, category: "backend" },
    { name: "Express", level: 70, category: "backend" },

    // Frontend
    { name: "HTML", level: 90, category: "frontend" },
    { name: "CSS", level: 90, category: "frontend" },
    { name: "JavaScript", level: 80, category: "frontend" },
    { name: "React", level: 90, category: "frontend" },
    { name: "Angular", level: 85, category: "frontend" },
    { name: "TypeScript", level: 70, category: "frontend" },
    { name: "Flutter", level: 85, category: "frontend" },
    { name: "Dart", level: 85, category: "frontend" },

    // C Languages
    { name: "C", level: 75, category: "backend" },
    { name: "C++", level: 75, category: "backend" },

    // Database
    { name: "MySQL", level: 80, category: "database" },
    { name: "MongoDB", level: 70, category: "database" },

    // Other Tools
    { name: "Git", level: 85, category: "tools" },
    { name: "GitHub", level: 85, category: "tools" },
  ];

  const projects: Project[] = [
    {
      id: 1,
      title: "Portfolio Website",
      description:
        "A modern, responsive portfolio website built with React and TypeScript. Features smooth animations, interactive elements, and a professional design that showcases my skills and projects effectively.",
      technologies: ["React", "TypeScript", "CSS3"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      github: "https://github.com/Wissal-badri/portfolio",
    },
    {
      id: 2,
      title: "Product Management System",
      description:
        "A full-stack web application for managing products, built with React and Node.js/Express with a MySQL backend. Features complete CRUD operations, inventory tracking, and real-time updates.",
      technologies: ["React", "Node.js", "Express", "MySQL"],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      github: "https://github.com/Wissal-badri/Product_management",
    },
    {
      id: 3,
      title: "Gastronome",
      description:
        "A comprehensive recipe book application featuring cuisines from around the world. Organized by categories (sweet, salty, traditional) for each country, with a powerful search functionality and beautiful recipe photos. Built with modern web technologies for an exceptional culinary experience.",
      technologies: ["Flutter", "Dart"],
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
      github: "https://github.com/Wissal-badri/Gastronome",
    },
    {
      id: 4,
      title: "Weather App",
      description:
        "A dynamic weather application built with Angular and TypeScript. Provides real-time weather information with a clean, user-friendly interface. Features location-based weather data and responsive design for all devices.",
      technologies: ["Angular", "TypeScript", "CSS3"],
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80",
      github: "https://github.com/Wissal-badri/WeatherApp",
    },
    {
      id: 5,
      title: "Simple Portfolio",
      description:
        "A clean and minimalist portfolio website built with vanilla HTML, CSS, and JavaScript. Features smooth scrolling, interactive elements, and a professional layout that highlights projects and skills effectively.",
      technologies: ["Html", "Css", "Javascript"],
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
      github: "https://github.com/Wissal-badri/Simple_portfolio",
    },
    {
      id: 6,
      title: "Student Management System",
      description:
        "A comprehensive Java application for managing student records and academic data. Features include grade management, attendance tracking, and secure data storage with MySQL database. Built with Java Swing for the user interface.",
      technologies: ["Java", "MySQL"],
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
      github: "https://github.com/Wissal-badri/Student-management",
    },
  ];



  const getSkillIconUrl = (name: string) => {
    const normalized = name.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
    const iconMap: { [key: string]: string } = {
      java: "java/java-original",
      j2ee: "java/java-plain",
      springboot: "spring/spring-original",
      nodejs: "nodejs/nodejs-original",
      express: "express/express-original",
      html: "html5/html5-original",
      css: "css3/css3-original",
      javascript: "javascript/javascript-original",
      react: "react/react-original",
      angular: "angularjs/angularjs-original",
      typescript: "typescript/typescript-original",
      c: "c/c-original",
      "c++": "cplusplus/cplusplus-original",
      mysql: "mysql/mysql-original",
      mongodb: "mongodb/mongodb-original",
      git: "git/git-original",
      github: "github/github-original",
      flutter: "flutter/flutter-original",
      dart: "dart/dart-original"
    };

    if (normalized === "c++" || normalized === "cpp") return "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg";

    const path = iconMap[normalized] || "devicon/devicon-original";
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}.svg`;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    if (formRef.current) {
      emailjs
        .sendForm(
          "service_uc7y17r",
          "template_qqx1dif",
          formRef.current,
          "ux0hCy9LV_uMR-rhP"
        )
        .then((result) => {
          console.log("SUCCESS!", result.text);
          setSubmitStatus("success");
          if (formRef.current) {
            formRef.current.reset();
          }
        })
        .catch((error) => {
          console.log("FAILED...", error.text);
          setSubmitStatus("error");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "skills", "projects", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation de changement de langue pour le code preview
  useEffect(() => {
    const interval = setInterval(() => {
      setCodeLanguage((prev) => (prev === 'en' ? 'fr' : 'en'));
    }, 4000); // Change toutes les 4 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <motion.div
            className="nav-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Code className="logo-icon" />
            <span>Portfolio</span>
          </motion.div>

          <div className="nav-menu">
            {["home", "about", "skills", "projects", "contact"].map((item) => (
              <button
                key={item}
                className={`nav-link ${activeSection === item ? "active" : ""}`}
                onClick={() => scrollToSection(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          <button
            className="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {["home", "about", "skills", "projects", "contact"].map(
                (item) => (
                  <button
                    key={item}
                    className="mobile-nav-link"
                    onClick={() => scrollToSection(item)}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Hi, I'm <span className="highlight"> BADRI Wissal</span>
            </h1>
            <h2 className="hero-subtitle">Software Engineer Student</h2>
            <p className="hero-description">
              I create beautiful, functional, and user-centered digital
              experiences. Passionate about clean code and innovative solutions.
            </p>
            <div className="hero-buttons">
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/pdf/CV_Wissal.pdf";
                  link.download = "CV Wissal.pdf";
                  link.click();
                }}
              >
                <Download size={20} />
                Download CV
              </motion.button>
              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("projects")}
              >
                View My Work
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-visual-container">
              <div className="floating-elements">
                <motion.div
                  className="floating-icon"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Code size={40} />
                </motion.div>
                <motion.div
                  className="floating-icon"
                  animate={{
                    y: [0, -30, 0],
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <Palette size={35} />
                </motion.div>
                <motion.div
                  className="floating-icon"
                  animate={{
                    y: [0, -25, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                >
                  <Smartphone size={30} />
                </motion.div>
                <motion.div
                  className="floating-icon"
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, -8, 8, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <Star size={25} />
                </motion.div>
                <motion.div
                  className="floating-icon"
                  animate={{
                    y: [0, -35, 0],
                    rotate: [0, 12, -12, 0],
                  }}
                  transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                >
                  <Github size={28} />
                </motion.div>
                <motion.div
                  className="floating-icon"
                  animate={{
                    y: [0, -18, 0],
                    rotate: [0, -15, 15, 0],
                  }}
                  transition={{
                    duration: 6.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8,
                  }}
                >
                  <Linkedin size={32} />
                </motion.div>
                <motion.div
                  className="floating-icon"
                  animate={{
                    y: [0, -22, 0],
                    rotate: [0, 8, -8, 0],
                  }}
                  transition={{
                    duration: 7.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2.5,
                  }}
                >
                  <Mail size={26} />
                </motion.div>
                <motion.div
                  className="floating-icon"
                  animate={{
                    y: [0, -28, 0],
                    rotate: [0, -12, 12, 0],
                  }}
                  transition={{
                    duration: 8.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2,
                  }}
                >
                  <ExternalLink size={24} />
                </motion.div>
                <motion.div
                  className="floating-icon"
                  animate={{
                    y: [0, -12, 0],
                    rotate: [0, 6, -6, 0],
                  }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                >
                  <Download size={22} />
                </motion.div>
                <motion.div
                  className="floating-icon"
                  animate={{
                    y: [0, -40, 0],
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.8,
                  }}
                >
                  <Code size={20} />
                </motion.div>
                <motion.div
                  className="floating-icon"
                  animate={{
                    y: [0, -16, 0],
                    rotate: [0, 14, -14, 0],
                  }}
                  transition={{
                    duration: 6.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.7,
                  }}
                >
                  <Palette size={18} />
                </motion.div>
                <motion.div
                  className="floating-icon"
                  animate={{
                    y: [0, -32, 0],
                    rotate: [0, -6, 6, 0],
                  }}
                  transition={{
                    duration: 8.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2.2,
                  }}
                >
                  <Star size={16} />
                </motion.div>
              </div>
              <div className="code-preview">
                <motion.div
                  className="language-badge"
                  key={`badge-${codeLanguage}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {codeLanguage === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={codeLanguage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="code-line">
                      <span className="code-keyword">const</span> developer = {"{"}
                    </div>
                    <div className="code-line">
                      <span className="code-property">{codeLanguage === 'en' ? 'name' : 'nom'}:</span>{" "}
                      <span className="code-string">'BADRI Wissal'</span>,
                    </div>
                    <div className="code-line">
                      <span className="code-property">{codeLanguage === 'en' ? 'role' : 'rôle'}:</span>{" "}
                      <span className="code-string">
                        {codeLanguage === 'en' ? "'Software Engineer Student'" : "'Étudiante Ingénieure Logiciel'"}
                      </span>
                      ,
                    </div>

                    <div className="code-line">
                      <span className="code-property">passion:</span>{" "}
                      <span className="code-string">
                        {codeLanguage === 'en' ? "'Creating innovative solutions'" : "'Créer des solutions innovantes'"}
                      </span>
                    </div>
                    <div className="code-line">{"}"};
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <ChevronDown size={24} />
          <span>Scroll to explore</span>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>About Me</h2>
            <p>Get to know me better</p>
          </motion.div>

          <div className="about-content">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3>Passionate Software Engineering Student</h3>
              <p>
                I'm a dedicated software engineering student with a growing
                passion for creating innovative digital solutions. My journey in
                tech began with curiosity and has developed into a deep love for
                building applications that solve real-world problems.
              </p>
              <p>
                Currently pursuing my degree, I spend my time learning new
                technologies, building personal projects, and collaborating on meaningful initiatives.
                I believe in continuous learning and staying updated with the latest industry trends
                and best practices.
              </p>

              <div className="about-stats">
                <div className="stat">
                  <h4>3+</h4>
                  <p>Years Learning</p>
                </div>
                <div className="stat">
                  <h4>15+</h4>
                  <p>Projects Built</p>
                </div>
                <div className="stat">
                  <h4>100%</h4>
                  <p>Passion for Code</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="about-visual"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="tech-grid">
                <motion.div
                  className="tech-item"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Code size={60} />
                  <span>Frontend</span>
                </motion.div>
                <motion.div
                  className="tech-item"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Palette size={60} />
                  <span>Design</span>
                </motion.div>
                <motion.div
                  className="tech-item"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Smartphone size={60} />
                  <span>Mobile</span>
                </motion.div>
                <motion.div
                  className="tech-item"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Star size={60} />
                  <span>Quality</span>
                </motion.div>
              </div>
              <div className="experience-badge">
                <div className="badge-content">
                  <h4>Student</h4>
                  <p>Developer</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Skills & Expertise</h2>
            <p>Technologies I work with</p>
          </motion.div>

          <div className="skills-carousel">
            <div className="skills-track">
              {/* Duplicate skills list for infinite scroll effect */}
              {[...skills, ...skills].map((skill, index) => {
                const isExpress = skill.name === "Express";
                return (
                  <div key={`${skill.name}-${index}`} className="skill-tech-card">
                    <div className="skill-tech-logo-wrapper">
                      <img
                        src={getSkillIconUrl(skill.name)}
                        alt={skill.name}
                        className={`skill-tech-logo-img ${isExpress ? 'invert-white' : ''}`}
                      />
                    </div>
                    <div className="skill-tech-name">{skill.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Featured Projects</h2>
            <p>Some of my recent work</p>
          </motion.div>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                  <div className="project-overlay">
                    <div className="project-links">
                      {project.github && (
                        <a
                          href={project.github}
                          className="project-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-technologies">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Get In Touch</h2>
            <p>Let's work together</p>
          </motion.div>

          <div className="contact-content">
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3>Let's Start a Conversation</h3>
              <p>
                I’m always open to meaningful collaborations, innovative
                projects, and new challenges. If you’d like to connect, discuss
                an opportunity, or simply exchange ideas, feel free to get in
                touch.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <Mail size={24} />
                  <div>
                    <h4>Email</h4>
                    <p>wissalbadri91@gmail.com</p>
                  </div>
                </div>

                <div className="contact-method">
                  <Linkedin size={24} />
                  <div>
                    <h4>LinkedIn</h4>
                    <p>linkedin.com/in/Wissal Badri</p>
                  </div>
                </div>

                <div className="contact-method">
                  <Github size={24} />
                  <div>
                    <h4>GitHub</h4>
                    <p>github.com/Wissal-badri</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              className="contact-form"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="form-group">
                <input
                  type="text"
                  name="user_name"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="user_email"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  required
                ></textarea>
              </div>
              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <Code className="logo-icon" />
              <span>Wisso's Portfolio</span>
            </div>
            <p>&copy; 2025 BADRI Wissal. All rights reserved.</p>
            <div className="footer-social">
              <a
                href="https://github.com/Wissal-badri"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/wissal-badri-77099a335/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <Linkedin size={20} />
              </a>
              <a href="mailto:wissalbadri91@gmail.com" className="social-link">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Popup Modal */}
      <AnimatePresence>
        {submitStatus === "success" && (
          <motion.div
            className="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSubmitStatus("idle")}
          >
            <motion.div
              className="popup-modal success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-icon success">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
              </div>
              <h3>Message Sent Successfully!</h3>
              <p>
                Thank you for reaching out. I'll get back to you as soon as
                possible.
              </p>
              <button
                className="popup-btn"
                onClick={() => setSubmitStatus("idle")}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {submitStatus === "error" && (
          <motion.div
            className="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSubmitStatus("idle")}
          >
            <motion.div
              className="popup-modal error"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-icon error">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h3>Message Failed to Send</h3>
              <p>
                Sorry, there was an error sending your message. Please try
                again.
              </p>
              <button
                className="popup-btn"
                onClick={() => setSubmitStatus("idle")}
              >
                Try Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
