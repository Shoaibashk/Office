import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { TooltipProvider, ToastContextProvider } from "@office/ui";
import { SheetApp } from "./components/SheetApp";
import "./index.css";

function App() {
  return (
    <Theme
      appearance="light"
      accentColor="green"
      grayColor="slate"
      radius="medium"
      scaling="100%"
    >
      <ToastContextProvider>
        <TooltipProvider>
          <SheetApp />
        </TooltipProvider>
      </ToastContextProvider>
    </Theme>
  );
}

export default App;
