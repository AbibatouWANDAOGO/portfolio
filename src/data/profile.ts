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
  role: 'Ingénieure apprentie Data · BNP Paribas CIB × ESIEE Paris',
  intro:
    "Passionnée par la data science et l'innovation en IA, je suis Data Analyst en apprentissage chez BNP Paribas CIB " +
    "tout en suivant le cycle ingénieur Data & Applications à l'ESIEE Paris. J'aime partir de données brutes pour " +
    'en tirer des analyses, des modèles et des tableaux de bord qui aident à décider.',
  // Chiffres / faits clés affichés sous la présentation
  highlights: [
    { value: 'BNP Paribas CIB', label: 'Data Analyst en apprentissage' },
    { value: 'ESIEE Paris', label: 'Cycle ingénieur Data & Applications' },
    { value: 'Major de promo', label: 'Bac S, mention Bien' },
  ],

  // logo : fichier dans public/ (laisse '' pour afficher les initiales de l'entreprise)
  experiences: [
    {
      title: 'Data Analyst – Listed Derivatives Execution',
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
  role: 'Data engineering apprentice · BNP Paribas CIB × ESIEE Paris',
  intro:
    "Passionate about data science and AI innovation, I'm a Data Analyst apprentice at BNP Paribas CIB while " +
    "completing the Data & Applications engineering programme at ESIEE Paris. I enjoy starting from raw data and " +
    'turning it into analyses, models and dashboards that support decision-making.',
  highlights: [
    { value: 'BNP Paribas CIB', label: 'Data Analyst apprentice' },
    { value: 'ESIEE Paris', label: 'Data & Applications engineering degree' },
    { value: 'Top of my class', label: 'Scientific Baccalaureate, with honours' },
  ],

  experiences: [
    {
      title: 'Data Analyst – Listed Derivatives Execution',
      company: 'BNP Paribas CIB',
      logo: 'logos/bnp-paribas.svg',
      subtitle: 'Apprenticeship · DEC Execution IT Business Analyst',
      period: '01/2025 – present',
      location: 'Montreuil, France',
      introTitle: 'About the team',
      intro:
        'Within the DEC Execution IT Business Analyst teams, I help monitor and improve electronic execution systems ' +
        'and processes on listed derivatives markets, working closely with business, Operations and IT teams.',
      missions: [
        {
          title: 'Mission 1 — FIX Allocation Analytics & Power BI Reporting',
          points: [
            'Enhanced an existing Power BI dashboard used to monitor FIX and FILE Allocation flows.',
            'Extracted and analysed data from an Oracle database using SQL queries.',
            'Built a centralised SQL view to feed the dashboard and standardise how the data is used.',
            'Developed and improved KPIs tracking allocation volumes, FIX messages, rejections and Processing Times.',
            'Analysed flows across several dimensions: client, market, Allocation Method, status and period.',
            'Improved visibility on anomalies, activity trends and processing delays to make operational monitoring easier.',
          ],
        },
        {
          title: 'Mission 2 — Algorithmic Trading & Execution Quality',
          points: [
            'Deepened my understanding of order execution mechanisms on Listed Derivatives markets.',
            'Studied Execution Quality KPIs, benchmarks, Transaction Costs and the gap between execution and reference prices, expressed in basis points (bps).',
            'Analysed the factors that can affect execution quality: algorithm used, market, order size and execution conditions.',
            "Contributed to monitoring Algorithmic Trading activity through the team's tools and dashboards.",
            'Built knowledge of the FIX Protocol, connectivity between Trading Systems, algorithm integration and Functional Tests.',
          ],
        },
      ],
      tools: bnpTools,
    },
    {
      title: 'Sales assistant',
      company: 'Family restaurant',
      logo: '',
      subtitle: 'Job',
      period: '06/2019 – 08/2022',
      location: 'Abidjan, Côte d’Ivoire',
      introTitle: '',
      intro:
        'Actively involved in running the family restaurant: welcoming and serving customers with a focus on their ' +
        'satisfaction, taking orders and coordinating service to keep everything running smoothly.',
      missions: [],
      tools: [],
    },
  ],

  education: [
    {
      title: 'Engineering degree — Data & Applications (apprenticeship)',
      school: 'ESIEE Paris — Gustave Eiffel University',
      period: '09/2024 – present',
      details:
        'Statistics, optimisation, relational databases, machine learning, deep learning, cybersecurity, ' +
        'project management, data mining with R, Python for data science, algorithms and graphs.',
    },
    {
      title: 'Preparatory classes for engineering schools (MPSI – MP*)',
      school: 'ESTEM Casablanca, Morocco',
      period: '09/2022 – 06/2024',
      details: 'Mathematics, Python, SQL, probability. Admitted to an engineering school.',
    },
    {
      title: 'Scientific Baccalaureate — with honours, top of my class',
      school: 'Lycée Moderne Port-Bouët, Abidjan',
      period: '09/2019 – 07/2022',
      details: '',
    },
  ],

  associations: [
    {
      name: 'Polymie Club — ESIEE Paris',
      role: 'Member',
      description: 'Debate sessions to strengthen my public speaking and argumentation skills.',
    },
    {
      name: 'Miss Mathematics 2022',
      role: 'Participant',
      description: 'Regional mathematics competition in Port-Bouët (Côte d’Ivoire).',
    },
    {
      name: 'Python training (non-profit)',
      role: 'Participant',
      description: 'Introduction to computer tools and Python programming.',
    },
  ],

  certifications: [
    { name: 'Foundations of AI', issuer: 'Madjid Khichane, PhD in AI — LinkedIn Learning' },
    { name: 'Power BI Essential Training', issuer: 'André Meyer-Roussilhon — LinkedIn Learning' },
    { name: 'Excel Dashboards', issuer: 'Martial Auroy — LinkedIn Learning' },
    { name: 'Pandas for data science', issuer: 'LinkedIn Learning' },
  ],

  skills: [
    { group: 'Languages', items: ['Python', 'SQL', 'C', 'R'] },
    { group: 'Data & BI', items: ['Power BI', 'Power Query', 'DAX', 'Excel / VBA', 'SAS', 'Dataiku', 'Salesforce'] },
    { group: 'Data science & AI', items: ['Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'TensorFlow', 'Keras'] },
    { group: 'Tools', items: ['Jupyter', 'Git & GitHub', 'VS Code', 'Linux', 'SQLite', 'PowerPoint', 'Canva'] },
    {
      group: 'Soft skills',
      items: ['Rigour', 'Autonomy', 'Team spirit', 'Curiosity', 'Listening', 'Adaptability', 'Analysis & synthesis', 'Organisation'],
    },
  ],

  languages: ['French (native)', 'English (B2)'],
  interests: ['Cooking', 'Drawing', 'Learning'],
};

export const content = { fr, en };
