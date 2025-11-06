import { drizzle } from "drizzle-orm/mysql2";
import { 
  heroContent, 
  practiceAreas, 
  teamMembers, 
  aboutContent, 
  contactInfo,
  associatedLawyers,
  siteSettings
} from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...");

  try {
    // Hero Content
    await db.insert(heroContent).values({
      title: "Borges Advogados Associados",
      subtitle: "Transformando desafios jurídicos complexos em soluções eficazes e personalizadas",
      ctaText: "ENTRE EM CONTATO",
      backgroundImage: null,
    });
    console.log("✅ Hero content criado");

    // Practice Areas
    const areas = [
      {
        title: "Bancário - FRAUDES",
        icon: "bank",
        description: "RMC e Empréstimos Consignados: Para entender melhor os direitos e deveres relacionados a fraudes bancárias, empréstimos consignados não autorizados e recuperação de valores.",
        slug: "bancario-fraudes",
        displayOrder: 1,
      },
      {
        title: "Família",
        icon: "users",
        description: "O Direito de Família aborda questões relacionadas a casamento, divórcio, guarda de filhos, pensão alimentícia, partilha de bens e outras demandas familiares.",
        slug: "familia",
        displayOrder: 2,
      },
      {
        title: "Trabalhista",
        icon: "briefcase",
        description: "O Direito Trabalhista regula as relações entre empregadores e empregados, garantindo direitos como férias, 13º salário, FGTS, rescisões e ações trabalhistas.",
        slug: "trabalhista",
        displayOrder: 3,
      },
      {
        title: "Consumidor",
        icon: "shopping-cart",
        description: "O Direito do Consumidor visa proteger os direitos e interesses dos consumidores em relações de consumo, garantindo qualidade, segurança e respeito aos contratos.",
        slug: "consumidor",
        displayOrder: 4,
      },
      {
        title: "Previdenciário",
        icon: "shield",
        description: "O Direito Previdenciário trata das normas e princípios relacionados à Previdência Social, incluindo aposentadorias, pensões, auxílios e benefícios por incapacidade.",
        slug: "previdenciario",
        displayOrder: 5,
      },
    ];

    for (const area of areas) {
      await db.insert(practiceAreas).values(area);
    }
    console.log("✅ Áreas de atuação criadas");

    // Team Members
    const team = [
      {
        name: "Lucas Borges Languer",
        position: "Advogado Sócio Fundador e CEO",
        bio: "Advogado especializado em direito bancário e empresarial, com vasta experiência em litígios complexos.",
        image: null,
        oab: null,
        displayOrder: 1,
      },
      {
        name: "Patrícia Alves",
        position: "Advogada Sócia Controladora",
        bio: "Especialista em direito de família e sucessões, com atuação destacada em mediação e conciliação.",
        image: null,
        oab: "OAB/RS 37.731",
        displayOrder: 2,
      },
      {
        name: "Ana Clara Borges",
        position: "Estagiária",
        bio: "Estudante de Direito em formação, auxiliando nas demandas do escritório.",
        image: null,
        oab: null,
        displayOrder: 3,
      },
      {
        name: "Eduarda Carpes",
        position: "Advogada Associada",
        bio: "Advogada com experiência em direito trabalhista e previdenciário.",
        image: null,
        oab: "OAB/SC 70.699",
        displayOrder: 4,
      },
      {
        name: "Hemily Machado",
        position: "Advogada Associada",
        bio: "Especialista em direito do consumidor e contratos.",
        image: null,
        oab: null,
        displayOrder: 5,
      },
      {
        name: "Milena Schoenell",
        position: "Advogada Associada",
        bio: "Atuação em direito civil e empresarial.",
        image: null,
        oab: null,
        displayOrder: 6,
      },
      {
        name: "Débora Mendes",
        position: "Advogada Associada",
        bio: "Especialista em direito previdenciário.",
        image: null,
        oab: null,
        displayOrder: 7,
      },
      {
        name: "Laura Garcia",
        position: "Advogada Associada",
        bio: "Atuação em direito de família e sucessões.",
        image: null,
        oab: null,
        displayOrder: 8,
      },
      {
        name: "João Vitor Correa",
        position: "Advogado Associado",
        bio: "Especialista em direito trabalhista.",
        image: null,
        oab: null,
        displayOrder: 9,
      },
      {
        name: "Bruno da Motta",
        position: "Advogado Associado",
        bio: "Atuação em direito bancário e recuperação de crédito.",
        image: null,
        oab: null,
        displayOrder: 10,
      },
    ];

    for (const member of team) {
      await db.insert(teamMembers).values(member);
    }
    console.log("✅ Membros da equipe criados");

    // Associated Lawyers (sidebar)
    const lawyers = [
      { name: "Dra. Patrícia Alves", oab: "OAB/RS 37.731", displayOrder: 1 },
      { name: "Dra. Eduarda Carpes", oab: "OAB/SC 70.699", displayOrder: 2 },
    ];

    for (const lawyer of lawyers) {
      await db.insert(associatedLawyers).values(lawyer);
    }
    console.log("✅ Advogados associados criados");

    // About Content
    await db.insert(aboutContent).values({
      title: "Borges Advogados Associados",
      subtitle: "CONHEÇA NOSSA HISTÓRIA",
      content: "O escritório Borges Advogados Associados, atua com uma equipe de advogados experientes nas principais áreas do Direito. Acreditamos numa advocacia moderna e que caminha junto com seu cliente. O sucesso do nosso cliente é o nosso sucesso.",
      image: null,
    });
    console.log("✅ Conteúdo sobre nós criado");

    // Contact Info
    await db.insert(contactInfo).values({
      phone: null,
      address: null,
      email: null,
      whatsapp: null,
      hours: JSON.stringify({
        "Segunda-feira": "09:00 - 18:00",
        "Terça-feira": "09:00 - 18:00",
        "Quarta-feira": "09:00 - 18:00",
        "Quinta-feira": "09:00 - 18:00",
        "Sexta-feira": "09:00 - 17:00",
      }),
    });
    console.log("✅ Informações de contato criadas");

    // Site Settings
    await db.insert(siteSettings).values({
      logoUrl: null,
      faviconUrl: null,
      socialMedia: JSON.stringify({
        whatsapp: null,
        instagram: null,
        facebook: null,
      }),
    });
    console.log("✅ Configurações do site criadas");

    console.log("🎉 Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
