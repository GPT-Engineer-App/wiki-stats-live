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
  const [countdown, setCountdown] = useState(10);

  const fetchStats = () => {
    fetch("https://en.wikipedia.org/w/api.php?action=query&format=json&meta=siteinfo&siprop=statistics&origin=*")
      .then(response => response.json())
      .then(data => {
        setStats(data.query.statistics);
        setCountdown(10); // Reset countdown
      })
      .catch(error => setError(error));
  };

  useEffect(() => {
    fetchStats(); // Initial fetch

    const interval = setInterval(() => {
      fetchStats();
    }, 10000); // Fetch every 10 seconds

    const countdownInterval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 10));
    }, 1000); // Countdown every second

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
    };
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
              <p>Next refresh in: {countdown} seconds</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>
      <Button onClick={fetchStats} className="mt-4">Refresh Now</Button>
    </div>
  );
}

export default App;