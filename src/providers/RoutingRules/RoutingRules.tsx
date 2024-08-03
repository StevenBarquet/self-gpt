// ---Dependencies
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useKeysStore } from 'src/store/keys';

interface Props {
  children: React.ReactNode;
  className: string;
}

/**
 * RoutingRules Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function RoutingRules({ children, className }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const { ANTHROPIC_API_KEY, OPEN_AI_API_KEY, SUPABASE_KEY, SUPABASE_URL } = useKeysStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(
    () => handleRedirect(),
    [location.pathname, ANTHROPIC_API_KEY, OPEN_AI_API_KEY, SUPABASE_KEY, SUPABASE_URL],
  );

  // -----------------------MAIN METHODS
  function handleRedirect() {
    const defined = keysAreDefined();
    if (defined) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }
  function keysAreDefined() {
    const aiKeys = [ANTHROPIC_API_KEY, OPEN_AI_API_KEY];
    const hasAiKey = aiKeys.some((key) => typeof key === 'string' && !!key.length);

    const otherKeys = [SUPABASE_KEY, SUPABASE_URL];
    const otherKeysDefined = otherKeys.every((key) => typeof key === 'string' && !!key.length);

    // La función retorna verdadero solo si al menos una clave de AI está definida y todas las demás claves también lo están
    return hasAiKey && otherKeysDefined;
  }
  // -----------------------AUX MET'ANTHROPIC_API_KEY', 'OPEN_AI_API_KEY', 'SUPABASE_KEY', 'SUPABASE_URL']HODS
  // -----------------------RENDER
  return <div className={className}>{children}</div>;
}
