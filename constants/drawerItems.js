// drawerItems.js
import Icon from "react-native-vector-icons/FontAwesome";

export const drawerItems = [
  // ===== GENERAL =====
  {
    type: "section",
    label: "General",
  },
  {
    label: "Dashboard",
    route: "home",
    icon: (color, size) => <Icon name="home" color={color} size={size} />,
  },
  {
    label: "Chat",
    route: "chat",
    icon: (color, size) => <Icon name="comments" color={color} size={size} />,
  },
  {
    label: "Profile",
    route: "profile",
    icon: (color, size) => <Icon name="user" color={color} size={size} />,
  },

  // ===== SERVICES =====
  {
    type: "section",
    label: "Services",
  },
  {
    label: "Service Categories",
    route: "service_categories",
    icon: (color, size) => <Icon name="th-list" color={color} size={size} />,
  },
  {
    label: "Service",
    route: "service",
    icon: (color, size) => <Icon name="wrench" color={color} size={size} />,
  },
  {
    label: "Service Tips",
    route: "service_tips",
    icon: (color, size) => (
      <Icon name="lightbulb-o" color={color} size={size} />
    ),
  },

  // ===== CUSTOMERS =====
  {
    type: "section",
    label: "Customers",
  },
  {
    label: "All Customers",
    route: "all_customers",
    icon: (color, size) => <Icon name="users" color={color} size={size} />,
  },
  {
    label: "Add Customers",
    route: "add_customers",
    icon: (color, size) => <Icon name="user-plus" color={color} size={size} />,
  },
  {
    label: "Export Customer",
    route: "export_customer",
    icon: (color, size) => <Icon name="download" color={color} size={size} />,
  },

  // ===== TECHNICIANS =====
  {
    type: "section",
    label: "Technicians",
  },
  {
    label: "All Technician",
    route: "all_technician",
    icon: (color, size) => <Icon name="id-badge" color={color} size={size} />,
  },
  {
    label: "Add Technician",
    route: "add_technician",
    icon: (color, size) => <Icon name="user-plus" color={color} size={size} />,
  },

  // ===== OTHERS =====
  {
    type: "section",
    label: "Others",
  },
  {
    label: "Settings",
    route: "settings",
    icon: (color, size) => <Icon name="cog" color={color} size={size} />,
  },
  {
    label: "About",
    route: "about",
    icon: (color, size) => (
      <Icon name="info-circle" color={color} size={size} />
    ),
  },
];
