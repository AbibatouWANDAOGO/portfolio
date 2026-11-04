// Toutes tes infos personnelles sont ici : modifie ce fichier, le site se met à jour.
// Les infos communes sont dans `profile`, les textes sont dans `fr` (français) et `en` (anglais) plus bas.
export const profile = {
  firstName: 'Abibatou',
  lastName: 'WANDAOGO',
  // Mets ta photo dans public/ (ex. public/photo.jpg) puis indique 'photo.jpg'. Laisse '' pour afficher tes initiales.
  photo: '',
  // Mets ton CV dans public/ (ex. public/cv.pdf) puis indique 'cv.pdf'. Laisse '' pour masquer le bouton.
  cv: '',
  contact: {
    email: 'wabibatou6@gmail.com',
    linkedin: 'https://www.linkedin.com/in/abibatou-wandaogo-87154131a',
    github: 'https://github.com/AbibatouWANDAOGO',
  },
};

const bnpTools = ['Power BI', 'SQL', 'Oracle', 'FIX Protocol', 'Execution Quality / TCA', 'Algorithmic Trading'];

// ───────────────────────────── FRANÇAIS ─────────────────────────────
const fr = {
  role: 'Apprentie Listed Derivatives Analyst · BNP Paribas CIB × ESIEE Paris',
  // Un paragraphe par élément de la liste
  intro: [
    "Étudiante ingénieure en Data & Applications à l'ESIEE Paris et Listed Derivatives Analyst en apprentissage chez BNP Paribas CIB.",
    "J'aime comprendre, explorer et donner du sens aux données. Ce qui m'intéresse particulièrement, c'est de passer " +
      "d'une donnée brute à une information exploitable, d'une problématique à une solution, et d'une analyse à une " +
      'véritable aide à la décision.',
    'Entre data analytics, intelligence artificielle et innovation technologique, je construis progressivement mon ' +
      "expertise avec une conviction : la donnée prend toute sa valeur lorsqu'elle permet d'agir.",
  ],
  // Chiffres / faits clés affichés sous la présentation
  highlights: [
    { value: 'BNP Paribas CIB', label: 'Listed Derivatives Analyst en apprentissage' },
    { value: 'ESIEE Paris', label: 'Cycle ingénieur Data & Applications' },
    { value: 'Major de promo', label: 'Bac S, mention Bien' },
  ],

  // logo : fichier dans public/ (laisse '' pour afficher les initiales de l'entreprise)
  experiences: [
    {
      title: 'Listed Derivatives Analyst – Execution',
      company: 'BNP Paribas CIB',
      logo: 'logos/bnp-paribas.svg',
      subtitle: 'Alternance · DEC Execution IT Business Analyst',
      period: '01/2025 – aujourd’hui',
      location: 'Montreuil',
      introTitle: 'Présentation de l’équipe',
      intro:
        'Au sein des équipes DEC Execution IT Business Analyst, contribution au suivi et à l’amélioration des systèmes ' +
        'et processus d’exécution électronique sur les marchés de dérivés listés, en collaboration avec les équipes ' +
        'métier, Operations et IT.',
      missions: [
        {
          title: 'Mission 1 — FIX Allocation Analytics & Power BI Reporting',
          points: [
            'Amélioration d’un dashboard Power BI existant dédié au suivi des flux FIX et FILE Allocation.',
            'Extraction et analyse de données issues d’une base Oracle à l’aide de requêtes SQL.',
            'Création d’une vue SQL centralisée pour alimenter le dashboard et harmoniser l’exploitation des données.',
            'Développement et amélioration de KPI pour suivre les volumes d’allocation, les messages FIX, les rejets et les Processing Times.',
            'Analyse des flux selon plusieurs dimensions : client, marché, Allocation Method, statut et période.',
            'Amélioration de la visibilité sur les anomalies, les tendances d’activité et les délais de traitement afin de faciliter le suivi opérationnel.',
          ],
        },
        {
          title: 'Mission 2 — Algorithmic Trading & Execution Quality',
          points: [
            'Approfondissement de la compréhension des mécanismes d’exécution des ordres sur les marchés de Listed Derivatives.',
            'Étude des KPI d’Execution Quality, des benchmarks, des Transaction Costs et des écarts entre prix d’exécution et prix de référence, exprimés en basis points (bps).',
            'Analyse des facteurs susceptibles d’influencer la qualité d’exécution : algorithme utilisé, marché, taille des ordres et conditions d’exécution.',
            'Contribution au suivi de l’activité d’Algorithmic Trading à travers les outils et dashboards de l’équipe.',
            'Développement des connaissances sur le FIX Protocol, la connectivité entre Trading Systems, l’intégration des algorithmes et les Functional Tests.',
          ],
        },
      ],
      tools: bnpTools,
    },
    {
      title: 'Vendeuse',
      company: 'Restaurant familial',
      logo: '',
      subtitle: 'Emploi',
      period: '06/2019 – 08/2022',
      location: 'Abidjan, Côte d’Ivoire',
      introTitle: '',
      intro:
        'Participation active à la gestion du restaurant familial : accueil et service des clients avec le souci de ' +
        'leur satisfaction, aide à la prise de commandes et coordination du service pour un fonctionnement fluide.',
      missions: [],
      tools: [],
    },
  ],

  education: [
    {
      title: 'Cycle ingénieur — Data & Applications (en apprentissage)',
      school: 'ESIEE Paris — Université Gustave Eiffel',
      period: '09/2024 – aujourd’hui',
      details:
        'Statistiques, optimisation, bases de données relationnelles, machine learning, deep learning, cybersécurité, ' +
        'management de projet, fouille de données avec R, Python pour la data science, algorithmes et graphes.',
    },
    {
      title: 'Classe préparatoire MPSI – MP*',
      school: 'ESTEM Casablanca, Maroc',
      period: '09/2022 – 06/2024',
      details: "Mathématiques, Python, SQL, probabilités. Admission en école d'ingénieur.",
    },
    {
      title: 'Baccalauréat scientifique — mention Bien, major de promotion',
      school: 'Lycée Moderne Port-Bouët, Abidjan',
      period: '09/2019 – 07/2022',
      details: '',
    },
  ],

  associations: [
    {
      name: 'Club Polymie — ESIEE Paris',
      role: 'Membre',
      description: 'Séances de débat pour développer ma prise de parole en public et mon argumentation.',
    },
    {
      name: 'Miss Mathématique 2022',
      role: 'Participante',
      description: 'Concours régional de mathématiques de Port-Bouët (Côte d’Ivoire).',
    },
    {
      name: 'Formation Python (association)',
      role: 'Participante',
      description: 'Initiation aux outils informatiques et à la programmation en Python.',
    },
  ],

  certifications: [
    { name: "Les fondements de l'IA", issuer: 'Madjid Khichane, PhD en IA — LinkedIn Learning' },
    { name: "L'essentiel de Power BI", issuer: 'André Meyer-Roussilhon — LinkedIn Learning' },
    { name: 'Tableaux de bord sur Excel', issuer: 'Martial Auroy — LinkedIn Learning' },
    { name: 'Pandas for data science', issuer: 'LinkedIn Learning' },
  ],

  skills: [
    { group: 'Langages', items: ['Python', 'SQL', 'C', 'R'] },
    { group: 'Data & BI', items: ['Power BI', 'Power Query', 'DAX', 'Excel / VBA', 'SAS', 'Dataiku', 'Salesforce'] },
    { group: 'Data science & IA', items: ['Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'TensorFlow', 'Keras'] },
    { group: 'Outils', items: ['Jupyter', 'Git & GitHub', 'VS Code', 'Linux', 'SQLite', 'PowerPoint', 'Canva'] },
    {
      group: 'Savoir-être',
      items: ['Rigueur', 'Autonomie', "Esprit d'équipe", 'Curiosité', 'Écoute', 'Adaptabilité', 'Analyse & synthèse', 'Organisation'],
    },
  ],

  languages: ['Français (natif)', 'Anglais (B2)'],
  interests: ['Cuisine', 'Dessin', 'Apprendre'],
};

// ───────────────────────────── ENGLISH ─────────────────────────────
const en: typeof fr = {
  role: 'Listed Derivatives Analyst Apprentice · BNP Paribas CIB × ESIEE Paris',
  intro: [
    'Engineering student in Data & Applications at ESIEE Paris and Listed Derivatives Analyst apprentice at BNP Paribas CIB.',
    'I enjoy understanding, exploring and making sense of data. What drives me most is turning raw data into ' +
      'actionable insight, a problem into a solution, and an analysis into genuine decision support.',
    'Working at the intersection of data analytics, artificial intelligence and technological innovation, I am steadily ' +
      'building my expertise around one core belief: data delivers its full value when it drives action.',
  ],
  highlights: [
    { value: 'BNP Paribas CIB', label: 'Listed Derivatives Analyst Apprentice' },
    { value: 'ESIEE Paris', label: "Master's in Engineering, Data & Applications" },
    { value: 'Ranked 1st in class', label: 'French Scientific Baccalaureate, with honors' },
  ],

  experiences: [
    {
      title: 'Listed Derivatives Analyst – Execution',
      company: 'BNP Paribas CIB',
      logo: 'logos/bnp-paribas.svg',
      subtitle: 'Apprenticeship · DEC Execution IT Business Analysis',
      period: 'Jan 2025 – Present',
      location: 'Montreuil, France',
      introTitle: 'Team overview',
      intro:
        'As part of the DEC Execution IT Business Analysis team, I support the monitoring and continuous improvement of ' +
        'electronic execution systems and processes for listed derivatives, working in close partnership with ' +
        'Front Office, Operations and IT stakeholders.',
      missions: [
        {
          title: 'Project 1 — FIX Allocation Analytics & Power BI Reporting',
          points: [
            'Enhanced an existing Power BI dashboard used to monitor FIX and file-based allocation flows.',
            'Extracted and analyzed data from an Oracle database using SQL.',
            'Designed a centralized SQL view to feed the dashboard and standardize data consumption across reports.',
            'Developed and refined KPIs tracking allocation volumes, FIX message activity, rejections and processing times.',
            'Analyzed flows across multiple dimensions, including client, market, allocation method, status and time period.',
            'Increased visibility into anomalies, activity trends and processing delays, streamlining day-to-day operational monitoring.',
          ],
        },
        {
          title: 'Project 2 — Algorithmic Trading & Execution Quality',
          points: [
            'Built in-depth knowledge of order execution mechanics on listed derivatives markets.',
            'Studied execution quality KPIs, benchmarks and transaction costs, including slippage between execution and reference prices measured in basis points (bps).',
            'Analyzed the key drivers of execution quality: choice of algorithm, venue, order size and market conditions.',
            "Contributed to monitoring algorithmic trading activity using the team's tools and dashboards.",
            'Developed working knowledge of the FIX Protocol, trading system connectivity, algorithm integration and functional testing.',
          ],
        },
      ],
      tools: bnpTools,
    },
    {
      title: 'Sales Associate',
      company: 'Family-owned restaurant',
      logo: '',
      subtitle: 'Part-time position',
      period: 'Jun 2019 – Aug 2022',
      location: 'Abidjan, Côte d’Ivoire',
      introTitle: '',
      intro:
        'Played an active role in the day-to-day running of the family restaurant: welcomed and served customers with a ' +
        'strong focus on satisfaction, took orders and helped coordinate service to ensure smooth operations.',
      missions: [],
      tools: [],
    },
  ],

  education: [
    {
      title: "Master's-level Engineering Degree — Data & Applications (work-study program)",
      school: 'ESIEE Paris — Gustave Eiffel University',
      period: 'Sep 2024 – Present',
      details:
        'Relevant coursework: statistics, optimization, relational databases, machine learning, deep learning, ' +
        'cybersecurity, project management, data mining with R, Python for data science, algorithms and graph theory.',
    },
    {
      title: 'Classes Préparatoires (MPSI – MP*), intensive undergraduate program in mathematics and physics',
      school: 'ESTEM Casablanca, Morocco',
      period: 'Sep 2022 – Jun 2024',
      details:
        'Two-year program preparing for the competitive entrance exams to French engineering schools. ' +
        'Mathematics, Python, SQL and probability.',
    },
    {
      title: 'French Scientific Baccalaureate — with honors, ranked 1st in class',
      school: 'Lycée Moderne Port-Bouët, Abidjan',
      period: 'Sep 2019 – Jul 2022',
      details: '',
    },
  ],

  associations: [
    {
      name: 'Polymie Debate Club — ESIEE Paris',
      role: 'Member',
      description: 'Regular debate sessions to sharpen my public speaking and persuasive communication skills.',
    },
    {
      name: 'Miss Mathématique 2022',
      role: 'Contestant',
      description: 'Regional mathematics competition held in Port-Bouët, Côte d’Ivoire.',
    },
    {
      name: 'Python Programming Workshop (non-profit)',
      role: 'Participant',
      description: 'Introductory training in core computing tools and Python programming.',
    },
  ],

  certifications: [
    { name: 'Foundations of Artificial Intelligence', issuer: 'Madjid Khichane, PhD in AI — LinkedIn Learning' },
    { name: 'Power BI Essential Training', issuer: 'André Meyer-Roussilhon — LinkedIn Learning' },
    { name: 'Building Dashboards in Excel', issuer: 'Martial Auroy — LinkedIn Learning' },
    { name: 'Pandas for Data Science', issuer: 'LinkedIn Learning' },
  ],

  skills: [
    { group: 'Programming', items: ['Python', 'SQL', 'C', 'R'] },
    { group: 'Data & BI', items: ['Power BI', 'Power Query', 'DAX', 'Excel / VBA', 'SAS', 'Dataiku', 'Salesforce'] },
    { group: 'Data Science & AI', items: ['Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'TensorFlow', 'Keras'] },
    { group: 'Tools', items: ['Jupyter', 'Git & GitHub', 'VS Code', 'Linux', 'SQLite', 'PowerPoint', 'Canva'] },
    {
      group: 'Soft skills',
      items: ['Attention to detail', 'Self-motivated', 'Team player', 'Intellectual curiosity', 'Active listening', 'Adaptability', 'Analytical thinking', 'Organizational skills'],
    },
  ],

  languages: ['French (native)', 'English (upper intermediate, B2)'],
  interests: ['Cooking', 'Drawing', 'Continuous learning'],
};

export const content = { fr, en };
