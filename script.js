document.addEventListener('DOMContentLoaded', () => {
  // ===== NAVBAR INITIALIZATION =====
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinksItems = document.querySelectorAll('.nav-link');

  // Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    trackActiveSection();
  });

  // Mobile Menu Toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Track active section for nav highlighting
  function trackActiveSection() {
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });

    navLinksItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  }

  // ===== NEURAL NETWORK CANVAS ANIMATION =====
  const canvas = document.getElementById('neuralCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 100;
  const maxDistance = 150;

  class Particle {
    constructor() {
      this.init();
    }
    init() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2ff';
      ctx.fill();
    }
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 242, 255, ${0.15 * (1 - distance / maxDistance)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }

  // ===== TYPING EFFECT FOR HERO =====
  function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    const text = subtitle.innerText;
    subtitle.innerText = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        subtitle.innerText += text.charAt(i);
        i++;
        setTimeout(type, 30);
      }
    }
    type();
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animateCanvas();
  initTypingEffect();

  // ===== REVEAL ON SCROLL =====
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        const bars = entry.target.querySelectorAll('.bar-fill');
        bars.forEach(bar => {
          const style = bar.getAttribute('style');
          if (style) {
            const match = style.match(/--width:\s*(\d+%)/);
            if (match) bar.style.width = match[1];
          }
        });
        const counters = entry.target.querySelectorAll('.counter');
        counters.forEach(counter => animateCounter(counter));
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // ===== COUNTER ANIMATION =====
  function animateCounter(el) {
    if (el.classList.contains('counted')) return;
    el.classList.add('counted');
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = el.getAttribute('data-decimal') === 'true';
    const duration = 2000;
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = progress * target;
      el.innerText = isDecimal ? current.toFixed(1) : Math.floor(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.innerText = isDecimal ? target.toFixed(1) : target;
      }
    }
    window.requestAnimationFrame(step);
  }

  // ===== TAB SYSTEM =====
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(`tab-${target}`);
      if (panel) panel.classList.add('active');
    });
  });

  // ===== BACK TO TOP =====
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== CHATBOT LOGIC (EMBEDDED DATA) =====
  let chatbotKnowledge = [
    {
      "keywords": ["IA", "programa de computación", "diferencia"],
      "answers": ["Un programa normal sigue una lista de instrucciones fijas (si pasa A, haz B). La IA aprende de los datos; no se le dan todas las reglas, sino que ella misma identifica patrones para tomar decisiones o generar predicciones ante situaciones nuevas."]
    },
    {
      "keywords": ["Machine Learning", "IA", "aprendizaje automático"],
      "answers": ["Es una rama de la IA que permite que las máquinas aprendan por sí solas. En lugar de escribir código para cada tarea, le das al sistema miles de ejemplos (datos) y el algoritmo mejora su precisión con el tiempo mediante la experiencia."]
    },
    {
      "keywords": ["IA", "sentimientos", "conciencia"],
      "answers": ["No. En 2026, la IA sigue siendo IA Estrecha. Aunque puede simular empatía o escribir poemas conmovedores, no tiene conciencia, emociones ni alma. Son cálculos matemáticos avanzados procesando lenguaje y probabilidades."]
    },
    {
      "keywords": ["Prompt", "IA", "importancia"],
      "answers": ["Un Prompt es la instrucción que le das a una IA como ChatGPT o Midjourney. Se ha convertido en una habilidad esencial porque la calidad de lo que la IA entrega depende directamente de qué tan clara, específica y contextual sea la orden que tú le des."]
    },
    {
      "keywords": ["IA", "trabajos", "reemplazar"],
      "answers": ["Más que reemplazarlos, los está transformando. La IA se encarga de las tareas repetitivas y el análisis de datos masivos, lo que obliga a los humanos a enfocarse en el pensamiento crítico, la creatividad y la supervisión ética de estas herramientas."]
    },
    {
      "keywords": ["IA", "alucina", "inventa", "información"],
      "answers": ["Las alucinaciones ocurren porque los modelos de lenguaje están diseñados para predecir la siguiente palabra más probable, no para verificar la verdad. Si no tienen el dato exacto, el sistema puede generar una respuesta que suena lógica pero es falsa."]
    },
    {
      "keywords": ["sesgo algorítmico", "IA", "prejuicios"],
      "answers": ["Es cuando una IA toma decisiones injustas, por ejemplo en procesos de contratación. Esto sucede porque la IA se entrena con datos históricos que ya contienen prejuicios humanos. Si los datos están mal, la IA heredará esos errores."]
    },
    {
      "keywords": ["IA Débil", "IA Fuerte", "ANI", "AGI"],
      "answers": ["La IA Débil o ANI está diseñada para una tarea específica como jugar ajedrez o traducir textos, y es la que usamos hoy. La IA Fuerte o AGI es una máquina que igualaría la inteligencia humana en cualquier área, pero todavía es teórica."]
    },
    {
      "keywords": ["IA", "medio ambiente", "consumo de energía", "IA Verde"],
      "answers": ["Entrenar y mantener grandes modelos de IA requiere una potencia de cómputo inmensa, lo que genera un alto consumo de energía y agua para enfriar los servidores. Por eso en 2026 la IA Verde o sostenible es una prioridad de desarrollo."]
    },
    {
      "keywords": ["seguridad", "datos", "IA"],
      "answers": ["Depende de la plataforma. La mayoría de las IAs utilizan tus conversaciones para seguir aprendiendo, por lo que nunca se debe compartir información sensible, financiera o privada a menos que estés en un entorno empresarial con protección de datos garantizada."]
    }
  ];

  console.log('Base de conocimientos cargada localmente:', chatbotKnowledge.length, 'entradas.');

  const chatToggle = document.getElementById('chatToggle');
  const chatClose = document.getElementById('chatClose');
  const chatWindow = document.getElementById('chatWindow');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  if (chatToggle && chatWindow && chatClose) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.add('active');
      chatToggle.style.display = 'none';
    });
    chatClose.addEventListener('click', () => {
      chatWindow.classList.remove('active');
      setTimeout(() => {
        chatToggle.style.display = 'flex';
      }, 300);
    });
  }

  function addMessage(text, side) {
    if (!chatMessages) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', side);

    const content = document.createElement('div');
    content.classList.add('message-content');
    content.textContent = text;

    const timeDiv = document.createElement('div');
    timeDiv.classList.add('message-time');
    timeDiv.textContent = time;

    msgDiv.appendChild(content);
    msgDiv.appendChild(timeDiv);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  // El manejo de respuestas se realiza dinámicamente mediante el archivo dat.json

  function handleChat() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';

    setTimeout(() => {
      // Normalizar entrada: quitar puntuación y espacios extra
      const q = text.toLowerCase()
        .replace(/[¿?¡!.,]/g, "")
        .trim();

      let matches = [];
      let maxScore = 0;

      // Buscar las mejores respuestas basadas en coincidencia de palabras clave
      chatbotKnowledge.forEach(entry => {
        let score = 0;

        // 1. Coincidencia por palabras clave (insensible a mayúsculas)
        entry.keywords.forEach(keyword => {
          const lowerKeyword = keyword.toLowerCase();
          if (q.includes(lowerKeyword)) {
            score += lowerKeyword.split(' ').length * 2;
          }
        });

        // 2. Coincidencia parcial (si la pregunta es larga) - Insensible a mayúsculas
        const qWords = q.split(' ');
        qWords.forEach(word => {
          if (word.length > 3 && entry.keywords.some(k => k.toLowerCase().includes(word))) {
            score += 0.5;
          }
        });

        if (score > 0) {
          if (score > maxScore) {
            maxScore = score;
            matches = [entry];
          } else if (score === maxScore) {
            matches.push(entry);
          }
        }
      });

      let response = "";
      if (matches.length > 0) {
        // Seleccionar una entrada aleatoria entre las mejores coincidencias
        const selectedEntry = matches[Math.floor(Math.random() * matches.length)];
        // Seleccionar una respuesta aleatoria dentro de esa entrada
        const pool = selectedEntry.answers || [selectedEntry.answer];
        response = pool[Math.floor(Math.random() * pool.length)];
      } else {
        response = "Lo siento, no tengo datos específicos sobre eso. ¿Puedes preguntarme algo sobre la definición de IA, tipos o aplicaciones?";
      }

      addMessage(response, 'bot');
    }, 800);
  }

  if (chatSend) chatSend.addEventListener('click', handleChat);
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleChat();
    });
  }

  // Initial Hero counters trigger
  setTimeout(() => {
    document.querySelectorAll('.stat-number').forEach(counter => {
      animateCounter(counter);
    });
  }, 500);
});
