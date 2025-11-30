import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Activities from "./pages/activities/Activities";
import NewActivity from "./pages/activities/NewActivity";
import Groups from "./pages/groups/Groups";
import Meetings from "./pages/meetings/Meetings";
import Contents from "./pages/contents/Contents";
import Leaderboard from "./pages/leaderboard/Leaderboard";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/activities"} component={Activities} />
      <Route path={"/activities/new"} component={NewActivity} />
      <Route path={"/groups"} component={Groups} />
      <Route path={"/meetings"} component={Meetings} />
      <Route path={"/contents"} component={Contents} />
      <Route path={"/leaderboard"} component={Leaderboard} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
