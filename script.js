document.addEventListener('DOMContentLoaded', () => {
  // ===== NAVBAR INITIALIZATION =====
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinksItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    trackActiveSection();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  function trackActiveSection() {
    const sections = document.querySelectorAll('section');
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
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
    constructor() { this.init(); }
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
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
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

  // =============================================================
  //  CHATBOT — ARQUITECTURA RAG (Retrieval-Augmented Generation)
  // =============================================================
  //
  //  PASO 1 — RETRIEVER (TF-IDF en el navegador)
  //    Convierte la pregunta y los documentos en vectores TF-IDF
  //    y calcula similitud coseno para recuperar los N fragmentos
  //    más relevantes de la base de conocimientos (dat.json).
  //
  //  PASO 2 — GENERATOR (Groq API / Llama-3)
  //    Envía la pregunta + el contexto recuperado a la API de Groq
  //    y devuelve una respuesta natural, coherente y fundamentada.
  //
  // =============================================================

  // ── Configuración ──────────────────────────────────────────
  const GROQ_API_KEY = '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';
  const GROQ_MODEL   = 'llama-3.3-70b-versatile';
  const GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions';
  const TOP_K        = 3; // fragmentos a recuperar

  // ── Base de conocimientos (dat.json embebida) ───────────────
  // Cada entrada se convierte en un "documento" para el Retriever
  const knowledgeBase = [
    {
      keywords: ['IA', 'programa de computación', 'diferencia'],
      answer: 'Un programa normal sigue una lista de instrucciones fijas (si pasa A, haz B). La IA aprende de los datos; no se le dan todas las reglas, sino que ella misma identifica patrones para tomar decisiones o generar predicciones ante situaciones nuevas.'
    },
    {
      keywords: ['Machine Learning', 'aprendizaje automático', 'máquinas aprenden'],
      answer: 'Es una rama de la IA que permite que las máquinas aprendan por sí solas. En lugar de escribir código para cada tarea, le das al sistema miles de ejemplos (datos) y el algoritmo mejora su precisión con el tiempo mediante la experiencia.'
    },
    {
      keywords: ['IA', 'sentimientos', 'conciencia', 'emociones', 'alma'],
      answer: 'No. En 2026, la IA sigue siendo IA Estrecha. Aunque puede simular empatía o escribir poemas conmovedores, no tiene conciencia, emociones ni alma. Son cálculos matemáticos avanzados procesando lenguaje y probabilidades.'
    },
    {
      keywords: ['Prompt', 'importancia', 'instrucción', 'ChatGPT', 'Midjourney'],
      answer: 'Un Prompt es la instrucción que le das a una IA como ChatGPT o Midjourney. Se ha convertido en una habilidad esencial porque la calidad de lo que la IA entrega depende directamente de qué tan clara, específica y contextual sea la orden que tú le des.'
    },
    {
      keywords: ['trabajos', 'reemplazar', 'empleo', 'automatización', 'futuro laboral'],
      answer: 'Más que reemplazarlos, los está transformando. La IA se encarga de las tareas repetitivas y el análisis de datos masivos, lo que obliga a los humanos a enfocarse en el pensamiento crítico, la creatividad y la supervisión ética de estas herramientas.'
    },
    {
      keywords: ['alucina', 'inventa', 'información falsa', 'alucinaciones', 'errores'],
      answer: 'Las alucinaciones ocurren porque los modelos de lenguaje están diseñados para predecir la siguiente palabra más probable, no para verificar la verdad. Si no tienen el dato exacto, el sistema puede generar una respuesta que suena lógica pero es falsa.'
    },
    {
      keywords: ['sesgo algorítmico', 'prejuicios', 'discriminación', 'injusto', 'bias'],
      answer: 'Es cuando una IA toma decisiones injustas, por ejemplo en procesos de contratación. Esto sucede porque la IA se entrena con datos históricos que ya contienen prejuicios humanos. Si los datos están mal, la IA heredará esos errores.'
    },
    {
      keywords: ['IA Débil', 'IA Fuerte', 'ANI', 'AGI', 'Artificial General Intelligence'],
      answer: 'La IA Débil o ANI está diseñada para una tarea específica como jugar ajedrez o traducir textos, y es la que usamos hoy. La IA Fuerte o AGI es una máquina que igualaría la inteligencia humana en cualquier área, pero todavía es teórica.'
    },
    {
      keywords: ['medio ambiente', 'energía', 'sostenible', 'IA Verde', 'consumo energético'],
      answer: 'Entrenar y mantener grandes modelos de IA requiere una potencia de cómputo inmensa, lo que genera un alto consumo de energía y agua para enfriar los servidores. Por eso en 2026 la IA Verde o sostenible es una prioridad de desarrollo.'
    },
    {
      keywords: ['seguridad', 'datos', 'privacidad', 'información sensible', 'compartir'],
      answer: 'Depende de la plataforma. La mayoría de las IAs utilizan tus conversaciones para seguir aprendiendo, por lo que nunca se debe compartir información sensible, financiera o privada a menos que estés en un entorno empresarial con protección de datos garantizada.'
    }
  ];

  // Construir corpus de texto para cada documento
  const corpus = knowledgeBase.map(entry =>
    (entry.keywords.join(' ') + ' ' + entry.answer).toLowerCase()
  );

  // ── MÓDULO 1: RETRIEVER (TF-IDF + Cosine Similarity) ───────

  function tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[¿?¡!.,;:()\-"']/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);
  }

  function buildTFIDF(docs) {
    const N = docs.length;
    const tfList = [];
    const df = {};

    // Calcular TF de cada documento
    for (const doc of docs) {
      const tokens = tokenize(doc);
      const tf = {};
      const total = tokens.length || 1;
      for (const tok of tokens) {
        tf[tok] = (tf[tok] || 0) + 1;
      }
      // Normalizar por longitud del documento
      for (const tok in tf) tf[tok] /= total;
      tfList.push(tf);
      // Acumular DF
      for (const tok in tf) df[tok] = (df[tok] || 0) + 1;
    }

    // Calcular IDF con suavizado
    const idf = {};
    for (const tok in df) {
      idf[tok] = Math.log((N + 1) / (df[tok] + 1)) + 1;
    }

    // Construir vectores TF-IDF finales
    const vectors = tfList.map(tf => {
      const vec = {};
      for (const tok in tf) vec[tok] = tf[tok] * (idf[tok] || 1);
      return vec;
    });

    return { vectors, idf };
  }

  function vectorizeQuery(query, idf) {
    const tokens = tokenize(query);
    if (!tokens.length) return {};
    const tf = {};
    for (const tok of tokens) tf[tok] = (tf[tok] || 0) + 1;
    const total = tokens.length;
    const vec = {};
    for (const tok in tf) {
      vec[tok] = (tf[tok] / total) * (idf[tok] || 1.0);
    }
    return vec;
  }

  function cosineSimilarity(v1, v2) {
    const common = Object.keys(v1).filter(k => k in v2);
    if (!common.length) return 0;
    const dot  = common.reduce((s, k) => s + v1[k] * v2[k], 0);
    const mag1 = Math.sqrt(Object.values(v1).reduce((s, x) => s + x * x, 0));
    const mag2 = Math.sqrt(Object.values(v2).reduce((s, x) => s + x * x, 0));
    return (mag1 && mag2) ? dot / (mag1 * mag2) : 0;
  }

  // Pre-indexar el corpus
  const { vectors: docVectors, idf } = buildTFIDF(corpus);

  function retrieve(question, topK = TOP_K) {
    const qVec = vectorizeQuery(question, idf);
    const scored = docVectors.map((vec, idx) => ({
      score: cosineSimilarity(qVec, vec),
      idx
    }));
    scored.sort((a, b) => b.score - a.score);

    const results = [];
    for (const { score, idx } of scored.slice(0, topK)) {
      if (score > 0) results.push(knowledgeBase[idx].answer);
    }
    return results;
  }

  // ── MÓDULO 2: GENERATOR (Groq API / Llama-3) ───────────────

  async function generate(question, contextChunks) {
    const contextStr = contextChunks.length
      ? contextChunks.map((c, i) => `[Fragmento ${i + 1}]: ${c}`).join('\n\n')
      : 'No se encontró información específica en la base de conocimientos.';

    const systemPrompt =
      'Eres un asistente experto en Inteligencia Artificial llamado AI//ASSISTANT_V2, ' +
      'parte del sistema IA Universe. Respondes usando ÚNICAMENTE la información del contexto proporcionado. ' +
      'Si el contexto no tiene información suficiente, dilo honestamente. ' +
      'Responde siempre en español, de forma clara, concisa y conversacional.';

    const userPrompt =
      `Contexto recuperado de la base de conocimientos:\n${contextStr}\n\n` +
      `Pregunta del usuario: ${question}\n\n` +
      'Responde de forma natural y conversacional basándote en el contexto.';

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model:       GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt   }
        ],
        max_tokens:  512,
        temperature: 0.4
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Groq API error ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  // ── UI del chatbot ─────────────────────────────────────────

  const chatToggle   = document.getElementById('chatToggle');
  const chatClose    = document.getElementById('chatClose');
  const chatWindow   = document.getElementById('chatWindow');
  const chatInput    = document.getElementById('chatInput');
  const chatSend     = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  if (chatToggle && chatWindow && chatClose) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.add('active');
      chatToggle.style.display = 'none';
    });
    chatClose.addEventListener('click', () => {
      chatWindow.classList.remove('active');
      setTimeout(() => { chatToggle.style.display = 'flex'; }, 300);
    });
  }

  function addMessage(text, side, sourcesCount = 0) {
    if (!chatMessages) return;
    const time   = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', side);

    const content = document.createElement('div');
    content.classList.add('message-content');
    content.textContent = text;
    msgDiv.appendChild(content);

    // Insignia RAG visible en los mensajes del bot
    if (side === 'bot' && sourcesCount > 0) {
      const badge = document.createElement('div');
      badge.classList.add('rag-badge');
      badge.title = `RAG: ${sourcesCount} fragmento(s) recuperado(s) de la base de conocimientos`;
      badge.innerHTML = `<span class="rag-icon">⬡</span> RAG · ${sourcesCount} fuente${sourcesCount > 1 ? 's' : ''}`;
      msgDiv.appendChild(badge);
    }

    const timeDiv = document.createElement('div');
    timeDiv.classList.add('message-time');
    timeDiv.textContent = time;
    msgDiv.appendChild(timeDiv);

    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
  }

  function showTyping() {
    if (!chatMessages) return null;
    const el = document.createElement('div');
    el.classList.add('message', 'bot', 'typing-indicator');
    el.innerHTML = `
      <div class="message-content typing-dots">
        <span></span><span></span><span></span>
      </div>
      <div class="rag-status">⬡ RETRIEVER → calculando similitud TF-IDF...</div>`;
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return el;
  }

  function updateStatus(el, text) {
    if (!el) return;
    const s = el.querySelector('.rag-status');
    if (s) s.textContent = text;
  }

  // ── Pipeline RAG completo ───────────────────────────────────

  async function handleChat() {
    if (!chatInput) return;
    const question = chatInput.value.trim();
    if (!question) return;

    addMessage(question, 'user');
    chatInput.value = '';
    chatSend.disabled = true;

    const typingEl = showTyping();

    try {
      // ── PASO 1: RETRIEVER ──────────────────────────────────
      // TF-IDF corre en el navegador sobre la base embebida
      updateStatus(typingEl, '⬡ RETRIEVER → analizando pregunta con TF-IDF...');
      await new Promise(r => setTimeout(r, 300)); // breve pausa visual

      const chunks = retrieve(question, TOP_K);
      console.log(`[RAG] Retriever: ${chunks.length} fragmento(s) recuperado(s)`);
      chunks.forEach((c, i) => console.log(`  [${i+1}] ${c.slice(0, 80)}...`));

      // ── PASO 2: GENERATOR ──────────────────────────────────
      // Llama a Groq con la pregunta + contexto recuperado
      updateStatus(typingEl, `🤖 GENERATOR → Groq/Llama-3 sintetizando respuesta...`);

      const answer = await generate(question, chunks);
      typingEl.remove();

      addMessage(answer, 'bot', chunks.length);

    } catch (err) {
      typingEl?.remove();
      console.error('[RAG] Error:', err);
      addMessage(
        `⚠️ Error al conectar con Groq: ${err.message}. Verifica tu conexión a internet.`,
        'bot'
      );
    } finally {
      chatSend.disabled = false;
      chatInput.focus();
    }
  }

  if (chatSend)  chatSend.addEventListener('click', handleChat);
  if (chatInput) chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') handleChat();
  });

  // Initial Hero counters
  setTimeout(() => {
    document.querySelectorAll('.stat-number').forEach(counter => animateCounter(counter));
  }, 500);
});
