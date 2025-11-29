import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { TooltipProvider, ToastContextProvider } from "@office/ui";
import { SlidesApp } from "./components/SlidesApp";
import "./index.css";

function App() {
  return (
    <Theme
      appearance="light"
      accentColor="orange"
      grayColor="slate"
      radius="medium"
      scaling="100%"
    >
      <ToastContextProvider>
        <TooltipProvider>
          <SlidesApp />
        </TooltipProvider>
      </ToastContextProvider>
    </Theme>
  );
}

export default App;
