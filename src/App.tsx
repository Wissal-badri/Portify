import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  Download,
  Star,
  Code,
  Palette,
  Smartphone,
  Zap,
  Sparkles,
  ArrowRight,
  Award,
  ExternalLink,
} from "lucide-react";
import "./App.css";
import Iridescence from "./Iridescence";
import TargetCursor from "./TargetCursor";
import {
  calculateGitHubStats,
  GitHubStats as GitHubStatsType
} from "./services/githubService";

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  github?: string;
  live?: string;
}

interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
  pdfPath: string;
  image: string;
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
  const [githubStats, setGithubStats] = useState<GitHubStatsType | null>(null);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

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
      title: "Gastronome",
      description:
        "A comprehensive recipe book application featuring cuisines from around the world. Organized by categories (sweet, salty, traditional) for each country, with a powerful search functionality and beautiful recipe photos. Built with modern web technologies for an exceptional culinary experience.",
      technologies: ["Flutter", "Dart"],
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
      github: "https://github.com/Wissal-badri/Gastronome",
    },
    {
      id: 2,
      title: "Royal Note",
      description:
        "Royal Notes - The Registry of Thoughts. A luxurious mobile note-taking application designed to treat your thoughts with dignity. Features elegant design, robust MySQL database for permanent storage, and a premium user experience that makes every note feel special.",
      technologies: ["Flutter", "Dart", "MySQL"],
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80",
      github: "https://github.com/Wissal-badri/Royal-Note",
    },
    {
      id: 3,
      title: "Portfolio Website",
      description:
        "A modern, responsive portfolio website built with React and TypeScript. Features smooth animations, interactive elements, and a professional design that showcases my skills and projects effectively.",
      technologies: ["React", "TypeScript", "CSS3"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      github: "https://github.com/Wissal-badri/portfolio",
    },
    {
      id: 4,
      title: "Product Management System",
      description:
        "A full-stack web application for managing products, built with React and Node.js/Express with a MySQL backend. Features complete CRUD operations, inventory tracking, and real-time updates.",
      technologies: ["React", "Node.js", "Express", "MySQL"],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      github: "https://github.com/Wissal-badri/Product_management",
    },
    {
      id: 5,
      title: "Weather App",
      description:
        "A dynamic weather application built with Angular and TypeScript. Provides real-time weather information with a clean, user-friendly interface. Features location-based weather data and responsive design for all devices.",
      technologies: ["Angular", "TypeScript", "CSS3"],
      image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80",
      github: "https://github.com/Wissal-badri/WeatherApp",
    },
    {
      id: 6,
      title: "Simple Portfolio",
      description:
        "A clean and minimalist portfolio website built with vanilla HTML, CSS, and JavaScript. Features smooth scrolling, interactive elements, and a professional layout that highlights projects and skills effectively.",
      technologies: ["Html", "Css", "Javascript"],
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80",
      github: "https://github.com/Wissal-badri/Simple_portfolio",
    },
    {
      id: 7,
      title: "Student Management System",
      description:
        "A comprehensive Java application for managing student records and academic data. Features include grade management, attendance tracking, and secure data storage with MySQL database. Built with Java Swing for the user interface.",
      technologies: ["Java", "MySQL"],
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
      github: "https://github.com/Wissal-badri/Student-management",
    },
  ];

  const certifications: Certification[] = [
    {
      id: 1,
      title: "Python Programming Certification",
      issuer: "Orange Digital Center",
      date: "2026",
      description: "Python training covering core programming concepts such as syntax, variables, loops, and conditional statements. Hands-on learning with practical exercises designed to build a solid foundation in Python programming.",
      pdfPath: "/Certifications/Wissal_Badri_certificate.pdf", // Placeholder
      image: "/assets/orangePython.png",
    },
    {
      id: 2,
      title: "HTML & CSS Certification",
      issuer: "Udemy / Online Course",
      date: "2025",
      description: "Mastery of web fundamentals including semantic HTML5, modern CSS3, Flexbox, Grid, and responsive design principles.",
      pdfPath: "/Certifications/CERTIF HTML CSS.pdf",
      image: "/assets/udemy.png",
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

  const getTechIcon = (tech: string) => {
    const t = tech.toLowerCase();
    if (t.includes('react')) return <Code size={12} />;
    if (t.includes('typescript')) return <Code size={12} />;
    if (t.includes('js') || t.includes('javascript')) return <Code size={12} />;
    if (t.includes('node') || t.includes('express')) return <Zap size={12} />;
    if (t.includes('flutter')) return <Smartphone size={12} />;
    if (t.includes('sql') || t.includes('db') || t.includes('mysql') || t.includes('mongodb')) return <Smartphone size={12} />;
    if (t.includes('html') || t.includes('css')) return <Palette size={12} />;
    if (t.includes('java') || t.includes('spring') || t.includes('j2ee')) return <Code size={12} />;
    if (t.includes('angular')) return <Code size={12} />;
    if (t.includes('dart')) return <Code size={12} />;
    if (t.includes('git') || t.includes('github')) return <Github size={12} />;
    return <Sparkles size={12} />;
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

  // Load GitHub data on component mount
  useEffect(() => {
    const loadGitHubData = async () => {
      try {
        setIsLoadingGitHub(true);

        // Fetch only stats (not repos)
        const stats = await calculateGitHubStats();
        console.log('✅ GitHub Stats loaded:', stats);
        setGithubStats(stats);


      } catch (error) {
        console.error('Error loading GitHub data:', error);
      } finally {
        setIsLoadingGitHub(false);
      }
    };

    loadGitHubData();
  }, []);

  // Hide scroll indicator after scrolling
  useEffect(() => {
    const handleScrollIndicator = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScrollIndicator);
    return () => window.removeEventListener("scroll", handleScrollIndicator);
  }, []);



  return (
    <div className="App">
      {/* Custom Target Cursor */}
      <TargetCursor
        spinDuration={1.5}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.3}
      />

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <motion.div
            className="nav-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="logo-wrapper">
              <Zap className="logo-icon" />
              <div className="logo-text">
                <span className="logo-monogram">BW</span>
                <span className="logo-full-name">BADRI Wissal</span>
              </div>
            </div>
          </motion.div>

          <div className="nav-menu">
            {["home", "about", "skills", "projects", "certifications", "contact"].map((item) => (
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
              {["home", "about", "skills", "projects", "certifications", "contact"].map(
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
        {/* Iridescence Background Effect */}
        <Iridescence
          color={[0, 1, 1]}
          speed={0.5}
          amplitude={0.15}
          mouseReact={true}
        />
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
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 255, 255, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/pdf/WissalBadriResumee.pdf";
                  link.download = "WissalBadriResumee.pdf";
                  link.click();
                }}
              >
                <Download size={20} />
                Download CV
              </motion.button>
              <motion.button
                className="btn btn-secondary"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("projects")}
              >
                View My Work
                <ArrowRight size={20} className="btn-icon-right" />
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
                <div className="floating-particle"></div>
                <div className="floating-particle"></div>
                <div className="floating-particle"></div>
                <div className="floating-particle"></div>
                <div className="floating-particle"></div>
                <div className="floating-particle"></div>
              </div>
              <div className="code-preview">


                <div className="code-line">
                  <span className="code-keyword">const</span> developer = {"{"}
                </div>
                <div className="code-line">
                  <span className="code-property">name:</span>{" "}
                  <span className="code-string">'BADRI Wissal'</span>,
                </div>
                <div className="code-line">
                  <span className="code-property">role:</span>{" "}
                  <span className="code-string">'Software Engineer Student'</span>,
                </div>

                <div className="code-line">
                  <span className="code-property">passion:</span>{" "}
                  <span className="code-string">'Creating innovative solutions'</span>
                </div>
                <div className="code-line">{"}"};
                </div>

              </div>
            </div>
          </motion.div>
        </div>

        {showScrollIndicator && (
          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 1, duration: 1, ease: "easeOut" }}
            onClick={() => scrollToSection("about")}
          >
            <div className="mouse-icon">
              <div className="mouse-wheel"></div>
            </div>
            <span className="scroll-text">Scroll to explore</span>
          </motion.div>
        )}
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
                <motion.div
                  className="stat"
                  whileHover={{ y: -5, backgroundColor: "rgba(0, 255, 255, 0.05)" }}
                >
                  <Code size={24} className="stat-icon" />
                  <h4>4+</h4>
                  <p>Years Learning</p>
                </motion.div>
                <motion.div
                  className="stat"
                  whileHover={{ y: -5, backgroundColor: "rgba(0, 255, 255, 0.05)" }}
                >
                  <Zap size={24} className="stat-icon" />
                  <h4>{isLoadingGitHub ? '...' : (githubStats?.totalRepos ? `${githubStats.totalRepos}+` : '28+')}</h4>
                  <p>Projects Built</p>
                </motion.div>
                <motion.div
                  className="stat"
                  whileHover={{ y: -5, backgroundColor: "rgba(0, 255, 255, 0.05)" }}
                >
                  <Star size={24} className="stat-icon" />
                  <h4>100%</h4>
                  <p>Passion for Code</p>
                </motion.div>
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
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
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
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
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
                        {getTechIcon(tech)}
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

      {/* Certifications Section */}
      <section id="certifications" className="certifications">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2>Certifications</h2>
            <p>Recognition of my skills & continuous learning</p>
          </motion.div>

          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                className="certification-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="cert-image-container">
                  <img src={cert.image} alt={cert.title} />
                  <div className="cert-overlay">
                    <a
                      href={cert.pdfPath}
                      className="view-cert-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={20} />
                      View Certificate
                    </a>
                  </div>
                </div>
                <div className="cert-content">
                  <div className="cert-header">
                    <Award className="cert-icon" size={24} />
                    <span className="cert-date">{cert.date}</span>
                  </div>
                  <h3>{cert.title}</h3>
                  <p className="cert-issuer">{cert.issuer}</p>
                  <p className="cert-description">{cert.description}</p>
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

      {/* FooterSection */}
      <footer className="footer">
        <div className="footer-text">
          &copy; {new Date().getFullYear()} <span className="highlight">BADRI Wissal</span> • Built with Passion
        </div>
        <div className="footer-socials">
          <a href="https://github.com/Wissal-badri" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/wissal-badri-77099a335/" target="_blank" rel="noopener noreferrer" className="footer-social-link">
            <Linkedin size={20} />
          </a>
          <a href="mailto:wissalbadri91@gmail.com" className="footer-social-link">
            <Mail size={20} />
          </a>
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
