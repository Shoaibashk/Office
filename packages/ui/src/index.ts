// Re-export all components
export * from './components';

// Re-export hooks
export * from './hooks';

// Re-export utilities
export * from './utils';

// Re-export theme (note: .tsx extension required)
export { ThemeProvider, Theme } from './theme/index';
export type { ThemeProviderProps } from './theme/index';

// Re-export Radix Icons for convenience
export * from '@radix-ui/react-icons';

// Re-export commonly used Radix Themes components
export {
    Avatar,
    Badge,
    Blockquote,
    Callout,
    Code,
    DataList,
    Em,
    Heading,
    Kbd,
    Link,
    Quote,
    ScrollArea,
    Separator,
    Skeleton,
    Slider,
    Spinner,
    Strong,
    Table,
    Text,
    Progress,
} from '@radix-ui/themes';


