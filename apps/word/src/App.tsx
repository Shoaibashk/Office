import "@radix-ui/themes/styles.css";
import {
  ThemeProvider,
  TooltipProvider,
  ToastContextProvider,
} from "@office/ui";
import { WordApp } from "./components/WordApp";
import "./index.css";

function App() {
  return (
    <ThemeProvider
      appearance="light"
      accentColor="blue"
      grayColor="slate"
      radius="medium"
      scaling="100%"
    >
      <ToastContextProvider>
        <TooltipProvider>
          <WordApp />
        </TooltipProvider>
      </ToastContextProvider>
    </ThemeProvider>
  );
}

export default App;
