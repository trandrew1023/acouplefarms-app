import { useNavigate } from 'react-router-dom';

export const History = {
  navigate: null,
  push: (page, ...rest) => History.navigate(page, ...rest),
};

export default function NavigateSetter() {
  History.navigate = useNavigate();
  return null;
}
