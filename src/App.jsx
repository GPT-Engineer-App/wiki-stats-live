import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert.jsx";
import "./App.css";

function App() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://en.wikipedia.org/w/api.php?action=query&format=json&meta=siteinfo&siprop=statistics&origin=*")
      .then(response => response.json())
      .then(data => setStats(data.query.statistics))
      .catch(error => setError(error));
  }, []);

  return (
    <div className="App">
      <Card>
        <CardHeader>
          <CardTitle>Wikipedia Live Stats</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ) : stats ? (
            <div>
              <p>Articles: {stats.articles}</p>
              <p>Pages: {stats.pages}</p>
              <p>Edits: {stats.edits}</p>
              <p>Images: {stats.images}</p>
              <p>Users: {stats.users}</p>
              <p>Active Users: {stats.activeusers}</p>
              <p>Admins: {stats.admins}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;