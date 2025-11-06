// Cores do tema Borges Advogados
export const COLORS = {
  primary: "#D4AF37", // Dourado
  secondary: "#000000", // Preto
  white: "#FFFFFF",
  gray: {
    light: "#F5F5F5",
    medium: "#999999",
    dark: "#333333",
  },
  background: "#FFFFFF",
  text: "#333333",
};

// Navegação
export const NAV_ITEMS = [
  { label: "HOME", path: "/" },
  { label: "SOBRE NÓS", path: "/sobre-nos" },
  { 
    label: "ÁREAS DE ATUAÇÃO", 
    path: "/areas-de-atuacao",
    dropdown: true,
  },
  { 
    label: "EQUIPE", 
    path: "/equipe",
    dropdown: true,
  },
  { label: "CONTATO", path: "/contato" },
];

// Horários de atendimento
export const OFFICE_HOURS = {
  weekdays: {
    label: "SEGUNDA À QUINTA",
    morning: "09:00h às 12:00h",
    afternoon: "13:00h às 18:00h",
  },
  friday: {
    label: "SEXTA",
    morning: "09:00h às 12:00h",
    afternoon: "13:00h às 17:00h",
  },
};
