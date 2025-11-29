import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { TooltipProvider, ToastContextProvider } from "@office/ui";
import { DriveApp } from "./components/DriveApp";
import "./index.css";

function App() {
  return (
    <Theme
      appearance="light"
      accentColor="blue"
      grayColor="slate"
      radius="medium"
      scaling="100%"
    >
      <ToastContextProvider>
        <TooltipProvider>
          <DriveApp />
        </TooltipProvider>
      </ToastContextProvider>
    </Theme>
  );
}

export default App;
