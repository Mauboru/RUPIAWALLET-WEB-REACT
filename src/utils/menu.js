import { TbLayoutDashboardFilled } from "react-icons/tb";
import { GiBowlOfRice, GiClockwork } from "react-icons/gi";
import { MdViewColumn } from "react-icons/md";

const menu = [
    {
        label: "Carteira",
        path: "/",
        icon: TbLayoutDashboardFilled,
        role: "",
        subItems: [
            { label: "Inserir Gasto", path: "/carteira/inserir", icon: GiClockwork },  
            { label: "Listar Gastos", path: "/carteira/listar", icon: GiBowlOfRice },
        ]
    },
    {
        label: "Gráficos",
        path: "/graficos",
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
