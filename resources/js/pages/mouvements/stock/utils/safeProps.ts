/**
 * Utilitaires pour gérer en sécurité les props Inertia
 */

/**
 * Récupère en toute sécurité une propriété depuis les props Inertia
 * @param props Les props Inertia
 * @param key La clé de la propriété à récupérer
 * @param defaultValue Valeur par défaut si la propriété n'existe pas
 */
export function getSafeProp<T>(
  props: Record<string, unknown> | undefined, 
  key: string, 
  defaultValue: T
): T {
  if (!props) return defaultValue;
  const value = props[key];
  return value !== undefined ? value as T : defaultValue;
}
