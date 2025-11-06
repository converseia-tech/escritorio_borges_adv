import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { teamMembers } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const lucasBio = `Dr. Lucas Borges Languer é sócio-proprietário e fundador do Borges Advogados Associados, um escritório reconhecido por sua excelência no Direito Bancário e na defesa de vítimas de fraudes bancárias. Com uma carreira sólida e especializada, ele já contribuiu consideravelmente para que clientes protegessem seus direitos e recuperassem valores indevidamente retidos ou cobrados.

Como CEO do escritório, Dr. Lucas exerce um papel estratégico na administração, marketing e supervisão geral, garantindo que o Borges Advogados Associados esteja sempre à frente em inovação, eficiência e qualidade no atendimento jurídico. Sua visão empreendedora e liderança firme são essenciais para manter a equipe alinhada aos valores e objetivos do escritório.

Além de sua atuação técnica, o Dr. Lucas é conhecido por sua abordagem humanizada e comprometida, trabalhando incansavelmente para garantir o melhor resultado possível para cada cliente. Sua experiência e dedicação consolidam o Borges Advogados Associados como uma referência no mercado jurídico.`;

async function updateLucas() {
  try {
    // Buscar Lucas pelo nome
    const result = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.name, "Lucas Borges Languer"))
      .limit(1);

    if (result.length === 0) {
      console.log("Lucas Borges Languer não encontrado no banco de dados");
      return;
    }

    const lucas = result[0];

    // Atualizar biografia
    await db
      .update(teamMembers)
      .set({
        bio: lucasBio,
        position: "Advogado Sócio-Proprietário e CEO",
        oab: "OAB/SC 40.598",
      })
      .where(eq(teamMembers.id, lucas.id));

    console.log("✅ Biografia de Lucas Borges Languer atualizada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar:", error);
  }
}

updateLucas();
