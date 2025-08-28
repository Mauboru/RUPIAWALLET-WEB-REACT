import { MdViewColumn, MdAdd, MdSearch, MdCategory, MdAttachMoney } from "react-icons/md";

const menu = [
  {
    label: "Inserir",
    path: "/inserir",
    icon: MdAdd,
    role: "",
    subItems: [
    { label: "Transações", path: "/inserir/transacoes", icon: MdAttachMoney }, // dinheiro
    { label: "Categorias", path: "/inserir/categorias", icon: MdCategory },
    ]
  },
  {
    label: "Buscar",
    path: "/buscar",
    icon: MdSearch,
    role: "",
  },
  {
    label: "Gráficos",
    path: "/dashboards",
    icon: MdViewColumn,
    role: "",
  }
];

export const getMenuByRole = (role) => {
  return menu.filter(item => {
    if (item.role && item.role !== role) return false;
    return true;
  });
};

export default menu;