import { Theme } from '@radix-ui/themes';
import type { ReactNode } from 'react';

export interface ThemeProviderProps {
  children: ReactNode;
  appearance?: 'light' | 'dark' | 'inherit';
  accentColor?: 'blue' | 'cyan' | 'teal' | 'green' | 'orange' | 'red' | 'purple' | 'indigo';
  grayColor?: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  scaling?: '90%' | '95%' | '100%' | '105%' | '110%';
  panelBackground?: 'solid' | 'translucent';
}

export function ThemeProvider({
  children,
  appearance = 'light',
  accentColor = 'blue',
  grayColor = 'slate',
  radius = 'medium',
  scaling = '100%',
  panelBackground = 'solid',
}: ThemeProviderProps) {
  return (
    <Theme
      appearance={appearance}
      accentColor={accentColor}
      grayColor={grayColor}
      radius={radius}
      scaling={scaling}
      panelBackground={panelBackground}
      hasBackground={true}
    >
      {children}
    </Theme>
  );
}

export { Theme } from '@radix-ui/themes';
