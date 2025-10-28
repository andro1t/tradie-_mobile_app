// drawerItems.js
import Icon from 'react-native-vector-icons/FontAwesome';

export const drawerItems = [
  {
    label: 'Home',
    route: 'home',
    icon: (color, size) => <Icon name="home" color={color} size={size} />,
  },
  {
    label: 'Chat',
    route: 'chat',
    icon: (color, size) => <Icon name="comments" color={color} size={size} />,
  },
  {
    label: 'About',
    route: 'about',
    icon: (color, size) => <Icon name="info-circle" color={color} size={size} />,
  },
  {
    label: 'Settings',
    route: 'settings',
    icon: (color, size) => <Icon name="cog" color={color} size={size} />,
  },
];